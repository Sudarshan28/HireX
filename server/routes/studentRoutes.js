const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload.middleware');
const { validateUpdateProfile } = require('../middleware/validation.middleware');

router.post('/resume/upload', verifyToken, upload.single('resume'), studentController.uploadResume);
router.post('/upload-resume', verifyToken, upload.single('resume'), studentController.uploadResume);

router.get('/matched-jobs', verifyToken, studentController.getMatchedJobs);
router.get('/jobs', verifyToken, studentController.getMatchedJobs);

router.post('/apply/:jobId', verifyToken, studentController.applyToJob);
router.post('/jobs/:jobId/apply', verifyToken, studentController.applyToJob);

router.get('/applied-jobs', verifyToken, studentController.getAppliedJobs);
router.get('/applications', verifyToken, studentController.getAppliedJobs);

router.get('/profile', verifyToken, studentController.getProfile);
router.put('/profile', verifyToken, validateUpdateProfile, studentController.updateProfile);

router.get('/dashboard/stats', verifyToken, studentController.getDashboardStats);
router.put('/applications/:jobId/status', verifyToken, studentController.updateApplicationStatus);
router.delete('/applications/:jobId', verifyToken, studentController.untrackApplication);

module.exports = router;
