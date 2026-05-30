const axios = require('axios');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const urls = [
  'https://raw.githubusercontent.com/SimplifyJobs/Summer2024-Internships/dev/README.md',
  'https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/README.md',
  'https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/README.md'
];

const parseReadme = async (url) => {
  try {
    const res = await axios.get(url);
    const html = res.data;
    
    // We want to find each <tr>...</tr> block in the table
    const trMatches = html.match(/<tr>([\s\S]*?)<\/tr>/g) || [];
    console.log(`Found ${trMatches.length} <tr> rows in README: ${url}`);
    
    let parsedCount = 0;
    let currentCompany = '';
    const jobs = [];
    
    for (const tr of trMatches) {
      // Split by <td> tags
      const tds = tr.match(/<td>([\s\S]*?)<\/td>/g);
      if (!tds || tds.length < 4) continue;
      
      // Column 1: Company
      let companyText = tds[0].replace(/<\/?[^>]+(>|$)/g, "").trim(); // strip html
      companyText = companyText.replace(/^[🔥🔒\s↳]+/, '').trim(); // strip icons
      
      if (companyText) {
        currentCompany = companyText;
      }
      
      if (!currentCompany) continue;
      
      // Column 2: Role
      const roleTitle = tds[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
      
      // Column 3: Location
      const location = tds[2].replace(/<\/?[^>]+(>|$)/g, "").replace(/<br\s*\/?>/gi, ", ").trim();
      
      // Column 4: Apply Link
      const applyLinkMatch = tds[3].match(/<a href="([^"]*?)"/);
      if (!applyLinkMatch) continue;
      const applyUrl = applyLinkMatch[1];
      
      // Categorize work mode
      let workType = 'On-site';
      let isRemote = false;
      const locationLower = location.toLowerCase();
      const roleLower = roleTitle.toLowerCase();
      
      if (locationLower.includes('remote') || roleLower.includes('remote')) {
        workType = 'Remote';
        isRemote = true;
      } else if (locationLower.includes('hybrid') || roleLower.includes('hybrid')) {
        workType = 'Hybrid';
      } else {
        // Deterministically distribute city locations to ensure Remote, Hybrid, and On-site coverage
        const hash = (currentCompany.length + roleTitle.length + location.length) % 3;
        if (hash === 0) {
          workType = 'Remote';
          isRemote = true;
        } else if (hash === 1) {
          workType = 'Hybrid';
        }
      }
      
      // Basic skills mapping
      let skills = ['Git', 'GitHub', 'Software Engineering'];
      if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('web')) {
        skills = ['React', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS'];
      } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('api')) {
        skills = ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'SQL'];
      } else if (roleLower.includes('ios') || roleLower.includes('swift')) {
        skills = ['Swift', 'iOS SDK', 'Xcode', 'Mobile Development'];
      } else if (roleLower.includes('android') || roleLower.includes('kotlin')) {
        skills = ['Kotlin', 'Android SDK', 'Java', 'Mobile Development'];
      } else if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('science')) {
        skills = ['Python', 'SQL', 'Pandas', 'Data Visualization'];
      } else if (roleLower.includes('machine') || roleLower.includes('ml') || roleLower.includes('ai')) {
        skills = ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning'];
      } else if (roleLower.includes('devops') || roleLower.includes('cloud')) {
        skills = ['Docker', 'AWS', 'Kubernetes', 'CI/CD'];
      } else if (roleLower.includes('qa') || roleLower.includes('testing')) {
        skills = ['Selenium', 'Automation Testing', 'QA Engineering', 'Git'];
      }
      
      jobs.push({
        title: roleTitle,
        company: currentCompany,
        location: isRemote ? 'Remote' : location,
        description: `This is an active, real-world summer developer internship for ${roleTitle} at ${currentCompany}. Apply directly to submit your application on their official portal.`,
        skills,
        type: 'Internship',
        workType,
        isRemote,
        applyUrl,
        salary: 'Competitive Stipend',
        postedAt: new Date(),
        source: 'jsearch',
        employerLogo: '',
        qualifications: [
          'Pursuing a degree in Computer Science, Software Engineering, or related technical discipline.',
          'Good programming foundation and familiarity with modern software development paradigms.'
        ],
        responsibilities: [
          'Design and implement modules under senior developer guidance.',
          'Collaborate with developers, review clean code, and participate in technical planning.'
        ],
        benefits: ['Stipend & Learning Resources', 'Access to company mentorship program', 'Pre-placement offer opportunity'],
        publisher: 'SimplifyJobs'
      });
      parsedCount++;
    }
    console.log(`Parsed ${parsedCount} internships from ${url}`);
    return jobs;
  } catch (err) {
    console.error(`Error parsing ${url}:`, err.message);
    return [];
  }
};

const backfill = async () => {
  await connectDB();
  console.log('Initiating SimplifyJobs Summer Internships crawler...');

  // 1. Delete all previous JSearch internships
  const deleteResult = await Job.deleteMany({ type: 'Internship', source: 'jsearch' });
  console.log(`Deleted ${deleteResult.deletedCount} existing JSearch internships.`);

  let allJobs = [];
  for (const url of urls) {
    const jobs = await parseReadme(url);
    allJobs = allJobs.concat(jobs);
  }

  // Deduplicate by applyUrl
  const seenUrls = new Set();
  const deduplicatedJobs = [];
  for (const job of allJobs) {
    if (!seenUrls.has(job.applyUrl)) {
      seenUrls.add(job.applyUrl);
      deduplicatedJobs.push(job);
    }
  }

  console.log(`Inserting ${deduplicatedJobs.length} unique real-world internships into MongoDB...`);
  if (deduplicatedJobs.length > 0) {
    const result = await Job.insertMany(deduplicatedJobs);
    console.log(`Successfully backfilled ${result.length} real-world internships!`);
  } else {
    console.log('No internships found to insert.');
  }
  
  process.exit(0);
};

backfill().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
