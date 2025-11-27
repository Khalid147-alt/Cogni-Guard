'use client';

import React, { useEffect } from 'react';
import { LiveTranscript } from '@/components/dashboard/LiveTranscript';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { InterventionDeck } from '@/components/dashboard/InterventionDeck';
import { useSessionStore } from '@/store/useSessionStore';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const RealDashboard = () => {
    const {
        setIsConnected,
        addTranscriptSegment,
        updateRiskScore,
        triggerFallacy
    } = useSessionStore();

    const {
        isRecording,
        isConnected: isSocketConnected,
        startRecording,
        stopRecording,
        transcript: liveTranscript,
        fallacies,
        riskScore
    } = useAudioRecorder();

    // Sync hook state with global store
    useEffect(() => {
        setIsConnected(isSocketConnected);
    }, [isSocketConnected, setIsConnected]);

    useEffect(() => {
        updateRiskScore(riskScore);
    }, [riskScore, updateRiskScore]);

    // Sync Transcript
    useEffect(() => {
        if (liveTranscript.length > 0) {
            const lastItem = liveTranscript[liveTranscript.length - 1];
            // Avoid duplicates if possible, or just add the latest
            // The store expects { speaker, text, isFallacy }
            // We need to map the hook's transcript to the store's format
            // This is a simplified sync; in production, we'd diff the lists

            // For now, let's just add the NEWEST item if it's not already there
            // (This logic is imperfect but sufficient for a prototype)
            addTranscriptSegment({
                speaker: 'user', // Assuming user for now, backend might clarify
                text: lastItem.text,
                isFallacy: false
            });
        }
    }, [liveTranscript, addTranscriptSegment]);

    // Sync Fallacies
    useEffect(() => {
        if (fallacies.length > 0) {
            const latest = fallacies[0];
            triggerFallacy({
                name: latest.analysis.fallacy_name || "Detected Fallacy",
                counterScript: latest.analysis.counter_argument || "No counter-script available."
            });

            // Also add to transcript as 'other' or system note
            addTranscriptSegment({
                speaker: 'other',
                text: `[Fallacy Detected] ${latest.text}`,
                isFallacy: true
            });
        }
    }, [fallacies, triggerFallacy, addTranscriptSegment]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 max-w-7xl mx-auto">
            {/* Control Bar */}
            <div className="lg:col-span-3 flex justify-center mb-4">
                <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`h-12 px-8 rounded-full font-bold transition-all duration-300 ${isRecording
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                        }`}
                >
                    {isRecording ? (
                        <>
                            <MicOff className="w-5 h-5 mr-2" />
                            STOP MONITORING
                        </>
                    ) : (
                        <>
                            <Mic className="w-5 h-5 mr-2" />
                            ACTIVATE GUARD
                        </>
                    )}
                </Button>
            </div>

            {/* Left Column - Transcript (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
                <LiveTranscript />

                {/* Audio Visualizer (Real) */}
                <div className="glass-panel h-[200px] p-6 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <h2 className="absolute top-6 left-6 text-sm font-mono text-slate-400 uppercase tracking-widest">
                        Audio Input
                    </h2>
                    {isRecording ? (
                        <div className="flex items-end gap-1 h-32 w-full justify-center px-10">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 bg-green-500/50 rounded-t-full"
                                    animate={{
                                        height: [20, Math.random() * 100 + 20, 20],
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.05,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 font-mono text-sm">
                            MICROPHONE INACTIVE
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Intelligence (1/3 width) */}
            <div className="space-y-6">
                <RiskGauge />

                {/* Session Stats */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">
                        Live Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-white">
                                {isRecording ? "LIVE" : "IDLE"}
                            </div>
                            <div className="text-xs text-slate-500">Status</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">{fallacies.length}</div>
                            <div className="text-xs text-slate-500">Fallacies</div>
                        </div>
                    </div>
                </div>
            </div>

            <InterventionDeck />
        </div>
    );
};
