const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const verifyToken = require('../middleware/authMiddleware');
const { validatePostJob } = require('../middleware/validation.middleware');

router.get('/dashboard', verifyToken, recruiterController.getDashboardStats);
router.get('/dashboard/stats', verifyToken, recruiterController.getDashboardStats);

router.post('/post-job', verifyToken, validatePostJob, recruiterController.postJob);
router.post('/jobs', verifyToken, validatePostJob, recruiterController.postJob);

router.get('/jobs', verifyToken, recruiterController.getJobs);

router.delete('/job/:id', verifyToken, recruiterController.deleteJob);
router.delete('/jobs/:id', verifyToken, recruiterController.deleteJob);

router.get('/applicants/:jobId', verifyToken, recruiterController.getApplicants);
router.get('/jobs/:jobId/applicants', verifyToken, recruiterController.getApplicants);

router.put('/applicant-status', verifyToken, recruiterController.updateApplicantStatus);
router.put('/jobs/:jobId/applicants/:studentId', verifyToken, recruiterController.updateApplicantStatus);
router.get('/candidates', verifyToken, recruiterController.getCandidates);
router.get('/interviews', verifyToken, recruiterController.getInterviews);
router.get('/analytics', verifyToken, recruiterController.getAnalytics);

module.exports = router;
