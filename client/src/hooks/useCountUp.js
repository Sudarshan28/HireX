import { useState, useEffect } from 'react';

export const useCountUp = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(endValue, 10);
    if (isNaN(end)) {
      setCount(0);
      return;
    }
    if (end === 0) {
      setCount(0);
      return;
    }
    
    let startTimestamp = null;
    let frameId;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    
    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [endValue, duration]);

  return count;
};
