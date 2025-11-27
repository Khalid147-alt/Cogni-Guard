'use client';

import React, { useEffect } from 'react';
import { LiveTranscript } from '@/components/dashboard/LiveTranscript';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { InterventionDeck } from '@/components/dashboard/InterventionDeck';
import { useSessionStore } from '@/store/useSessionStore';
import { motion } from 'framer-motion';

export const DemoDashboard = () => {
    const {
        setIsConnected,
        addTranscriptSegment,
        updateRiskScore,
        triggerFallacy
    } = useSessionStore();

    // Mock Data Simulation
    useEffect(() => {
        setIsConnected(true);

        let step = 0;
        const mockConversation = [
            { speaker: 'user', text: "We need to discuss the budget for Q4.", isFallacy: false },
            { speaker: 'other', text: "The price is too high, no one pays that.", isFallacy: true, fallacyName: "Ad Populum", counter: "Let's stick to the value provided rather than what others might pay." },
            { speaker: 'user', text: "I understand, but our quality justifies the cost.", isFallacy: false },
            { speaker: 'other', text: "You're just being greedy like all salespeople.", isFallacy: true, fallacyName: "Ad Hominem", counter: "Let's focus on the product features, not personal attributes." },
            { speaker: 'user', text: "Let's look at the ROI analysis.", isFallacy: false },
            { speaker: 'other', text: "If we buy this, we'll go bankrupt!", isFallacy: true, fallacyName: "Slippery Slope", counter: "That seems like an extreme outcome. Let's look at the actual numbers." },
        ];

        const interval = setInterval(() => {
            if (step >= mockConversation.length) {
                step = 0; // Loop for demo
            }

            const item = mockConversation[step];

            // Add transcript
            addTranscriptSegment({
                speaker: item.speaker as 'user' | 'other',
                text: item.text,
                isFallacy: item.isFallacy
            });

            // Update Risk Score (random fluctuation + spike on fallacy)
            const baseRisk = 20;
            const fallacyRisk = item.isFallacy ? 50 : 0;
            const randomVar = Math.floor(Math.random() * 10);
            updateRiskScore(Math.min(100, baseRisk + fallacyRisk + randomVar));

            // Trigger Fallacy Intervention
            if (item.isFallacy) {
                triggerFallacy({
                    name: item.fallacyName!,
                    counterScript: item.counter!
                });
            }

            step++;
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 max-w-7xl mx-auto">
            {/* Left Column - Transcript (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
                <LiveTranscript />

                {/* Audio Visualizer Placeholder */}
                <div className="glass-panel h-[200px] p-6 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <h2 className="absolute top-6 left-6 text-sm font-mono text-slate-400 uppercase tracking-widest">
                        Audio Visualizer (Demo)
                    </h2>
                    <div className="flex items-end gap-1 h-32 w-full justify-center px-10">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-3 bg-blue-500/50 rounded-t-full"
                                animate={{
                                    height: [20, Math.random() * 100 + 20, 20],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.05,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column - Intelligence (1/3 width) */}
            <div className="space-y-6">
                <RiskGauge />

                {/* Session Stats */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                        Session Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-white">12:45</div>
                            <div className="text-xs text-slate-500">Duration</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">3</div>
                            <div className="text-xs text-slate-500">Fallacies</div>
                        </div>
                    </div>
                </div>
            </div>

            <InterventionDeck />
        </div>
    );
};
