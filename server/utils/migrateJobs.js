const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Job = require('../models/Job');

const extractListsFromText = (text) => {
  const qualifications = [];
  const responsibilities = [];
  const benefits = [];

  if (!text) return { qualifications, responsibilities, benefits };

  // Split into paragraphs/sections
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  let currentSection = null;

  for (const line of lines) {
    const lowercaseLine = line.toLowerCase();
    
    // Section detection
    if (/qualification|requirement|skills required|what you'll need|what you need|requirements|experience required|who you are/i.test(line) && line.length < 50) {
      currentSection = 'qualifications';
      continue;
    }
    if (/responsibilit|role|what you'll do|what you will do|key tasks|key duties|duties|what we expect/i.test(line) && line.length < 50) {
      currentSection = 'responsibilities';
      continue;
    }
    if (/benefit|perk|what we offer|compensation|we provide/i.test(line) && line.length < 50) {
      currentSection = 'benefits';
      continue;
    }
    if (/about the company|about us|equal opportunity|diversity/i.test(line) && line.length < 50) {
      currentSection = null;
      continue;
    }

    // Extraction based on bullet indicators or if we are in a section
    const isBullet = /^[\-\*•\+]\s*/.test(line) || /^\d+\.\s*/.test(line);
    const cleanedLine = line.replace(/^[\-\*•\+\d\.]+\s*/, '').trim();

    if (cleanedLine.length < 10) continue;

    if (currentSection === 'qualifications') {
      if (isBullet || qualifications.length < 6) {
        qualifications.push(cleanedLine);
      }
    } else if (currentSection === 'responsibilities') {
      if (isBullet || responsibilities.length < 6) {
        responsibilities.push(cleanedLine);
      }
    } else if (currentSection === 'benefits') {
      if (isBullet || benefits.length < 6) {
        benefits.push(cleanedLine);
      }
    } else {
      // General heuristic scan
      if (isBullet) {
        if (/experience|degree|proficiency|know|skills|programming/i.test(lowercaseLine)) {
          qualifications.push(cleanedLine);
        } else if (/develop|design|build|maintain|write|test|collaborate/i.test(lowercaseLine)) {
          responsibilities.push(cleanedLine);
        } else if (/medical|insurance|dental|401k|perks|welfare|salary/i.test(lowercaseLine)) {
          benefits.push(cleanedLine);
        }
      }
    }
  }

  // Fallback to split sentences if empty
  if (qualifications.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    sentences.forEach(s => {
      const clean = s.trim();
      if (/experience|degree|proficient|skills|requirements|knowledge|expert/i.test(clean) && clean.length > 20 && clean.length < 150 && qualifications.length < 5) {
        qualifications.push(clean);
      }
    });
  }

  if (responsibilities.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    sentences.forEach(s => {
      const clean = s.trim();
      if (/develop|design|build|maintain|implement|collaborate|responsible/i.test(clean) && clean.length > 20 && clean.length < 150 && responsibilities.length < 5) {
        responsibilities.push(clean);
      }
    });
  }

  if (benefits.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    sentences.forEach(s => {
      const clean = s.trim();
      if (/benefit|medical|insurance|401k|wellness|perk|competitive|equity/i.test(clean) && clean.length > 15 && clean.length < 150 && benefits.length < 4) {
        benefits.push(clean);
      }
    });
  }

  // Final default lists if still empty
  if (qualifications.length === 0) {
    qualifications.push(
      "Relevant degree in Computer Science, engineering or matching practical experience",
      "Hands-on project experience with technologies requested in the role description",
      "Demonstrated problem solving, logical reasoning, and debugging skills",
      "Good communication skills and eagerness to learn new tech stacks"
    );
  }
  if (responsibilities.length === 0) {
    responsibilities.push(
      "Write clean, readable, and maintainable software according to team guidelines",
      "Collaborate with senior developers and product managers to refine specifications",
      "Contribute to debugging, troubleshooting, and profiling application issues",
      "Participate in design syncs and code review discussions within the team"
    );
  }
  if (benefits.length === 0) {
    benefits.push(
      "Competitive base salary with performance incentives",
      "Comprehensive medical and health insurance coverage packages",
      "Flexible work model options (Remote / Hybrid) where specified",
      "Career growth paths and learning resources supported by organization"
    );
  }

  return {
    qualifications: qualifications.slice(0, 8),
    responsibilities: responsibilities.slice(0, 8),
    benefits: benefits.slice(0, 8)
  };
};

const extractPublisher = (urlStr) => {
  if (!urlStr) return 'Direct Careers Portal';
  try {
    const url = new URL(urlStr);
    const domain = url.hostname.toLowerCase();
    
    if (domain.includes('linkedin')) return 'LinkedIn';
    if (domain.includes('wellfound') || domain.includes('angel.co')) return 'Wellfound';
    if (domain.includes('indeed')) return 'Indeed';
    if (domain.includes('glassdoor')) return 'Glassdoor';
    if (domain.includes('ziprecruiter')) return 'ZipRecruiter';
    if (domain.includes('ycombinator')) return 'YC Careers';
    if (domain.includes('greenhouse')) return 'Greenhouse ATS';
    if (domain.includes('lever')) return 'Lever ATS';
    if (domain.includes('workday')) return 'Workday ATS';
    if (domain.includes('apna')) return 'Apna';
    
    // Extract base brand name e.g. "careers.adobe.com" -> "Adobe Careers"
    const parts = domain.split('.');
    if (parts.length >= 2) {
      const brand = parts[parts.length - 2];
      return brand.charAt(0).toUpperCase() + brand.slice(1) + ' Portal';
    }
    
    return 'Direct Careers Site';
  } catch (e) {
    return 'Direct Careers Site';
  }
};

const runMigration = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    const jobs = await Job.find({ source: 'jsearch' });
    console.log(`Found ${jobs.length} JSearch jobs to update.`);

    let updatedCount = 0;
    for (const job of jobs) {
      const { qualifications, responsibilities, benefits } = extractListsFromText(job.description);
      const publisher = extractPublisher(job.applyUrl);
      
      job.qualifications = qualifications;
      job.responsibilities = responsibilities;
      job.benefits = benefits;
      job.publisher = publisher;
      
      // Heuristic logo from clearbit
      if (!job.employerLogo) {
        const cleanName = job.company
          .toLowerCase()
          .replace(/,?\s*(inc|ltd|pvt|solutions|systems|technologies|group|llc|corp)\.?\s*$/g, '')
          .trim()
          .replace(/\s+/g, '');
        job.employerLogo = `https://logo.clearbit.com/${cleanName}.com?size=100`;
      }
      
      // Determine remote status
      const descLower = (job.description || '').toLowerCase();
      job.isRemote = job.type === 'Remote' || descLower.includes('work from home') || descLower.includes('remote') || descLower.includes('wfh');

      await job.save();
      updatedCount++;
    }

    console.log(`Successfully migrated ${updatedCount} jobs.`);
    mongoose.disconnect();
    console.log('Disconnected from MongoDB. Migration Complete!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
