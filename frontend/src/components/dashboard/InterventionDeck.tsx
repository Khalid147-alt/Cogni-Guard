'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/store/useSessionStore';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InterventionDeck = () => {
  const { activeFallacy, triggerFallacy } = useSessionStore();

  return (
    <AnimatePresence>
      {activeFallacy && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-8 right-8 w-[400px] z-50"
        >
          <div className="glass-panel bg-slate-900/90 border-red-500/30 p-0 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            {/* Header */}
            <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-100 uppercase tracking-wider">
                    Intervention Required
                  </h3>
                  <p className="text-xs text-red-400">
                    {activeFallacy.name} Detected
                  </p>
                </div>
              </div>
              <button 
                onClick={() => triggerFallacy(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-xs text-slate-400 mb-2 uppercase font-mono">
                Suggested Counter-Script
              </p>
              <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-white text-lg leading-relaxed font-medium neon-glow">
                "{activeFallacy.counterScript}"
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={() => triggerFallacy(null)}
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
            
            {/* Progress Bar (Timer style) */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 10, ease: 'linear' }}
              className="h-1 bg-red-500/50"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
