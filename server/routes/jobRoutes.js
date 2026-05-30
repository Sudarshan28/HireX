const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../middleware/authMiddleware');
const { validateFetchExternal } = require('../middleware/validation.middleware');

router.get('/all', verifyToken, jobController.getAllJobs);
router.get('/', verifyToken, jobController.getAllJobs);
router.get('/fetch-external', verifyToken, validateFetchExternal, jobController.fetchExternalJobs);
router.get('/:id', verifyToken, jobController.getJobDetails);

module.exports = router;

