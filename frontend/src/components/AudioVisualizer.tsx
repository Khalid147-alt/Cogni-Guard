"use client";

import { motion } from "framer-motion";

interface AudioVisualizerProps {
  isRecording: boolean;
}

export function AudioVisualizer({ isRecording }: AudioVisualizerProps) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isRecording ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-zinc-700"}`}
          animate={isRecording ? {
            height: ["20%", "80%", "40%", "100%", "30%"],
          } : {
            height: "20%"
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
}
