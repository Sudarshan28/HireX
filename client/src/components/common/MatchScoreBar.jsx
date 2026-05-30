import { motion } from 'framer-motion';

const MatchScoreBar = ({ score, animated = true }) => {
  const getColor = (s) => {
    if (s >= 70) return 'bg-accent-primary';
    if (s >= 40) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 h-2 bg-bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${score}%` }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${getColor(score)}`}
        />
      </div>
      <span className={`text-sm font-bold ${getColor(score).replace('bg-', 'text-')}`}>
        {score}%
      </span>
    </div>
  );
};

export default MatchScoreBar;
