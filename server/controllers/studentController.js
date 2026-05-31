const Student = require('../models/Student');
const Job = require('../models/Job');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { detectSkills } = require('../utils/skillDetector');
const { calculateMatchPercentage } = require('../utils/matcherHelper');
const Recruiter = require('../models/Recruiter');
const { sendApplicationReceivedEmail } = require('../utils/emailService');

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdfParse(fileBuffer);
    const resumeText = parsedPdf.text || '';
    
    // Validate that the uploaded document is a valid resume or CV
    const lowercaseText = resumeText.toLowerCase();
    const numPages = parsedPdf.numpages || parsedPdf.numPages || 0;

    // 1. Page count validation: resumes are typically 1-3 pages. Block long manuals/reports.
    if (numPages > 3) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        message: `Validation failed: The uploaded document has ${numPages} pages. Only resumes or CVs (1-3 pages) are accepted here.`
      });
    }

    // 2. Text length validation: a valid resume typically has between 400 and 15,000 characters
    const textLength = resumeText.trim().length;
    if (textLength < 400 || textLength > 15000) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({ 
        success: false, 
        message: `Validation failed: The document text length (${textLength} characters) is outside the expected range (400 - 15,000 characters) for a resume.` 
      });
    }

    // 3. Contact information check: a valid resume must contain a contact email address
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (!emailRegex.test(resumeText)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        message: 'Validation failed: No contact email address was found. A valid resume or CV must contain contact information (email).'
      });
    }

    // 4. Section headers validation: check for common resume structural sections
    const resumeKeywords = [
      'experience', 'education', 'skills', 'projects', 'work', 'employment', 
      'history', 'curriculum vitae', 'cv', 'resume', 'activities', 
      'coursework', 'certifications', 'languages', 'contact', 'summary'
    ];
    
    // Count how many structural resume sections/keywords appear in the text
    const keywordMatches = resumeKeywords.filter(keyword => lowercaseText.includes(keyword));
    
    // If the document contains less than 3 distinct resume-typical sections/keywords, reject it
    if (keywordMatches.length < 3) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        message: `Validation failed: Missing standard sections like Education, Experience, or Skills (only ${keywordMatches.length} matching sections found).`
      });
    }

    // 5. Exclusion of Academic reports, lab manuals, and assignments
    const academicKeywords = [
      'aim:', 'apparatus', 'lab manual', 'procedure', 'experiment', 'assignment', 
      'roll no', 'submitted to', 'index table', "teacher's signature", 'course name'
    ];
    const academicMatches = academicKeywords.filter(keyword => lowercaseText.includes(keyword));
    if (academicMatches.length >= 2) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        message: 'Validation failed: This file looks like an academic lab manual, report, or assignment and is not a valid resume/CV.'
      });
    }

    // Auto-detect skills
    const detectedSkills = detectSkills(resumeText);

    // Save details to the Student document
    const student = await Student.findById(req.user.id);
    if (!student) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.resumeUrl = `/uploads/${req.file.filename}`;
    student.resumeText = resumeText;
    
    // Overwrite candidate's skills with the ones detected in this resume to prevent matching score drift
    student.skills = detectedSkills;
    
    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        university: student.university,
        graduationYear: student.graduationYear,
        skills: student.skills,
        resumeUrl: student.resumeUrl
      },
      message: 'Resume uploaded and processed successfully'
    });
  } catch (error) {
    console.error('Error uploading/processing resume:', error);
    return res.status(500).json({ success: false, message: 'Failed to process resume' });
  }
};

