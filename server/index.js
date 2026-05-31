// Handle uncaught exceptions first
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP if it interferes with client loading or API calls in simple setups
}));

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parser
app.use(express.json());

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 authentication requests per windowMs
  message: {
    success: false,
    message: 'Too many login or registration attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobs', jobRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // Root route for development
  app.get('/', (req, res) => {
    res.send('HireX API is running in development...');
  });
}

// Error handling middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Background Simulated ATS Sync Loop
const Job = require('./models/Job');
setInterval(async () => {
  try {
    const jobs = await Job.find({ "applicants.status": { $in: ["Pending", "Shortlisted"] } });
    if (jobs.length === 0) return;

    const eligibleJobs = jobs.filter(j => j.applicants.some(a => ["Pending", "Shortlisted"].includes(a.status)));
    if (eligibleJobs.length === 0) return;

    const randomJob = eligibleJobs[Math.floor(Math.random() * eligibleJobs.length)];
    const eligibleApplicants = randomJob.applicants.filter(a => ["Pending", "Shortlisted"].includes(a.status));
    const randomApplicant = eligibleApplicants[Math.floor(Math.random() * eligibleApplicants.length)];

    const oldStatus = randomApplicant.status;
    let newStatus = oldStatus;
    const rand = Math.random();

    if (oldStatus === 'Pending') {
      if (rand < 0.4) {
        newStatus = 'Shortlisted';
      } else if (rand >= 0.4 && rand < 0.7) {
        newStatus = 'Rejected';
      } else {
        newStatus = 'Hired';
      }
    } else if (oldStatus === 'Shortlisted') {
      if (rand < 0.5) {
        newStatus = 'Hired';
      } else {
        newStatus = 'Rejected';
      }
    }

    if (newStatus !== oldStatus) {
      randomApplicant.status = newStatus;
      await randomJob.save();
      console.log(`[BACKGROUND SYNC] Updated status for applicant in job ${randomJob.title} (${randomJob.company}) from ${oldStatus} to ${newStatus}`);
    }
  } catch (err) {
    console.error('Error in background ATS simulator loop:', err);
  }
}, 45000); // run every 45 seconds

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

