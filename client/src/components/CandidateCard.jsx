import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

const CandidateCard = ({ candidate, onViewProfile }) => {
  const matchScore = candidate.matchScore || 0;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-100 bg-emerald-50';
    if (score >= 70) return 'text-green-700 border-green-100 bg-green-50';
    if (score >= 50) return 'text-amber-700 border-amber-100 bg-amber-50';
    return 'text-red-700 border-red-100 bg-red-50';
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'hired') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'shortlisted') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'rejected') return 'bg-red-50 text-red-600 border-red-100';
    if (s === 'not applied') return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const displayName = candidate.student?.name || candidate.name || 'Candidate';
  const displayEmail = candidate.student?.email || candidate.email || 'Email not specified';
  const displayUni = candidate.student?.university || candidate.university || 'University not specified';
  const displaySkills = candidate.student?.skills || candidate.skills || [];
  
  const displayStatus = candidate.status || (candidate.appliedJobs && candidate.appliedJobs.length > 0
    ? `Applied (${candidate.appliedJobs.length} jobs)`
    : 'Not Applied');

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:border-gray-300 transition-all flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-lg font-display font-bold text-gray-900 capitalize leading-tight">
              {displayName}
            </h3>
            <span className={`inline-block mt-2 text-xs font-mono border px-2 py-0.5 rounded ${getStatusColor(displayStatus)}`}>
              {displayStatus}
            </span>
          </div>

          <div className={`font-mono text-sm font-bold border px-2.5 py-1 rounded-lg ${getScoreColor(matchScore)}`}>
            {matchScore}% FIT
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{displayEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="truncate">{displayUni}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {displaySkills && displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-5">
            {displaySkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-[10px] font-mono bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {displaySkills.length > 3 && (
              <span className="text-[10px] font-mono text-emerald-700">
                +{displaySkills.length - 3} more
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => onViewProfile(candidate)}
          className="w-full py-2 px-4 rounded bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all font-display font-bold text-sm shadow-sm"
        >
          VIEW CANDIDATE PROFILE
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
