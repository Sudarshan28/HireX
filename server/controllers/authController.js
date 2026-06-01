const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const { runBackgroundSync } = require('../utils/jsearchFetch');

// Helper to parse user-agent and detect browser and OS
const parseUserAgent = (uaString) => {
  if (!uaString) return 'Unknown Device';
  
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  const ua = uaString.toLowerCase();
  
  // OS Detection
  if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
  } else if (ua.includes('macintosh') || ua.includes('mac os x') || ua.includes('mac_powerpc')) {
    os = 'macOS';
  } else if (ua.includes('windows') || ua.includes('win32')) {
    os = 'Windows';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }
  
  // Browser Detection
  if (ua.includes('edg/')) {
    browser = 'Edge';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('chrome') || ua.includes('crios')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox') || ua.includes('fxios')) {
    browser = 'Firefox';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
  }
  
  const connector = (os === 'Android' || os === 'Windows' || os === 'Linux') ? 'on' : 'from';
  return `${browser} ${connector} ${os}`;
};

// Helper to format date as "date, month, and year" (e.g. 01 June 2026)
const formatLoginDate = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
};

// Helper to format time as 12-hour clock (hour, minute, second with AM/PM)
const formatLoginTime = (date = new Date()) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const hoursStr = String(hours).padStart(2, '0');
  
  return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
};

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

    const uaString = req.headers['user-agent'] || '';
    const device = parseUserAgent(uaString);
    const now = new Date();
    const localDate = req.headers['x-local-date'] || formatLoginDate(now);
    const localTime = req.headers['x-local-time'] || formatLoginTime(now);

    student = new Student({
      name,
      email,
      password: hashedPassword,
      university,
      graduationYear,
      role: 'student',
      lastLoginDate: localDate,
      lastLoginTime: localTime,
      lastLoginDevice: device
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
        graduationYear: student.graduationYear,
        lastLoginDate: student.lastLoginDate,
        lastLoginTime: student.lastLoginTime,
        lastLoginDevice: student.lastLoginDevice
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

    const uaString = req.headers['user-agent'] || '';
    const device = parseUserAgent(uaString);
    const now = new Date();
    const localDate = req.headers['x-local-date'] || formatLoginDate(now);
    const localTime = req.headers['x-local-time'] || formatLoginTime(now);

    recruiter = new Recruiter({
      name,
      company,
      email,
      password: hashedPassword,
      role: 'recruiter',
      lastLoginDate: localDate,
      lastLoginTime: localTime,
      lastLoginDevice: device
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
        role: recruiter.role,
        lastLoginDate: recruiter.lastLoginDate,
        lastLoginTime: recruiter.lastLoginTime,
        lastLoginDevice: recruiter.lastLoginDevice
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

    const uaString = req.headers['user-agent'] || '';
    const device = parseUserAgent(uaString);
    const now = new Date();
    student.lastLoginDate = req.headers['x-local-date'] || formatLoginDate(now);
    student.lastLoginTime = req.headers['x-local-time'] || formatLoginTime(now);
    student.lastLoginDevice = device;
    await student.save();

    // Trigger JSearch sync in the background automatically (non-blocking)
    runBackgroundSync();

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
        resumeUrl: student.resumeUrl,
        lastLoginDate: student.lastLoginDate,
        lastLoginTime: student.lastLoginTime,
        lastLoginDevice: student.lastLoginDevice
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

    const uaString = req.headers['user-agent'] || '';
    const device = parseUserAgent(uaString);
    const now = new Date();
    recruiter.lastLoginDate = req.headers['x-local-date'] || formatLoginDate(now);
    recruiter.lastLoginTime = req.headers['x-local-time'] || formatLoginTime(now);
    recruiter.lastLoginDevice = device;
    await recruiter.save();

    // Trigger JSearch sync in the background automatically (non-blocking)
    runBackgroundSync();

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: recruiter._id,
        name: recruiter.name,
        company: recruiter.company,
        email: recruiter.email,
        role: recruiter.role,
        lastLoginDate: recruiter.lastLoginDate,
        lastLoginTime: recruiter.lastLoginTime,
        lastLoginDevice: recruiter.lastLoginDevice
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
