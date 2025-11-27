"use client";

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TranscriptItem {
    id: string;
    text: string;
    isFinal: boolean;
    timestamp: number;
}

interface LiveTranscriptProps {
    transcript: TranscriptItem[];
}

export function LiveTranscript({ transcript, fallacies = [] }: { transcript: TranscriptItem[], fallacies?: any[] }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    return (
        <div className="h-full flex flex-col glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-zinc-100 font-semibold tracking-wide">Live Transcript</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {transcript.length === 0 && (
                    <p className="text-zinc-500 italic">Listening...</p>
                )}
                {transcript.map((item) => {
                    const isManipulative = fallacies.some(f => f.text === item.text);
                    return (
                        <div key={item.id} className="text-zinc-300">
                            <span className="text-xs text-zinc-500 block mb-1 font-mono">
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                            <p className={`leading-relaxed ${isManipulative ? 'bg-red-500/20 text-red-200 p-2 rounded border-l-2 border-red-500' : ''}`}>
                                {item.text}
                            </p>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
