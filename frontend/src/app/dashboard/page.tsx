'use client';

import React from 'react';
import { UserButton } from "@clerk/nextjs";
import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { useSessionStore } from '@/store/useSessionStore';

export default function DashboardPage() {
    const { isConnected } = useSessionStore();

    return (
        <div className="min-h-screen p-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            {/* Header */}
            <header className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase">
                            {isConnected ? 'System Connected' : 'Offline'}
                        </span>
                    </div>
                </div>

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-10 h-10 border-2 border-slate-700"
                        }
                    }}
                />
            </header>

            {/* Main Content */}
            <RealDashboard />
        </div>
    );
}
