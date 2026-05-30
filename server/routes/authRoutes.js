const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const { 
  validateRegisterStudent, 
  validateRegisterRecruiter, 
  validateLogin 
} = require('../middleware/validation.middleware');

router.post('/register/student', validateRegisterStudent, authController.registerStudent);
router.post('/register/recruiter', validateRegisterRecruiter, authController.registerRecruiter);
router.post('/login/student', validateLogin, authController.loginStudent);
router.post('/login/recruiter', validateLogin, authController.loginRecruiter);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
