'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/store/useSessionStore';
import { cn } from '@/lib/utils';

export const LiveTranscript = () => {
  const { transcript } = useSessionStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="glass-panel h-[400px] p-6 rounded-2xl overflow-hidden flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-900/90 to-transparent z-10 pointer-events-none" />
      
      <h2 className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-widest z-20">
        Live Transcript
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {transcript.map((segment) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, x: segment.speaker === 'user' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex w-full",
                segment.speaker === 'user' ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-xl text-sm backdrop-blur-md border",
                  segment.speaker === 'user'
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-100 rounded-bl-none"
                    : "bg-slate-800/40 border-slate-700 text-slate-200 rounded-br-none",
                  segment.isFallacy && "border-red-500/50 bg-red-500/10 text-red-200 neon-glow-red"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold opacity-50 uppercase">
                    {segment.speaker}
                  </span>
                  {segment.isFallacy && (
                    <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded text-red-400 border border-red-500/30">
                      FALLACY DETECTED
                    </span>
                  )}
                </div>
                <p>{segment.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
    </div>
  );
};
