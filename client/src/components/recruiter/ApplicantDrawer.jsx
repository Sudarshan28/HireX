import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Linkedin, Github, Globe, FileText, ChevronDown, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import MatchScoreGauge from '../common/MatchScoreGauge';
import SkillChip from '../common/SkillChip';

// Inline client skill detector for required skills fallback
const detectSkills = (text) => {
  if (!text) return [];
  const commonSkills = [
    'javascript', 'python', 'react', 'node.js', 'express', 'mongodb', 'sql', 'mysql', 'postgresql', 
    'java', 'c++', 'c#', 'ruby', 'php', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'github', 
    'aws', 'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'next.js', 'devops', 'machine learning', 
    'ai', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'flask', 'django',
    'graphql', 'rest api', 'redis', 'firebase', 'go', 'golang', 'rust', 'swift', 'kotlin', 'flutter',
    'react native', 'figma', 'kubernetes', 'ci/cd', 'authentication'
  ];
  const detected = [];
  const lowercaseText = text.toLowerCase();
  for (const skill of commonSkills) {
    let pattern = skill;
    if (skill === 'c++') pattern = 'c\\+\\+';
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    if (regex.test(lowercaseText) || lowercaseText.includes(skill)) {
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
      else if (skill === 'c++') displaySkill = 'C++';
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

// Heuristic resume text parser
const parseResumeText = (text) => {
  if (!text) return { experience: [], education: [] };
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const experience = [];
  const education = [];
  
  let currentSection = null;
  let tempBlock = [];
  
  // Helpers to process blocks
  const processExpBlock = (blkLines) => {
    const exps = [];
    let currentExp = null;
    
    for (const line of blkLines) {
      const hasDate = /(?:19|20)\d{2}\s*-\s*(?:present|(?:19|20)\d{2}|[a-z]{3}\s*(?:19|20)?\d{2})/i.test(line);
      const isJobTitle = /engineer|developer|designer|manager|lead|intern|analyst|architect|specialist/i.test(line);
      
      if ((hasDate || isJobTitle) && line.length < 80) {
        if (currentExp) exps.push(currentExp);
        const parts = line.split(/[|,-]/);
        const title = parts[0]?.trim() || line;
        const company = parts[1]?.trim() || 'Tech Organization';
        const duration = line.match(/(?:[a-zA-Z]{3,9}\s*\d{4}|[a-zA-Z]{3,9}\s*-\s*[a-zA-Z]{3,9}\s*\d{4}|(?:19|20)\d{2}\s*-\s*(?:present|(?:19|20)\d{2}))/i)?.[0] || 'Duration not specified';
        
        currentExp = {
          title,
          company,
          duration,
          description: ''
        };
      } else if (currentExp) {
        currentExp.description += (currentExp.description ? ' ' : '') + line;
      }
    }
    if (currentExp) exps.push(currentExp);
    
    if (exps.length === 0 && blkLines.length > 0) {
      exps.push({
        title: 'Project Contributor / Developer',
        company: 'Independent / Open Source',
        duration: 'Ongoing',
        description: blkLines.slice(0, 3).join(' ')
      });
    }
    return exps;
  };

  const processEduBlock = (blkLines) => {
    const edus = [];
    let currentEdu = null;
    
    for (const line of blkLines) {
      const isDegree = /b\.?tech|m\.?tech|b\.?s\.?c?|m\.?s\.?c?|ph\.?d|bachelor|master|degree|high school|diploma/i.test(line);
      const hasDate = /(?:19|20)\d{2}/.test(line);
      
      if ((isDegree || hasDate) && line.length < 100) {
        if (currentEdu) edus.push(currentEdu);
        const yearMatch = line.match(/(?:19|20)\d{2}/);
        const year = yearMatch ? yearMatch[0] : '2026';
        
        currentEdu = {
          degree: isDegree ? line : 'Bachelor of Science / Technology',
          institution: blkLines.find(l => !/b\.?tech|m\.?tech|b\.?s\.?c?|m\.?s\.?c?|ph\.?d|bachelor|master/i.test(l) && l !== line) || 'University of Study',
          year
        };
      }
    }
    if (currentEdu) edus.push(currentEdu);
    
    if (edus.length === 0 && blkLines.length > 0) {
      edus.push({
        degree: blkLines.find(l => /degree|b\.?tech|bachelor/i.test(l)) || blkLines[0] || 'Degree / Graduation Program',
        institution: blkLines.find(l => /university|college|school/i.test(l)) || blkLines[1] || 'Academic Institution',
        year: blkLines.find(l => /\d{4}/.test(l))?.match(/\d{4}/)?.[0] || 'Expected Graduation'
      });
    }
    return edus;
  };

  for (const line of lines) {
    if (/education|academic/i.test(line) && line.length < 25) {
      if (currentSection === 'experience' && tempBlock.length > 0) {
        experience.push(...processExpBlock(tempBlock));
      }
      currentSection = 'education';
      tempBlock = [];
      continue;
    }
    
    if (/experience|employment|work history|projects/i.test(line) && line.length < 25) {
      if (currentSection === 'education' && tempBlock.length > 0) {
        education.push(...processEduBlock(tempBlock));
      }
      currentSection = 'experience';
      tempBlock = [];
      continue;
    }
    
    if (/skills|technologies|certifications|languages|achievements|interests|summary/i.test(line) && line.length < 25) {
      if (currentSection === 'experience' && tempBlock.length > 0) {
        experience.push(...processExpBlock(tempBlock));
      } else if (currentSection === 'education' && tempBlock.length > 0) {
        education.push(...processEduBlock(tempBlock));
      }
      currentSection = null;
      tempBlock = [];
      continue;
    }
    
    if (currentSection) {
      tempBlock.push(line);
    }
  }
  
  if (currentSection === 'experience' && tempBlock.length > 0) {
    experience.push(...processExpBlock(tempBlock));
  } else if (currentSection === 'education' && tempBlock.length > 0) {
    education.push(...processEduBlock(tempBlock));
  }
  
  return { experience, education };
};

const ApplicantDrawer = ({ isOpen, onClose, applicant, job, onStatusChange }) => {
  const [activeAccordion, setActiveAccordion] = useState('experience');

  if (!applicant) return null;

  // Adapt to nested or flat formats from different endpoints
  const candidate = applicant.student || applicant.studentId || applicant.userId || applicant || {};
  const name = candidate.name || 'Candidate';
  const headline = candidate.headline || (candidate.skills && candidate.skills.length > 0 ? `${candidate.skills.slice(0, 3).join(', ')} Developer` : 'Software Developer');
  
  // Extract location from resume or fallback
  const location = candidate.location || (candidate.resumeText && candidate.resumeText.match(/(?:Noida|Delhi|Pune|Bengaluru|Bangalore|Hyderabad|Chennai|Mumbai|India)/i)?.[0]) || 'India';
  const initials = name.charAt(0);

  // Compute skills categories
  const candidateSkills = candidate.skills || [];
  const initialRequiredSkills = job?.skills || job?.requiredSkills || [];
  const requiredSkills = initialRequiredSkills.length > 0 
    ? initialRequiredSkills 
    : (job?.description ? detectSkills(job.description) : []);
  
  const matchingSkills = candidateSkills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  
  const missingSkills = requiredSkills.filter(req => 
    !candidateSkills.some(skill => skill.toLowerCase() === req.toLowerCase())
  );
  
  const otherSkills = candidateSkills.filter(skill => 
    !requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  );

  // Heuristically parsed resume data
  const resumeData = candidate.resumeParsedData || parseResumeText(candidate.resumeText);

  const toggleAccordion = (sec) => {
    setActiveAccordion(prev => prev === sec ? null : sec);
  };

  const getFullResumeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    let baseUrl = 'http://localhost:5050';
    if (import.meta.env.VITE_API_URL) {
      baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (baseUrl.includes('onrender.com') || baseUrl.includes('your-backend-url')) {
        baseUrl = 'http://localhost:5050';
      }
    } else if (typeof window !== 'undefined') {
      baseUrl = window.location.origin;
    }
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
  };

  const showActions = !!onStatusChange;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Content panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white border-l border-gray-200 z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-display font-bold text-gray-900">Candidate Details</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar ${showActions ? 'pb-32' : 'pb-12'}`}>
              
              {/* Basic Info */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-800 text-3xl font-display font-bold mb-4 shadow-sm">
                  {initials}
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-1">{name}</h3>
                <p className="text-gray-500 text-sm mb-2">{headline}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                  <MapPin size={12} /> {location}
                </div>
              </div>

              {/* Match Score & Analysis */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center shadow-sm">
                <MatchScoreGauge score={applicant.matchScore || candidate.matchScore || 0} />
                <div className="mt-4 w-full border-l-2 border-[#202A36] bg-white p-4 rounded-r-lg text-sm text-gray-600 italic border border-gray-200">
                  {(applicant.matchScore || candidate.matchScore || 0) >= 75
                    ? "The candidate is a strong fit for this job based on skill requirements and resume compatibility."
                    : (applicant.matchScore || candidate.matchScore || 0) >= 50
                      ? "The candidate has moderate alignment with requirements; some key skills are missing."
                      : "The candidate's profile shows low overlap with requested technologies."}
                </div>
              </div>

              {/* Skills compatibility */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-gray-900 text-base">Skill Compatibility</h4>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1.5 font-medium">Matching Skills ({matchingSkills.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchingSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-emerald-200 text-emerald-800 bg-emerald-50">
                          {skill}
                        </span>
                      ))}
                      {matchingSkills.length === 0 && <span className="text-xs text-gray-400 italic">None matched</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1.5 font-medium">Missing Skills ({missingSkills.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-red-200 text-red-800 bg-red-50">
                          {skill}
                        </span>
                      ))}
                      {missingSkills.length === 0 && (
                        requiredSkills.length > 0 ? (
                          <span className="text-xs text-emerald-700 font-mono text-[10px]">ALL KEY SKILLS MET</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No required skills specified</span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1.5 font-medium">Other Skills ({otherSkills.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {otherSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-200 text-gray-700 bg-gray-100">
                          {skill}
                        </span>
                      ))}
                      {otherSkills.length === 0 && <span className="text-xs text-gray-400 italic">None</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordions: Experience & Education */}
              <div className="space-y-3">
                
                {/* Experience Accordion */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                  <button 
                    onClick={() => toggleAccordion('experience')}
                    className="w-full flex items-center justify-between p-4 font-display font-bold text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2"><Briefcase size={16} className="text-[#202A36]" /> Work Experience</span>
                    <ChevronDown size={16} className={`transform transition-transform ${activeAccordion === 'experience' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'experience' && (
                    <div className="p-4 border-t border-gray-200 space-y-4 bg-white">
                      {resumeData.experience && resumeData.experience.length > 0 ? (
                        resumeData.experience.map((exp, idx) => (
                          <div key={idx} className="relative pl-4 border-l border-gray-200">
                            <h5 className="font-semibold text-sm text-gray-900">{exp.title}</h5>
                            <div className="text-xs text-[#202A36] font-medium mb-1">{exp.company} <span className="text-gray-400 font-normal">| {exp.duration}</span></div>
                            <p className="text-xs text-gray-500 leading-relaxed">{exp.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 italic">No experience records found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Education Accordion */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                  <button 
                    onClick={() => toggleAccordion('education')}
                    className="w-full flex items-center justify-between p-4 font-display font-bold text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2"><GraduationCap size={16} className="text-[#202A36]" /> Education</span>
                    <ChevronDown size={16} className={`transform transition-transform ${activeAccordion === 'education' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'education' && (
                    <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
                      {resumeData.education && resumeData.education.length > 0 ? (
                        resumeData.education.map((edu, idx) => (
                          <div key={idx} className="text-xs">
                            <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                            <div className="text-gray-500">{edu.institution} | {edu.year}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 italic">No education records found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Resume Text details */}
              {candidate.resumeText && (
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-gray-900 text-sm">Resume Text Extraction</h4>
                  <div className="max-h-48 overflow-y-auto bg-gray-50 border border-gray-200 rounded p-4 text-[10px] font-mono text-gray-500 whitespace-pre-wrap leading-relaxed">
                    {candidate.resumeText}
                  </div>
                </div>
              )}

              {/* Resume download / view */}
              {candidate.resumeUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <a 
                    href={getFullResumeUrl(candidate.resumeUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-xl transition-all font-display font-bold text-xs bg-white shadow-sm"
                  >
                    <FileText size={18} /> View / Review Full Resume PDF
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {showActions && (
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200 grid grid-cols-3 gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => { onStatusChange(candidate._id, 'Rejected'); onClose(); }}
                  className="border border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-semibold transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => { onStatusChange(candidate._id, 'Shortlisted'); onClose(); }}
                  className="text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-95 transition-all"
                  style={{ backgroundColor: '#202A36' }}
                >
                  Shortlist
                </button>
                <button
                  onClick={() => { onStatusChange(candidate._id, 'Hired'); onClose(); }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
                >
                  Hire
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplicantDrawer;
