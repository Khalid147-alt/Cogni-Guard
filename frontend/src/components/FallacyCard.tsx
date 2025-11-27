"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface AnalysisData {
    fallacy_detected: boolean;
    fallacy_name: string | null;
    counter_argument: string | null;
    risk_score: number | null;
}

interface FallacyItem {
    id: string;
    text: string;
    analysis: AnalysisData;
    timestamp: number;
}

interface FallacyFeedProps {
    fallacies: FallacyItem[];
}

export function FallacyFeed({ fallacies }: FallacyFeedProps) {
    return (
        <div className="space-y-4 h-full overflow-y-auto pr-2">
            {fallacies.length === 0 && (
                <div className="text-center text-zinc-500 mt-10">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No fallacies detected yet.</p>
                </div>
            )}
            {fallacies.map((item) => (
                <div key={item.id} className="glass-card border-red-500/30 bg-red-950/30 p-4 animate-in fade-in slide-in-from-right-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-red-400 flex items-center gap-2 font-semibold">
                            <AlertTriangle className="w-4 h-4" />
                            {item.analysis.fallacy_name}
                        </h3>
                        <span className="text-xs text-red-500 font-mono">
                            Risk: {item.analysis.risk_score}
                        </span>
                    </div>
                    <p className="text-zinc-400 italic text-sm mb-3">
                        "{item.text}"
                    </p>
                    <div className="bg-black/40 p-3 rounded-md border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Counter-Argument</p>
                        <p className="text-sm text-zinc-200">{item.analysis.counter_argument}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
