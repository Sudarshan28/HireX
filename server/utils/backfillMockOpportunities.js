const connectDB = require('../config/db');
const Job = require('../models/Job');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const companies = [
  'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Tesla', 'Adobe', 'Nvidia', 'Intel',
  'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Paypal', 'Square', 'Salesforce', 'Slack', 'Zoom', 'Spotify',
  'Shopify', 'Twitter', 'Pinterest', 'Snapchat', 'Tiktok', 'Oracle', 'IBM', 'Cisco', 'HP', 'Dell',
  'Flipkart', 'Paytm', 'PhonePe', 'Razorpay', 'CRED', 'Swiggy', 'Zomato', 'Ola', 'Meesho', 'InMobi',
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL', 'Tech Mahindra', 'L&T InfoTech', 'Capgemini', 'Accenture', 'Deloitte',
  'MathWorks', 'ARM', 'Kigen', 'UnitedHealth Group', 'Samsung', 'Sony', 'Panasonic', 'LG', 'HTC', 'Asus',
  'GitHub', 'GitLab', 'Atlassian', 'Datadog', 'Splunk', 'New Relic', 'Dynatrace', 'Elastic', 'MongoDB', 'Redis',
  'Confluent', 'Snowflake', 'Cloudera', 'Palantir', 'Twilio', 'SendGrid', 'Postman', 'PostgreSQL', 'Docker', 'Kubernetes',
  'Vercel', 'Netlify', 'Cloudflare', 'Fastly', 'DigitalOcean', 'Linode', 'AWS', 'GCP', 'Azure', 'Heroku'
];

const locations = [
  'Bangalore, Karnataka, IN', 'Pune, Maharashtra, IN', 'Noida, Uttar Pradesh, IN', 'Gurgaon, Haryana, IN',
  'Hyderabad, Telangana, IN', 'Mumbai, Maharashtra, IN', 'Chennai, Tamil Nadu, IN', 'Kolkata, West Bengal, IN',
  'San Francisco, CA, US', 'Seattle, WA, US', 'New York, NY, US', 'Austin, TX, US', 'Boston, MA, US',
  'London, UK', 'Dublin, IE', 'Berlin, DE', 'Amsterdam, NL', 'Singapore, SG', 'Tokyo, JP', 'Sydney, AU'
];

const publishers = [
  'LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'ZipRecruiter', 'Direct Portal', 'Careers Hub', 'TechJobs'
];

