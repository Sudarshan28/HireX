const connectDB = require('../config/db');
const Job = require('../models/Job');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const migrate = async () => {
  await connectDB();
  console.log('Migrating job categories and work modes...');
  const rawJobs = await Job.find({}).lean();
  console.log(`Found ${rawJobs.length} raw jobs in database.`);
  
  let updatedCount = 0;
  for (const rawJob of rawJobs) {
    const titleLower = (rawJob.title || '').toLowerCase();
    const descLower = (rawJob.description || '').toLowerCase();
    
    // 1. Detect Category
    let category = rawJob.type;
    if (!category || category === 'Remote') {
      category = 'Full-time';
    }
    
    if (titleLower.includes('intern') || titleLower.includes('internship')) {
      category = 'Internship';
    } else if (titleLower.includes('part-time')) {
      category = 'Part-time';
    }
    
    // 2. Detect Work Mode
    let workType = rawJob.workType;
    let isRemote = rawJob.isRemote || false;
    
    if (rawJob.isRemote || titleLower.includes('remote') || descLower.includes('remote')) {
      workType = 'Remote';
      isRemote = true;
    } else if (titleLower.includes('hybrid') || descLower.includes('hybrid')) {
      workType = 'Hybrid';
    } else {
      if (!workType) {
        workType = 'On-site';
      }
    }
    
    // Check if the database record is missing 'workType' or has incorrect values
    const needsUpdate = (
      rawJob.type !== category || 
      rawJob.workType !== workType || 
      rawJob.isRemote !== isRemote ||
      rawJob.workType === undefined ||
      rawJob.workType === null
    );
    
    if (needsUpdate) {
      await Job.updateOne(
        { _id: rawJob._id },
        { 
          $set: { 
            type: category, 
            workType: workType, 
            isRemote: isRemote 
          } 
        }
      );
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
