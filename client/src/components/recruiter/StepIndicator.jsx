import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, totalSteps = 3 }) => {
  // Calculate percentage for progress line width
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="relative flex justify-between items-center w-full">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 -z-10 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-accent-primary -translate-y-1/2 -z-10 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {[1, 2, 3].map((step) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;

          return (
            <div key={step} className="flex flex-col items-center relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  borderColor: isCompleted || isActive ? 'var(--accent-primary)' : 'var(--border)',
                  color: isCompleted || isActive ? 'var(--bg-primary)' : 'var(--text-muted)'
                }}
                transition={{ duration: 0.2 }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm relative z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
              >
                {isCompleted ? (
                  <Check size={16} className="text-bg-primary stroke-[3]" />
                ) : (
                  <span>{step}</span>
                )}
              </motion.div>
              <span className={`absolute top-12 whitespace-nowrap text-xs font-medium transition-colors duration-200 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}>
                {step === 1 ? 'Basic Info' : step === 2 ? 'Job Details' : 'Compensation'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
