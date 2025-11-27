'use client';

import React from 'react';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DemoPage() {
    return (
        <div className="min-h-screen p-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            {/* Header */}
            <header className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 backdrop-blur-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-purple-400"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                        <span className="text-xs font-mono text-purple-300 uppercase">
                            DEMO MODE
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <DemoDashboard />
        </div>
    );
}
