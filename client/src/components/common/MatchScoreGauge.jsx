import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';

const MatchScoreGauge = ({ score }) => {
  const [offset, setOffset] = useState(0);
  const radius = 60;
  const circumference = Math.PI * radius; // Semicircle
  
  useEffect(() => {
    // Calculate the offset for a semicircle gauge
    // score is 0-100, we map it to 0-1 (progress)
    const progress = score / 100;
    const dashOffset = circumference * (1 - progress);
    
    // We animate to this value
    setTimeout(() => {
      setOffset(dashOffset);
    }, 100);
  }, [score, circumference]);

  const getColor = (s) => {
    if (s >= 70) return '#00FF88'; // accent-primary
    if (s >= 40) return '#FFAA00'; // warning
    return '#FF4444'; // danger
  };

  const color = getColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg 
        width="200" 
        height="120" 
        viewBox="0 0 200 120" 
        className="overflow-visible"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Arc */}
        <path
          d="M 40 100 A 60 60 0 0 1 160 100"
          fill="none"
          stroke="var(--bg-surface)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Foreground Arc */}
        <motion.path
          d="M 40 100 A 60 60 0 0 1 160 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter="url(#glow)"
        />
      </svg>
      
      <div className="absolute bottom-6 flex flex-col items-center">
        <span className="text-4xl font-display font-bold text-text-primary" style={{ color }}>
          <AnimatedNumber value={score} />%
        </span>
        <span className="text-xs text-text-muted mt-1 uppercase tracking-wider">Match Score</span>
      </div>
    </div>
  );
};

export default MatchScoreGauge;
