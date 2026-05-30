const axios = require('axios');
const { extractLocation, extractSalary, selectBestApplyLink } = require('./jsearchParser');
const { detectSkills } = require('./skillDetector');

async function fetchJSearchJobs(query = "software engineer India", numPages = 10) {
  try {
    const response = await axios.get(
      'https://jsearch.p.rapidapi.com/search',
      {
        params: { query, page: '1', num_pages: String(numPages) },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      }
    );

    if (!response.data || !response.data.data) {
      return [];
    }

    return response.data.data.map(job => {
      const description = job.job_description || 'No description provided.';
      const location = extractLocation(job);
      const salary = extractSalary(job);
      
      // Auto detect skills from description to enrich the JSearch postings
      const detected = detectSkills(description);
      const apiSkills = Array.isArray(job.job_required_skills) ? job.job_required_skills : [];
      const skills = [...new Set([...apiSkills, ...detected])];

      const titleLower = (job.job_title || '').toLowerCase();
      const descLower = (description || '').toLowerCase();
      const employmentType = job.job_employment_type ? job.job_employment_type.toLowerCase() : '';
      
      // 1. Detect Category
      let type = 'Full-time';
      if (employmentType.includes('intern') || titleLower.includes('intern') || titleLower.includes('internship')) {
        type = 'Internship';
      } else if (employmentType.includes('part') || titleLower.includes('part-time')) {
        type = 'Part-time';
      }

      // 2. Detect Work Mode
      let workType = 'On-site';
      let isRemote = false;
      if (job.job_is_remote || titleLower.includes('remote') || descLower.includes('remote') || employmentType.includes('remote')) {
        workType = 'Remote';
        isRemote = true;
      } else if (titleLower.includes('hybrid') || descLower.includes('hybrid') || employmentType.includes('hybrid')) {
        workType = 'Hybrid';
      }

      return {
        title:            job.job_title,
        company:          job.employer_name,
        location,
        description,
        type,
        workType,
        applyUrl:         selectBestApplyLink(job),
        salary,
        postedAt:         job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
        source:           'jsearch',
        skills,
        employerLogo:     job.employer_logo || '',
        qualifications:   job.job_highlights?.Qualifications || [],
        responsibilities: job.job_highlights?.Responsibilities || [],
        benefits:         job.job_highlights?.Benefits || [],
        publisher:        job.job_publisher || '',
        isRemote
      };


    });
  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error.message);
    return [];
  }
}

const Job = require('../models/Job');

async function runBackgroundSync(customQuery = null) {
  // Fire and forget, runs inside async IIFE
  (async () => {
    try {
      const queries = [];
      if (customQuery) {
        queries.push(customQuery);
      }
      
      const bulkQueries = [
        // Jobs
        'Software Engineer Bangalore',
        'Software Engineer Noida',
        'Software Engineer Pune',
        'Software Engineer Hyderabad',
        'React Developer India',
        'Node.js Developer India',
        'Python Developer India',
        'Full Stack Developer India',
        'MERN Stack Developer India',
        'Frontend Engineer India',
        'Backend Engineer Noida',
        'DevOps Engineer India',
        // Internships
        'Software Engineering Intern Bangalore',
        'Web Development Internship India',
        'React Developer Intern India',
        'Node.js Intern India',
        'Python Developer Internship India',
        'Full Stack Intern India',
        'Frontend Intern India',
        'Backend Internship Noida',
        'Data Science Intern India',
        'Android Developer Intern India',
        'DevOps Intern India',
        'QA Software Intern India'
      ];
      
      bulkQueries.forEach(q => {
        if (!queries.includes(q)) {
          queries.push(q);
        }
      });

      console.log(`[AutoSync Background] Starting background crawler for ${queries.length} streams...`);
      let totalSaved = 0;
      for (const q of queries) {
        try {
          // Introduce a 2.5-second delay to respect RapidAPI requests-per-second limits
          await new Promise(resolve => setTimeout(resolve, 2500));
          const fetchedJobs = await fetchJSearchJobs(q, 10); // 10 pages (100 opportunities) per query

          let savedCount = 0;
          for (const jobData of fetchedJobs) {
            const exists = await Job.findOne({ applyUrl: jobData.applyUrl });
            if (!exists) {
              const job = new Job(jobData);
              await job.save();
              savedCount++;
            }
          }
          totalSaved += savedCount;
          console.log(`[AutoSync Background] Crawled "${q}": Saved ${savedCount} new items`);
        } catch (err) {
          console.error(`[AutoSync Background] Error syncing "${q}":`, err.message);
        }
      }
      console.log(`[AutoSync Background] Complete! Added ${totalSaved} new records.`);
    } catch (err) {
      console.error('[AutoSync Background Master] Failed:', err.message);
    }
  })();
}

module.exports = { fetchJSearchJobs, runBackgroundSync };

