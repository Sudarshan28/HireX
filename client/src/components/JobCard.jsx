import React from 'react';
import { MapPin, DollarSign, ExternalLink } from 'lucide-react';

const JobCard = ({ job, onApply, isApplied, onViewDetails }) => {
  const isJSearch = job.source === 'jsearch';
  const matchScore = job.matchScore || 0;

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981'; // emerald-500
    if (score >= 70) return '#059669'; // emerald-600
    if (score >= 50) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const handleCardClick = (e) => {
    // If clicked on buttons or links, don't trigger drawer
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    if (onViewDetails) {
      onViewDetails(job);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:border-gray-400 cursor-pointer transition-all flex flex-col justify-between h-full relative group overflow-hidden"
    >
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-gray-700 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              {job.type || 'Full-time'}
            </span>
            <h3 className="text-lg font-display font-bold text-gray-900 mt-2 group-hover:text-[#202A36] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 font-body">{job.company}</p>
          </div>

          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-1000 ease-out"
                strokeWidth="3.5"
                strokeDasharray={`${matchScore}, 100`}
                strokeLinecap="round"
                stroke={getScoreColor(matchScore)}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-gray-700">
              {matchScore}%
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>{job.salary || 'Competitive'}</span>
          </div>
        </div>

        <p className="text-xs text-gray-600 font-body line-clamp-3 mb-6 bg-gray-50 p-2.5 rounded border border-gray-200 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="mt-auto">
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-[10px] font-mono bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[10px] font-mono text-emerald-600 px-1 py-0.5">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {isJSearch ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-transparent border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all font-display font-bold text-sm shadow-sm"
          >
            <span>APPLY</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        ) : (
          <button
            onClick={() => !isApplied && onApply(job._id)}
            disabled={isApplied}
            className={`w-full py-2 px-4 rounded transition-all font-display font-bold text-sm border ${
              isApplied
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'text-white shadow-sm hover:opacity-95'
            }`}
            style={!isApplied ? { backgroundColor: '#202A36', borderColor: '#202A36' } : {}}
          >
            {isApplied ? 'APPLICATION SUBMITTED' : 'INITIALIZE APPLICATION'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