// Matched jobs (call Python matcher)
exports.getMatchedJobs = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const query = {};

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.type) {
      if (req.query.type === 'Jobs-Only') {
        query.type = { $ne: 'Internship' };
      } else {
        query.type = req.query.type;
      }
    }

    if (req.query.workType && req.query.workType !== 'All') {
      query.workType = req.query.workType;
    }

    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    const jobs = await Job.find(query);

    // Automatically trigger JSearch background crawl if jobs in database are low (non-blocking)
    if (jobs.length < 15) {
      const { runBackgroundSync } = require('../utils/jsearchFetch');
      const searchTerms = req.query.search || (req.query.type === 'Internship' ? 'Software Engineering Intern India' : 'Software Engineer India');
      runBackgroundSync(searchTerms);
    }

    
    const mapJobWithRelevance = (job, matchScore = 0) => {
      let relevance = 0;
      if (req.query.search) {
        const searchLower = req.query.search.toLowerCase().trim();
        const titleLower = (job.title || '').toLowerCase().trim();
        const companyLower = (job.company || '').toLowerCase().trim();
        const descLower = (job.description || '').toLowerCase().trim();
        
        // Exact match boosts
        if (titleLower === searchLower) relevance += 10000;
        if (companyLower === searchLower) relevance += 5000;
        
        // Word boundary matches
        const titleWords = titleLower.split(/\W+/);
        const companyWords = companyLower.split(/\W+/);
        if (titleWords.includes(searchLower)) relevance += 2000;
        if (companyWords.includes(searchLower)) relevance += 1000;
        
        // Substring matches
        if (titleLower.includes(searchLower)) relevance += 500;
        if (companyLower.includes(searchLower)) relevance += 250;
        if (descLower.includes(searchLower)) relevance += 50;
      }
      
      if (req.query.location) {
        const locSearchLower = req.query.location.toLowerCase().trim();
        const locLower = (job.location || '').toLowerCase().trim();
        if (locLower === locSearchLower) relevance += 2000;
        else if (locLower.includes(locSearchLower)) relevance += 1000;
      }
      
      return {
        ...job.toObject(),
        matchScore,
        relevance
      };
    };
    
    if (!student.resumeText || jobs.length === 0) {
      // Default match score of 0
      const jobsWithScores = jobs.map(j => mapJobWithRelevance(j, 0));
      
      if (req.query.search) {
        jobsWithScores.sort((a, b) => {
          if (b.relevance !== a.relevance) {
            return b.relevance - a.relevance;
          }
          return new Date(b.postedAt) - new Date(a.postedAt);
        });
      } else if (req.query.sortByMatch === 'false') {
        jobsWithScores.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      }
      return res.status(200).json({ success: true, data: jobsWithScores });
    }

    // Call Python matcher
    const matcherUrl = process.env.PYTHON_MATCHER_URL || 'http://localhost:5001';
    let rankedJobs = [];
    try {
      const response = await axios.post(`${matcherUrl}/match`, {
        resumeText: student.resumeText,
        jobs: jobs.map(j => ({ id: j._id, description: j.description || '' }))
      });
      rankedJobs = response.data.rankedJobs || [];
    } catch (err) {
      console.warn('Python matcher microservice failed or unreachable. Falling back to skill and keyword matching only.');
      rankedJobs = jobs.map(j => ({ id: j._id.toString(), score: 0.3 })); // default base score for hybrid matcher
    }

    // Map scores to jobs
    const jobsWithScores = jobs.map(job => {
      const scoreObj = rankedJobs.find(rj => rj.id.toString() === job._id.toString());
      const rawScore = scoreObj ? scoreObj.score : 0.3;
      
      // Calculate matching percentage combining keywords, resume, and job details
      const matchScore = calculateMatchPercentage(
        student.resumeText,
        job.description || '',
        job.skills || [],
        student.skills || [],
        rawScore
      );
      
      return mapJobWithRelevance(job, matchScore);
    });

    // Sort criteria
    if (req.query.search) {
      jobsWithScores.sort((a, b) => {
        // Primary sort: Search relevance
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }
        // Secondary sort: Match score or post date
        if (req.query.sortByMatch === 'false') {
          return new Date(b.postedAt) - new Date(a.postedAt);
        }
        return b.matchScore - a.matchScore;
      });
    } else {
      if (req.query.sortByMatch === 'false') {
        jobsWithScores.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      } else {
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    return res.status(200).json({
      success: true,
      data: jobsWithScores
    });
  } catch (error) {
    console.error('Error fetching matched jobs:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(a => a.student.toString() === student._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    // Calculate match score for this job (calling Python matcher)
    let score = 50;
    if (student.resumeText) {
      const matcherUrl = process.env.PYTHON_MATCHER_URL || 'http://localhost:5001';
      let rawScore = 0.3;
      try {
        const response = await axios.post(`${matcherUrl}/match`, {
          resumeText: student.resumeText,
          jobs: [{ id: job._id, description: job.description || '' }]
        });
        const ranked = response.data.rankedJobs || [];
        if (ranked.length > 0) {
          rawScore = ranked[0].score;
        }
      } catch (err) {
        console.warn('Python matcher failed during apply, falling back to keyword similarity');
      }
      
      score = calculateMatchPercentage(
        student.resumeText,
        job.description || '',
        job.skills || [],
        student.skills || [],
        rawScore
      );
    }

    // Add student to job applicants
    job.applicants.push({
      student: student._id,
      appliedAt: new Date(),
      status: 'Pending'
    });
    await job.save();

    // Add job to student's appliedJobs
    if (!student.appliedJobs.includes(job._id)) {
      student.appliedJobs.push(job._id);
      await student.save();
    }

    // Send email notification to recruiter
    if (job.postedBy) {
      Recruiter.findById(job.postedBy).then(recruiter => {
        if (recruiter) {
          sendApplicationReceivedEmail(
            recruiter.email,
            recruiter.name,
            job.title,
            student.name,
            score
          ).catch(err => {
            console.error('Failed to send recruiter application notification:', err);
          });
        }
      }).catch(err => {
        console.error('Error finding recruiter for application notification:', err);
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Applied successfully'
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get applied jobs
exports.getAppliedJobs = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const jobs = await Job.find({ _id: { $in: student.appliedJobs } });
    
    // Auto-cleanup deleted/invalid jobs or jobs where the student is not in applicants
    const validJobIds = new Set();
    jobs.forEach(job => {
      if (job.applicants) {
        const applicantInfo = job.applicants.find(a => a.student && a.student.toString() === req.user.id.toString());
        if (applicantInfo) {
          validJobIds.add(job._id.toString());
        }
      }
    });

    const initialCount = student.appliedJobs.length;
    student.appliedJobs = student.appliedJobs.filter(id => id && validJobIds.has(id.toString()));
    if (student.appliedJobs.length !== initialCount) {
      await student.save();
    }

    const activeJobs = jobs.filter(j => validJobIds.has(j._id.toString()));

    // Map with user application status
    const appliedJobsList = activeJobs.map(j => {
      const applicantInfo = j.applicants.find(a => a.student && a.student.toString() === req.user.id.toString());
      return {
        ...j.toObject(),
        status: applicantInfo ? applicantInfo.status : 'Pending',
        appliedAt: applicantInfo ? applicantInfo.appliedAt : new Date()
      };
    });

    return res.status(200).json({
      success: true,
      data: appliedJobsList
    });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, university, graduationYear, skills } = req.body;

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (name) student.name = name;
    if (university) student.university = university;
    if (graduationYear) student.graduationYear = graduationYear;
    if (skills) student.skills = skills;

    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        university: student.university,
        graduationYear: student.graduationYear,
        skills: student.skills,
        resumeUrl: student.resumeUrl
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get student dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const appliedJobs = await Job.find({ _id: { $in: student.appliedJobs } });
    
    // Auto-cleanup deleted/invalid jobs or jobs where the student is not in applicants
    const validJobIds = new Set();
    appliedJobs.forEach(job => {
      if (job.applicants) {
        const applicantInfo = job.applicants.find(a => a.student && a.student.toString() === req.user.id.toString());
        if (applicantInfo) {
          validJobIds.add(job._id.toString());
        }
      }
    });

    const initialCount = student.appliedJobs.length;
    student.appliedJobs = student.appliedJobs.filter(id => id && validJobIds.has(id.toString()));
    if (student.appliedJobs.length !== initialCount) {
      await student.save();
    }

    const activeAppliedJobs = appliedJobs.filter(j => validJobIds.has(j._id.toString()));

    let shortlisted = 0;
    let rejected = 0;
    let hired = 0;
    let pending = 0;

    activeAppliedJobs.forEach(job => {
      const applicantInfo = job.applicants.find(a => a.student && a.student.toString() === req.user.id.toString());
      if (applicantInfo) {
        const status = applicantInfo.status.toLowerCase();
        if (status === 'shortlisted') shortlisted++;
        else if (status === 'rejected') rejected++;
        else if (status === 'hired') hired++;
        else pending++;
      }
    });

    const totalApplied = student.appliedJobs.length;

    // Call Python matcher to get actual scores for stats or calculate average
    let topMatchScore = 75;
    let avgMatchScore = 70;

    if (student.resumeText && activeAppliedJobs.length > 0) {
      const matcherUrl = process.env.PYTHON_MATCHER_URL || 'http://localhost:5001';
      try {
        const response = await axios.post(`${matcherUrl}/match`, {
          resumeText: student.resumeText,
          jobs: activeAppliedJobs.map(j => ({ id: j._id, description: j.description || '' }))
        });
        const ranked = response.data.rankedJobs || [];
        const scores = ranked.map(r => Math.min(Math.max(Math.round(r.score * 100), 0), 100));
        if (scores.length > 0) {
          topMatchScore = Math.max(...scores);
          avgMatchScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      } catch (err) {
        console.warn('Python matcher failed during dashboard stats, using mock/computed scores');
      }
    }

    // Applications over time (calculated dynamically from actual database entries)
    const dayCounts = {
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0,
      'Sun': 0
    };
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    activeAppliedJobs.forEach(job => {
      const applicantInfo = job.applicants.find(a => a.student && a.student.toString() === req.user.id.toString());
      if (applicantInfo) {
        const appliedAtDate = applicantInfo.appliedAt || job.postedAt || new Date();
        const dayIdx = new Date(appliedAtDate).getDay();
        const dayName = daysMap[dayIdx];
        if (dayCounts[dayName] !== undefined) {
          dayCounts[dayName]++;
        }
      }
    });

    const applicationsByDay = [
      { date: 'Mon', count: dayCounts['Mon'] },
      { date: 'Tue', count: dayCounts['Tue'] },
      { date: 'Wed', count: dayCounts['Wed'] },
      { date: 'Thu', count: dayCounts['Thu'] },
      { date: 'Fri', count: dayCounts['Fri'] },
      { date: 'Sat', count: dayCounts['Sat'] },
      { date: 'Sun', count: dayCounts['Sun'] }
    ];

    const statusBreakdown = {
      applied: pending,
      shortlisted,
      rejected,
      hired
    };

    return res.status(200).json({
      success: true,
      data: {
        totalApplied,
        shortlisted,
        rejected,
        hired,
        pending,
        interviews: shortlisted, // map shortlisted as interviews as per UI card
        topMatchScore,
        avgMatchScore,
        applicationsByDay,
        statusBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update status of student's application manually
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body; // 'Pending', 'Shortlisted', 'Rejected', 'Hired'

    if (!['Pending', 'Shortlisted', 'Rejected', 'Hired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const applicant = job.applicants.find(a => a.student.toString() === req.user.id.toString());
    if (!applicant) {
      return res.status(400).json({ success: false, message: 'Application record not found for this candidate' });
    }

    applicant.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Untrack/Delete an application from candidate's dashboard
exports.untrackApplication = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 1. Remove student from job's applicants array
    job.applicants = job.applicants.filter(a => a.student.toString() !== student._id.toString());
    await job.save();

    // 2. Remove job from student's appliedJobs array
    student.appliedJobs = student.appliedJobs.filter(id => id.toString() !== jobId.toString());
    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Application untracked successfully'
    });
  } catch (error) {
    console.error('Error untracking application:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Apply to an external job (called by Chrome extension)
exports.applyExternal = async (req, res) => {
  try {
    const { jobId } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // If already applied, return success
    const alreadyApplied = job.applicants.some(a => a.student.toString() === student._id.toString());
    if (alreadyApplied) {
      return res.status(200).json({ success: true, company: job.company, message: 'Already applied' });
    }

    // Calculate match score
    let score = 55; // Default score
    if (student.resumeText) {
      const matcherUrl = process.env.PYTHON_MATCHER_URL || 'http://localhost:5001';
      let rawScore = 0.35;
      try {
        const response = await axios.post(`${matcherUrl}/match`, {
          resumeText: student.resumeText,
          jobs: [{ id: job._id, description: job.description || '' }]
        });
        const ranked = response.data.rankedJobs || [];
        if (ranked.length > 0) {
          rawScore = ranked[0].score;
        }
      } catch (err) {
        console.warn('Python matcher failed during external apply');
      }
      
      score = calculateMatchPercentage(
        student.resumeText,
        job.description || '',
        job.skills || [],
        student.skills || [],
        rawScore
      );
    }

    // Track application
    job.applicants.push({
      student: student._id,
      appliedAt: new Date(),
      status: 'Pending'
    });
    await job.save();

    if (!student.appliedJobs.includes(job._id)) {
      student.appliedJobs.push(job._id);
      await student.save();
    }

    return res.status(200).json({
      success: true,
      company: job.company,
      message: 'External application tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking external application:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Simulated ATS / Email Sync Endpoint
exports.syncEmails = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const appliedJobs = await Job.find({ _id: { $in: student.appliedJobs } });
    const updates = [];

    // Loop through applied jobs and simulate incoming ATS emails/notifications
    for (const job of appliedJobs) {
      const applicantInfo = job.applicants.find(a => a.student.toString() === student._id.toString());
      if (applicantInfo && applicantInfo.status === 'Pending') {
        // Roll dice to simulate status updates
        const rand = Math.random();
        let newStatus = 'Pending';
        let changeReason = '';

        if (rand < 0.35) {
          newStatus = 'Shortlisted';
          changeReason = `Shortlisted by ${job.company} for coding test.`;
        } else if (rand >= 0.35 && rand < 0.60) {
          newStatus = 'Rejected';
          changeReason = `Application rejected by ${job.company} after resume screening.`;
        } else if (rand >= 0.60 && rand < 0.75) {
          newStatus = 'Hired';
          changeReason = `Congratulations! Hired by ${job.company}!`;
        }

        if (newStatus !== 'Pending') {
          applicantInfo.status = newStatus;
          await job.save();
          updates.push({
            jobId: job._id,
            title: job.title,
            company: job.company,
            oldStatus: 'Pending',
            newStatus,
            message: changeReason
          });
        }
      } else if (applicantInfo && applicantInfo.status === 'Shortlisted') {
        // Interviewing applications status update chance
        const rand = Math.random();
        let newStatus = 'Shortlisted';
        let changeReason = '';

        if (rand < 0.35) {
          newStatus = 'Hired';
          changeReason = `Passed interview rounds! Offer extended by ${job.company}.`;
        } else if (rand >= 0.35 && rand < 0.65) {
          newStatus = 'Rejected';
          changeReason = `Rejected by ${job.company} after interview stages.`;
        }

        if (newStatus !== 'Shortlisted') {
          applicantInfo.status = newStatus;
          await job.save();
          updates.push({
            jobId: job._id,
            title: job.title,
            company: job.company,
            oldStatus: 'Shortlisted',
            newStatus,
            message: changeReason
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: updates.length > 0 ? `Discovered ${updates.length} new ATS status updates.` : 'Inbox synced. No new status notifications found.',
      updates
    });
  } catch (error) {
    console.error('Error syncing emails:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
