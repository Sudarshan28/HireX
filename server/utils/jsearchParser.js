const { detectSkills } = require('./skillDetector');

const extractLocation = (job) => {
  const city = job.job_city;
  const state = job.job_state;
  const country = job.job_country;
  
  if (city) {
    return [city, state, country].filter(Boolean).join(', ');
  }
  
  // Try extracting from description
  const desc = job.job_description || '';
  const match = desc.match(/(?:location|loc|place|city|office|based in)\s*[:\-–—]?\s*([a-zA-Z\s]{3,20})(?:,|\b)/i);
  if (match && match[1]) {
    const candidateCity = match[1].trim();
    const generic = ['remote', 'office', 'hybrid', 'join', 'work', 'apply', 'team', 'company', 'client'];
    if (!generic.includes(candidateCity.toLowerCase())) {
      return `${candidateCity}, ${country || 'IN'}`;
    }
  }
  
  // Try matching common cities in description
  const commonCities = ['Bangalore', 'Bengaluru', 'Noida', 'Delhi', 'Gurgaon', 'Gurugram', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur'];
  for (const c of commonCities) {
    const reg = new RegExp(`\\b${c}\\b`, 'i');
    if (reg.test(desc)) {
      return `${c}, ${country || 'IN'}`;
    }
  }
  
  return country || 'Remote';
};

const extractSalary = (job) => {
  if (job.job_min_salary) {
    const currency = job.job_salary_currency || '$';
    return `${currency}${job.job_min_salary} - ${currency}${job.job_max_salary}`;
  }
  
  const desc = job.job_description || '';
  // Match patterns like ₹7.8L - ₹8.4L, $100k - $120k, INR 8,00,000, 8-12 LPA, etc.
  const rupeeMatch = desc.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*[L|K|M]?(?:\s*-\s*\d+(?:\.\d+)?\s*[L|K|M]?)?)/i);
  if (rupeeMatch && rupeeMatch[1]) {
    return `₹${rupeeMatch[1].trim()}`;
  }
  
  const dollarMatch = desc.match(/(?:\$)\s*(\d+(?:\.\d+)?\s*[K|M]?(?:\s*-\s*\d+(?:\.\d+)?\s*[K|M]?)?)/i);
  if (dollarMatch && dollarMatch[1]) {
    return `$${dollarMatch[1].trim()}`;
  }
  
  const lpaMatch = desc.match(/(\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*LPA)/i);
  if (lpaMatch && lpaMatch[1]) {
    return lpaMatch[1].trim();
  }

  return 'Competitive';
};

const isUrlGeneric = (urlStr) => {
  if (!urlStr) return true;
  try {
    const url = new URL(urlStr);
    const path = url.pathname.toLowerCase().replace(/\/+$/, '');
    const genericPaths = ['', '/careers', '/jobs', '/careers/jobs', '/en/careers', '/jobs-search', '/search'];
    if (genericPaths.includes(path)) {
      return true;
    }
    if (path.length <= 1) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
};

const selectBestApplyLink = (job) => {
  const options = job.apply_options || [];
  
  // 1. Collect all non-generic options
  const validOptions = options.filter(o => o.apply_link && !isUrlGeneric(o.apply_link));
  
  // 2. Prioritize direct links that are not generic
  const directOptions = validOptions.filter(o => o.is_direct === true || o.is_direct === 'true');
  if (directOptions.length > 0) {
    return directOptions[0].apply_link;
  }
  
  // 3. Prioritize preferred platforms that are not generic
  const preferred = ['wellfound', 'linkedin', 'indeed', 'glassdoor', 'ziprecruiter', 'greenhouse', 'lever', 'workday'];
  for (const pref of preferred) {
    const match = validOptions.find(o => o.publisher && o.publisher.toLowerCase().includes(pref));
    if (match && match.apply_link) {
      return match.apply_link;
    }
  }
  
  // 4. Fallback to first non-generic option
  if (validOptions.length > 0) {
    return validOptions[0].apply_link;
  }
  
  // 5. Ultimate fallback to raw job_apply_link
  return job.job_apply_link;
};

module.exports = {
  extractLocation,
  extractSalary,
  selectBestApplyLink
};
