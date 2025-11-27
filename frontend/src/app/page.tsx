'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Activity, Zap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Auth Button (Top Left) */}
      <div className="absolute top-6 left-6 z-50">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
              <LogIn className="mr-2 w-4 h-4" />
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-slate-700"
              }
            }}
          />
        </SignedIn>
      </div>

      {/* Demo Indicator (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/demo">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Activity className="mr-2 w-4 h-4 text-purple-500" />
            <span className="font-mono text-sm tracking-wider">LIVE DEMO</span>
          </Button>
        </Link>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.2)]"
        >
          <ShieldAlert className="w-16 h-16 text-blue-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter"
        >
          Cogni<span className="text-blue-500">Guard</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          The world's first real-time negotiation assistant powered by superintelligence. Detect fallacies, analyze risks, and counter-script in real-time.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/dashboard">
            <Button className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-105">
              <Activity className="mr-2 w-5 h-5" />
              Launch HUD
            </Button>
          </Link>

          <Link href="/integrations">
            <Button variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105">
              <Zap className="mr-2 w-5 h-5" />
              Integrations
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-slate-500 text-sm font-mono"
      >
        SYSTEM STATUS: <span className="text-green-500">OPERATIONAL</span>
      </motion.div>
    </div>
  );
}
