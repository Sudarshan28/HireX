const { detectSkills } = require('./skillDetector');

/**
 * Calculates a hybrid match percentage (0-100) combining semantic similarity,
 * skill compatibility, and keyword overlap.
 * 
 * @param {string} resumeText - Raw text of candidate's resume
 * @param {string} jobDescription - Job posting description
 * @param {Array<string>} jobSkills - Explicit skills listed on job
 * @param {Array<string>} studentSkills - Student's declared skills
 * @param {number} semanticScore - Cosine similarity from SentenceTransformer (0.0 to 1.0)
 * @returns {number} Integer between 0 and 100
 */
const calculateMatchPercentage = (resumeText, jobDescription, jobSkills, studentSkills, semanticScore = 0.5) => {
  if (!resumeText || !jobDescription) return 0;

  // 1. Semantic Score (0 to 1)
  const semScore = Math.min(Math.max(semanticScore, 0), 1);

  // 2. Skills Match Score
  const reqSkills = (jobSkills && jobSkills.length > 0)
    ? jobSkills
    : detectSkills(jobDescription);
  
  let skillScore = 0;
  if (reqSkills.length > 0) {
    const studentSkillsSet = new Set((studentSkills || []).map(s => s.toLowerCase()));
    let matches = 0;
    reqSkills.forEach(skill => {
      // Direct match or partial check
      if (studentSkillsSet.has(skill.toLowerCase()) || 
          (studentSkills || []).some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))) {
        matches++;
      }
    });
    skillScore = matches / reqSkills.length;
  } else {
    // If neither job nor description has identifiable skills, default to neutral
    skillScore = 0.5;
  }

  // 3. Keyword Match Score
  const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  let matches = 0;
  const uniqueJobWords = new Set(jobWords);
  uniqueJobWords.forEach(w => {
    if (resumeWords.has(w)) matches++;
  });
  
  const keywordScore = uniqueJobWords.size > 0 ? (matches / uniqueJobWords.size) : 0;

  // Weighted Combination:
  // 35% Semantic similarity (SentenceTransformer)
  // 50% Direct Skills Match
  // 15% General text keyword overlap
  const weighted = (semScore * 0.35) + (skillScore * 0.50) + (keywordScore * 0.15);
  
  let finalPercentage = Math.round(weighted * 100);

  // Boost rules for logical consistency:
  // If a student matches almost all skills, they should get a high score (minimum 75%)
  if (skillScore >= 0.8) {
    finalPercentage = Math.max(finalPercentage, Math.round(skillScore * 100));
  }
  // Ensure if they match some skills, it's at least proportional
  if (skillScore > 0.5) {
    finalPercentage = Math.max(finalPercentage, 50);
  }

  return Math.min(Math.max(finalPercentage, 0), 100);
};

module.exports = { calculateMatchPercentage };
