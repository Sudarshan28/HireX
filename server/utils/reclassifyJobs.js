const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Job = require('../models/Job');

const reclassify = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Scanning and re-classifying existing jobs to correct category mappings...');
    
    // 1. Any job with "intern" or "internship" in the title should be of type "Internship"
    const internResult = await Job.updateMany(
      {
        title: { $regex: /intern|internship/i }
      },
      {
        $set: { type: 'Internship' }
      }
    );
    console.log(`Updated ${internResult.modifiedCount} opportunities to 'Internship' based on title matching.`);

    // 2. Any job with "full time" or "full-time" or "fulltime" in the title (and not containing intern)
    // should be type "Full-time"
    const fullTimeResult = await Job.updateMany(
      {
        title: { $not: /intern|internship/i },
        $or: [
          { type: { $ne: 'Full-time' } },
          { type: { $exists: false } }
        ],
        $and: [
          {
            $or: [
              { title: { $regex: /full-time|full time|engineer|developer|architect|lead|analyst|manager/i } },
              { description: { $regex: /full-time|full time/i } }
            ]
          }
        ]
      },
      {
        $set: { type: 'Full-time' }
      }
    );
    console.log(`Updated ${fullTimeResult.modifiedCount} opportunities to 'Full-time' based on title/desc matching.`);

    console.log('Database re-classification complete!');
    process.exit(0);
  } catch (err) {
    console.error('Re-classification failed:', err);
    process.exit(1);
  }
};

reclassify();
