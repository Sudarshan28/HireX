const { body, validationResult } = require('express-validator');

// Middleware to handle validation error output
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

exports.validateRegisterStudent = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('university')
    .optional()
    .trim()
    .escape(),
  body('graduationYear')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Please provide a valid graduation year'),
  validateResult
];

exports.validateRegisterRecruiter = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters')
    .escape(),
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name must not exceed 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateResult
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validateResult
];

exports.validatePostJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Job title must not exceed 100 characters')
    .escape(),
  body('company')
    .optional()
    .trim()
    .escape(),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location must not exceed 100 characters')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 10 }).withMessage('Job description must be at least 10 characters long')
    .escape(),
  body('skills')
    .optional()
    .custom((val) => {
      if (typeof val === 'string' || Array.isArray(val)) {
        return true;
      }
      throw new Error('Skills must be a string list or an array');
    }),
  body('type')
    .optional()
    .isIn(['Full-time', 'Part-time', 'Internship', 'Remote']).withMessage('Invalid job type'),
  body('salary')
    .optional()
    .trim()
    .escape(),
  body('applyUrl')
    .optional()
    .custom((val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch (err) {
        throw new Error('Please provide a valid application URL');
      }
    }),
  validateResult
];
