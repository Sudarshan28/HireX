const connectDB = require('../config/db');
const Job = require('../models/Job');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const migrate = async () => {
  await connectDB();
  console.log('Migrating job categories and work modes...');
  const jobs = await Job.find({});
  console.log(`Found ${jobs.length} jobs to scan.`);
  
  let updatedCount = 0;
  for (const job of jobs) {
    const titleLower = (job.title || '').toLowerCase();
    const descLower = (job.description || '').toLowerCase();
    
    // 1. Detect Category
    let category = job.type;
    if (!category || category === 'Remote') {
      category = 'Full-time';
    }
    
    if (titleLower.includes('intern') || titleLower.includes('internship')) {
      category = 'Internship';
    } else if (titleLower.includes('part-time')) {
      category = 'Part-time';
    }
    
    // 2. Detect Work Mode
    let workType = job.workType;
    let isRemote = job.isRemote;
    
    if (job.isRemote || titleLower.includes('remote') || descLower.includes('remote')) {
      workType = 'Remote';
      isRemote = true;
    } else if (titleLower.includes('hybrid') || descLower.includes('hybrid')) {
      workType = 'Hybrid';
    } else {
      if (!workType) {
        workType = 'On-site';
      }
    }
    
    // Update if changed
    if (job.type !== category || job.workType !== workType || job.isRemote !== isRemote) {
      job.type = category;
      job.workType = workType;
      job.isRemote = isRemote;
      await job.save();
      updatedCount++;
    }
  }
  
  console.log(`Successfully migrated ${updatedCount} opportunities.`);
  process.exit(0);
};

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
