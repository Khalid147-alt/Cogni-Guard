"use client"

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskGaugeProps {
    score: number;
}

export function RiskGauge({ score }: RiskGaugeProps) {
    const data = [{ name: 'Risk', value: score, fill: score > 80 ? '#ef4444' : score > 50 ? '#f59e0b' : '#22c55e' }];

    return (
        <div className="glass-panel rounded-xl h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-zinc-100 text-center font-semibold">Manipulation Risk</h2>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
                <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="60%" 
                            outerRadius="80%" 
                            barSize={10} 
                            data={data} 
                            startAngle={180} 
                            endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={30 / 2}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pt-8">
                        <span className={`text-4xl font-bold ${score > 80 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : score > 50 ? 'text-amber-500' : 'text-green-500'}`}>
                            {score}
                        </span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Score</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
