import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-xl bg-bg-surface/30"
    >
      <div className="p-4 rounded-full bg-bg-card text-text-muted mb-4 border border-border">
        {Icon && <Icon size={32} />}
      </div>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;