const roleTemplates = [
  {
    title: 'Software Engineering Intern',
    skills: ['JavaScript', 'Python', 'Java', 'Git', 'Data Structures', 'Algorithms'],
    description: 'We are looking for a Software Engineering Intern to join our core engineering team. You will work on writing clean, scalable code, debugging issues, and building new features for our SaaS product. You should have a strong understanding of computer science fundamentals, data structures, and algorithms.',
    qualifications: [
      'Pursuing a Bachelor\'s or Master\'s degree in Computer Science, Software Engineering, or related field.',
      'Proficiency in at least one programming language (Java, C++, Python, or JavaScript).',
      'Solid understanding of object-oriented programming concepts.'
    ],
    responsibilities: [
      'Write clean, testable, and maintainable code under the guidance of senior developers.',
      'Collaborate with product designers and engineers to implement modern user interfaces.',
      'Identify bottlenecks and bug fixes across our application stack.'
    ],
    benefits: ['Competitive monthly stipend', 'Flexible work schedules', 'Mentorship from industry veterans', 'Pre-placement offer opportunities']
  },
  {
    title: 'Frontend Developer Intern',
    skills: ['React', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'TailwindCSS'],
    description: 'Join our design and engineering team as a Frontend Developer Intern. You will help build and polish responsive, modern user interfaces using React and TailwindCSS. You will work closely with designers to translate UI/UX wireframes into functional web pages.',
    qualifications: [
      'Strong familiarity with HTML, CSS, and modern JavaScript standards (ES6+).',
      'Basic experience building web application interfaces with React.',
      'Understanding of client-side performance optimization.'
    ],
    responsibilities: [
      'Build reusable UI elements and component libraries.',
      'Optimize web pages for mobile and desktop screens.',
      'Integrate frontend applications with RESTful APIs.'
    ],
    benefits: ['Monthly learning allowance', 'Stipend', 'Certificate of Completion', 'Regular team events']
  },
  {
    title: 'Backend Developer Intern',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'SQL'],
    description: 'We are hiring a Backend Developer Intern to design, build, and optimize backend web services and database schemas. You will work closely with the frontend engineering team to build scalable APIs and manage data storage solutions.',
    qualifications: [
      'Solid understanding of database systems (SQL and NoSQL).',
      'Familiarity with server-side JavaScript (Node.js/Express) or Python (Django/Flask).',
      'Basic knowledge of HTTP protocols and RESTful API standards.'
    ],
    responsibilities: [
      'Develop backend routes, controllers, and middleware logic.',
      'Perform database queries and construct efficient schemas.',
      'Write comprehensive unit tests for server endpoints.'
    ],
    benefits: ['Mentorship program', 'Stipend', 'Work equipment provided', 'Health benefits']
  },
  {
    title: 'MERN Stack Developer Intern',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TailwindCSS'],
    description: 'We are seeking a MERN Stack Developer Intern to work across our full JavaScript stack. You will develop both the frontend client and the backend server, maintaining seamless data flow between React, Express, and MongoDB.',
    qualifications: [
      'Proficiency in React and Node.js.',
      'Understanding of state management in React (Redux/Context API).',
      'Experience database operations with MongoDB.'
    ],
    responsibilities: [
      'Develop end-to-end features from UI components to database models.',
      'Debug and fix web application issues across both client and server codebases.',
      'Contribute to sprint planning and agile workflow sessions.'
    ],
    benefits: ['Stipend', 'Flexible work-from-home policy', 'Pre-placement interview (PPI) opportunity']
  },
  {
    title: 'Data Science Intern',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'SQL', 'Data Visualization'],
    description: 'Join our Analytics team as a Data Science Intern. You will help clean and analyze complex datasets, build machine learning models, and create dashboards to extract actionable business insights.',
    qualifications: [
      'Pursuing a degree in Statistics, Data Science, Mathematics, or Computer Science.',
      'Strong programming skills in Python or R.',
      'Knowledge of basic SQL for data querying and processing.'
    ],
    responsibilities: [
      'Clean, pre-process, and validate data streams for machine learning applications.',
      'Build and evaluate statistical models for classification or regression.',
      'Visualize insights using tools like Tableau, PowerBI, or Matplotlib.'
    ],
    benefits: ['Stipend', 'Access to internal training courses', 'Industry mentorship']
  },
  {
    title: 'DevOps Engineering Intern',
    skills: ['Docker', 'AWS', 'Linux', 'Git', 'CI/CD', 'Bash'],
    description: 'We are seeking a DevOps Engineering Intern to help build, maintain, and scale our cloud infrastructure and continuous deployment pipelines.',
    qualifications: [
      'Basic understanding of cloud platforms like AWS, GCP, or Azure.',
      'Familiarity with containerization concepts using Docker.',
      'Basic scripting skills in Bash or Python.'
    ],
    responsibilities: [
      'Help maintain CI/CD pipelines (GitHub Actions, GitLab CI).',
      'Configure cloud servers, load balancers, and security groups.',
      'Monitor application health and troubleshoot server outages.'
    ],
    benefits: ['AWS Certification sponsorship', 'Stipend', 'Flexible working hours']
  },
  {
    title: 'Android Developer Intern',
    skills: ['Kotlin', 'Java', 'Android SDK', 'Git', 'REST APIs'],
    description: 'Join our Mobile team to develop native Android applications. You will work on writing clean Kotlin code, designing user-friendly interfaces, and integrating mobile clients with backend REST APIs.',
    qualifications: [
      'Knowledge of Java or Kotlin programming languages.',
      'Basic experience with Android Studio and Android SDK components.',
      'Familiarity with asynchronous programming and API integrations.'
    ],
    responsibilities: [
      'Develop native mobile UI screens based on designer mocks.',
      'Integrate networking clients to fetch and display application data.',
      'Debug issues and resolve crashes reported by users.'
    ],
    benefits: ['Stipend', 'Pre-placement offer eligibility', 'Flexible hours']
  },
  {
    title: 'Machine Learning Intern',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Git'],
    description: 'We are looking for a Machine Learning Intern to assist in training, testing, and deploying deep learning models for computer vision and natural language processing tasks.',
    qualifications: [
      'Experience building models with PyTorch or TensorFlow.',
      'Good understanding of machine learning theory and mathematical foundations.',
      'Familiarity with training models on GPU environments.'
    ],
    responsibilities: [
      'Evaluate state-of-the-art architectures for our specific domains.',
      'Fine-tune pre-trained transformer and convolutional models.',
      'Pre-process and label training data sets.'
    ],
    benefits: ['High stipend', 'Research paper publication support', 'Mentorship']
  }
];

const backfill = async () => {
  await connectDB();
  console.log('Initiating internship backfill engine...');

  const workModes = ['Remote', 'Hybrid', 'On-site'];
  const newJobs = [];

  // Let's generate 1050 internships (350 Remote, 350 Hybrid, 350 On-site)
  const countPerMode = 350;

  for (const mode of workModes) {
    console.log(`Generating ${countPerMode} ${mode} internships...`);
    for (let i = 0; i < countPerMode; i++) {
      // Pick random values
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const publisher = publishers[Math.floor(Math.random() * publishers.length)];
      const template = roleTemplates[Math.floor(Math.random() * roleTemplates.length)];

      const isRemote = mode === 'Remote';
      
      const title = `${template.title} (${company})`;
      const applyUrl = `https://careers.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/jobs/apply-${Math.floor(Math.random() * 100000)}`;

      newJobs.push({
        title: template.title,
        company,
        location: isRemote ? 'Remote' : location,
        description: template.description,
        skills: template.skills,
        type: 'Internship',
        workType: mode,
        isRemote,
        applyUrl,
        salary: `${Math.floor(Math.random() * 20) + 10}k - ${Math.floor(Math.random() * 20) + 30}k INR / Month`,
        postedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000), // within last 10 days
        source: 'jsearch',
        employerLogo: '',
        qualifications: template.qualifications,
        responsibilities: template.responsibilities,
        benefits: template.benefits,
        publisher
      });
    }
  }

  console.log(`Inserting ${newJobs.length} new internships into MongoDB...`);
  const result = await Job.insertMany(newJobs);
  console.log(`Successfully backfilled ${result.length} internships!`);
  
  process.exit(0);
};

backfill().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
