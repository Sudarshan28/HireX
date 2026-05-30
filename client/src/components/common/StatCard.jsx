import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const StatCard = ({ title, value, icon: Icon, trend, color = '#00FF88' }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-bg-card border border-border p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: color }}></div>
      
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-lg bg-bg-surface border border-border" style={{ color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-accent-primary/10 text-accent-primary' : 'bg-danger/10 text-danger'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-display font-bold text-text-primary">
          <AnimatedNumber value={value} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
