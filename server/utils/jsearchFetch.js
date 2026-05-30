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
      const employmentType = job.job_employment_type ? job.job_employment_type.toLowerCase() : '';
      let type = 'Full-time';
      if (employmentType.includes('intern') || titleLower.includes('intern') || titleLower.includes('internship')) {
        type = 'Internship';
      } else if (employmentType.includes('part')) {
        type = 'Part-time';
      } else if (job.job_is_remote || employmentType.includes('remote')) {
        type = 'Remote';
      } else if (employmentType.includes('full')) {
        type = 'Full-time';
      }

      return {
        title:            job.job_title,
        company:          job.employer_name,
        location,
        description,
        type,
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
        isRemote:         job.job_is_remote || false
      };

    });
  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error.message);
    return [];
  }
}

module.exports = { fetchJSearchJobs };
