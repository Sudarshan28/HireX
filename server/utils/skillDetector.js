const detectSkills = (text) => {
  if (!text) return [];
  const commonSkills = [
    'javascript', 'python', 'react', 'node.js', 'express', 'mongodb', 'sql', 'mysql', 'postgresql', 
    'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'github', 
    'aws', 'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'next.js', 'devops', 'machine learning', 
    'ai', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'flask', 'django',
    'graphql', 'rest api', 'redis', 'firebase', 'go', 'golang', 'rust', 'swift', 'kotlin', 'flutter',
    'react native', 'figma', 'kubernetes', 'ci/cd', 'authentication'
  ];
  const detected = [];
  const lowercaseText = text.toLowerCase();
  for (const skill of commonSkills) {
    let pattern = skill;
    if (skill === 'c\\+\\+') pattern = 'c\\+\\+';
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    
    // Check regex word boundary or simple inclusion for dotted/special names
    if (regex.test(lowercaseText) || lowercaseText.includes(skill.replace('\\', ''))) {
      let displaySkill = skill;
      if (skill === 'javascript') displaySkill = 'JavaScript';
      else if (skill === 'python') displaySkill = 'Python';
      else if (skill === 'react') displaySkill = 'React';
      else if (skill === 'node.js') displaySkill = 'Node.js';
      else if (skill === 'express') displaySkill = 'Express';
      else if (skill === 'mongodb') displaySkill = 'MongoDB';
      else if (skill === 'sql') displaySkill = 'SQL';
      else if (skill === 'mysql') displaySkill = 'MySQL';
      else if (skill === 'postgresql') displaySkill = 'PostgreSQL';
      else if (skill === 'java') displaySkill = 'Java';
      else if (skill === 'c\\+\\+') displaySkill = 'C++';
      else if (skill === 'aws') displaySkill = 'AWS';
      else if (skill === 'docker') displaySkill = 'Docker';
      else if (skill === 'git') displaySkill = 'Git';
      else if (skill === 'github') displaySkill = 'GitHub';
      else if (skill === 'rest api') displaySkill = 'REST API';
      else if (skill === 'ci/cd') displaySkill = 'CI/CD';
      else if (skill === 'react native') displaySkill = 'React Native';
      else displaySkill = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      detected.push(displaySkill);
    }
  }
  return detected;
};

module.exports = { detectSkills };
