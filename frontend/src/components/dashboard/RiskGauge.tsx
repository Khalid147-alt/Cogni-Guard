'use client';

import React from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { motion } from 'framer-motion';

export const RiskGauge = () => {
  const { riskScore } = useSessionStore();

  // Determine color based on score
  const getColor = (score: number) => {
    if (score <= 30) return '#4ade80'; // Green
    if (score <= 70) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  const color = getColor(riskScore);
  
  // SVG properties
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative h-[300px]">
      <h2 className="absolute top-6 left-6 text-sm font-mono text-slate-400 uppercase tracking-widest">
        Manipulation Risk
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Glow effect behind the gauge */}
        <div 
          className="absolute inset-0 blur-3xl opacity-20 transition-colors duration-500"
          style={{ backgroundColor: color }}
        />

        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] transition-all duration-500"
        >
          <circle
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <span 
            className="text-5xl font-bold transition-colors duration-500"
            style={{ color }}
          >
            {riskScore}
          </span>
          <span className="text-xs text-slate-500 uppercase mt-1">Score</span>
        </div>
      </div>

      <div className="mt-6 w-full px-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
          <span>SAFE</span>
          <span>CRITICAL</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full transition-colors duration-500"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
