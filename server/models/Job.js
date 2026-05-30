const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote']
  },
  salary: {
    type: String
  },
  applyUrl: {
    type: String
  },
  deadline: {
    type: Date
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter'
  },
  source: {
    type: String,
    enum: ['hirex', 'jsearch']
  },
  employerLogo: {
    type: String
  },
  qualifications: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  publisher: {
    type: String
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  applicants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'Pending'
    }
  }],
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
