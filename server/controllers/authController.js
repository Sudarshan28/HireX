const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, university, graduationYear } = req.body;
    
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ success: false, message: 'Student with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name,
      email,
      password: hashedPassword,
      university,
      graduationYear,
      role: 'student'
    });

    await student.save();

    const token = jwt.sign(
      { id: student._id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        university: student.university,
        graduationYear: student.graduationYear
      },
      message: 'Student registered successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Register Recruiter
exports.registerRecruiter = async (req, res) => {
  try {
    const { name, company, email, password } = req.body;

    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ success: false, message: 'Recruiter with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    recruiter = new Recruiter({
      name,
      company,
      email,
      password: hashedPassword,
      role: 'recruiter'
    });

    await recruiter.save();

    const token = jwt.sign(
      { id: recruiter._id, email: recruiter.email, role: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      data: {
        id: recruiter._id,
        name: recruiter.name,
        company: recruiter.company,
        email: recruiter.email,
        role: recruiter.role
      },
      message: 'Recruiter registered successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        university: student.university,
        graduationYear: student.graduationYear,
        skills: student.skills,
        resumeUrl: student.resumeUrl
      },
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login Recruiter
exports.loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: recruiter._id, email: recruiter.email, role: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: recruiter._id,
        name: recruiter.name,
        company: recruiter.company,
        email: recruiter.email,
        role: recruiter.role
      },
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
