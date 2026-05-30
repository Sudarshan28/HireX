import { X } from 'lucide-react';

const SkillChip = ({ skill, matched = true, removable = false, onRemove }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
      matched 
        ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/30' 
        : 'bg-transparent text-text-muted border-border'
    }`}>
      {skill}
      {removable && (
        <button 
          type="button"
          onClick={onRemove}
          className="ml-1 text-current hover:text-white focus:outline-none"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillChip;
