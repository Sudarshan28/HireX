const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },
  university: {
    type: String
  },
  graduationYear: {
    type: Number
  },
  resumeUrl: {
    type: String
  },
  resumeText: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  lastLoginDate: {
    type: String
  },
  lastLoginTime: {
    type: String
  },
  lastLoginDevice: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
