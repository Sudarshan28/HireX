const Badge = ({ label, type = 'neutral', className = '' }) => {
  const types = {
    success: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    error: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-bg-surface text-text-muted border-border',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${types[type]} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
