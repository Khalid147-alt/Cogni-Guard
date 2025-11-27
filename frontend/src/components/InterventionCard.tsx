"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle } from "lucide-react";

interface InterventionCardProps {
  isVisible: boolean;
  fallacy: {
    name: string;
    description: string;
    counterScript: string;
    truthScore?: number;
  } | null;
}

export function InterventionCard({ isVisible, fallacy }: InterventionCardProps) {
  return (
    <AnimatePresence>
      {isVisible && fallacy && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="glass-panel p-6 rounded-xl border-l-4 border-l-red-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="w-24 h-24 text-red-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
              <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm">Fallacy Detected</h3>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">{fallacy.name}</h2>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/5">
              <p className="text-zinc-300 text-sm mb-2">Counter-Script:</p>
              <p className="text-white text-lg font-medium leading-relaxed">
                "{fallacy.counterScript}"
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Truth Score Analysis</span>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-mono">{fallacy.truthScore ?? 0}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
