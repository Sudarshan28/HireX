const Job = require('../models/Job');
const Student = require('../models/Student');
const { fetchJSearchJobs, runBackgroundSync } = require('../utils/jsearchFetch');
const axios = require('axios');
const { calculateMatchPercentage } = require('../utils/matcherHelper');

// Get all jobs (with optional search and filters)
exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

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

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit);

    // If logged in as student, attach match scores
    let jobsWithScores = jobs.map(j => j.toObject());
    if (req.user && req.user.role === 'student') {
      const student = await Student.findById(req.user.id);
      if (student && student.resumeText) {
        const matcherUrl = process.env.PYTHON_MATCHER_URL || 'http://localhost:5001';
        let rankedJobs = [];
        try {
          const response = await axios.post(`${matcherUrl}/match`, {
            resumeText: student.resumeText,
            jobs: jobs.map(j => ({ id: j._id, description: j.description || '' }))
          });
          rankedJobs = response.data.rankedJobs || [];
        } catch (err) {
          console.warn('Python matcher failed during job listing search, using keyword fallback');
          const resumeWords = new Set(student.resumeText.toLowerCase().split(/\W+/));
          rankedJobs = jobs.map(j => {
            const words = (j.description || '').toLowerCase().split(/\W+/);
            let matches = 0;
            words.forEach(w => {
              if (w.length > 3 && resumeWords.has(w)) matches++;
            });
            const score = words.length > 0 ? (matches / Math.sqrt(words.length * resumeWords.size)) : 0;
            return { id: j._id.toString(), score };
          });
        }

        jobsWithScores = jobs.map(job => {
          const scoreObj = rankedJobs.find(rj => rj.id.toString() === job._id.toString());
          const rawScore = scoreObj ? scoreObj.score : 0.3;
          const matchScore = calculateMatchPercentage(
            student.resumeText,
            job.description || '',
            job.skills || [],
            student.skills || [],
            rawScore
          );
          return {
            ...job.toObject(),
            matchScore
          };
        });

        // If sorting by match requested
        if (req.query.sortByMatch === 'true') {
          jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: jobsWithScores,
      pagination: {
        total: totalJobs,
        page,
        limit,
        pages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.fetchExternalJobs = async (req, res) => {
  try {
    const customQuery = req.query.query;
    
    // Return response immediately to prevent client timeout and keep the UI responsive
    res.status(200).json({
      success: true,
      message: 'Background synchronization stream initiated! 1,000+ jobs and internships are being fetched and will populate your feed momentarily.'
    });

    // Run sync in the background
    runBackgroundSync(customQuery);
  } catch (error) {
    console.error('Error syncing external jobs:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Server error starting sync' });
    }
  }
};


// Get single job details
exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
