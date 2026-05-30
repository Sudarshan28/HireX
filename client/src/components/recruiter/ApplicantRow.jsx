import { motion } from 'framer-motion';
import { Eye, Award } from 'lucide-react';
import MatchScoreBar from '../common/MatchScoreBar';
import Badge from '../common/Badge';
import SkillChip from '../common/SkillChip';
import { formatDate } from '../../utils/formatters';

const ApplicantRow = ({ applicant, rank, onStatusChange, onViewProfile, loading }) => {
  const getRankBadge = (r) => {
    if (r === 1) return <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-xs font-bold font-mono"><Award size={12} className="mr-0.5" />1</span>;
    if (r === 2) return <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/30 text-xs font-bold font-mono"><Award size={12} className="mr-0.5" />2</span>;
    if (r === 3) return <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-700 border border-amber-700/30 text-xs font-bold font-mono"><Award size={12} className="mr-0.5" />3</span>;
    return <span className="text-text-muted font-mono font-medium text-sm pl-2">{r}</span>;
  };

  const candidate = applicant.studentId || applicant.userId || {};
  const name = candidate.name || 'Candidate';
  const headline = candidate.headline || 'Software Engineer';
  const initial = name.charAt(0);

  const matchScore = applicant.matchScore || 0;
  const skills = candidate.skills || [];
  const maxSkillsShow = 3;
  const remainingSkills = skills.length > maxSkillsShow ? skills.length - maxSkillsShow : 0;

  // Left borders for top 3 rank rows or subtle green on hover
  const rankBorderClass = rank === 1 ? 'border-l-2 border-yellow-500' : rank === 2 ? 'border-l-2 border-slate-300' : rank === 3 ? 'border-l-2 border-amber-700' : 'border-l-2 border-transparent hover:border-accent-primary';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`border-b border-border/50 hover:bg-bg-surface/50 transition-colors ${rankBorderClass}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        {getRankBadge(rank)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-accent-primary font-bold">
            {initial}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-sm">{name}</div>
            <div className="text-xs text-text-muted line-clamp-1">{headline}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-36">
          <MatchScoreBar score={matchScore} />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, maxSkillsShow).map((skill, idx) => (
            <SkillChip key={idx} skill={skill} matched={true} />
          ))}
          {remainingSkills > 0 && (
            <span className="text-xs text-text-muted self-center font-medium bg-bg-surface px-2 py-0.5 rounded border border-border">
              +{remainingSkills} more
            </span>
          )}
          {skills.length === 0 && <span className="text-text-muted text-xs">No skills listed</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
        {formatDate(applicant.appliedAt || applicant.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {loading ? (
          <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <select
            value={applicant.status}
            onChange={(e) => onStatusChange(applicant.studentId?._id || applicant._id, e.target.value)}
            className="bg-bg-surface border border-border rounded px-2.5 py-1 text-xs text-text-primary focus:border-accent-primary focus:outline-none transition-colors capitalize font-medium cursor-pointer"
          >
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={() => onViewProfile(applicant)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:text-accent-secondary bg-accent-primary/10 hover:bg-accent-primary/20 px-3 py-1.5 rounded-lg transition-all"
        >
          <Eye size={14} /> View Profile
        </button>
      </td>
    </motion.tr>
  );
};

export default ApplicantRow;
