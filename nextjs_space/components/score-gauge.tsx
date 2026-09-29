'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const safeScore = score ?? 0;
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = safeScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= safeScore) {
        setDisplayScore(safeScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [safeScore]);

  const getScoreColor = (s: number): string => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#84cc16';
    if (s >= 40) return '#eab308';
    if (s >= 20) return '#f97316';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor(safeScore)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{displayScore}</span>
        <span className="text-sm opacity-80">out of 100</span>
      </div>
    </div>
  );
}