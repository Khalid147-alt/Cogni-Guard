'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive?: boolean;
  hasToggle?: boolean;
  onToggle?: (checked: boolean) => void;
  actionLabel?: string;
}

export const IntegrationCard = ({
  title,
  description,
  icon: Icon,
  isActive = false,
  hasToggle = false,
  onToggle,
  actionLabel
}: IntegrationCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "glass-panel p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 group cursor-pointer relative overflow-hidden",
        isActive ? "border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]" : "hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      )}
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

      <div className={cn(
        "p-4 rounded-2xl mb-4 transition-colors duration-300",
        isActive ? "bg-green-500/20 text-green-400" : "bg-slate-800/50 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400"
      )}>
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="mt-auto w-full flex justify-center">
        {hasToggle ? (
          <Switch 
            checked={isActive} 
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-green-500"
          />
        ) : (
          <button className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            isActive 
              ? "text-green-400 bg-green-500/10 border border-green-500/20"
              : "text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
          )}>
            {actionLabel || (isActive ? 'Active' : 'Connect')}
          </button>
        )}
      </div>
    </motion.div>
  );
};
