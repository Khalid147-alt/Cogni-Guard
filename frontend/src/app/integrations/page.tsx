'use client';

import React, { useState } from 'react';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { Chrome, Video, Mic, CheckCircle2, Loader2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export default function IntegrationsPage() {
    const [audioBridgeActive, setAudioBridgeActive] = useState(false);
    const [chromeInstalled, setChromeInstalled] = useState(false);
    const [zoomConnected, setZoomConnected] = useState(true); // Default active for demo

    // Simulation States
    const [showChromeModal, setShowChromeModal] = useState(false);
    const [chromeStep, setChromeStep] = useState(0); // 0: Start, 1: Downloading, 2: Installing, 3: Done

    const [showZoomModal, setShowZoomModal] = useState(false);
    const [zoomStep, setZoomStep] = useState(0); // 0: Auth, 1: Connecting, 2: Done

    const handleChromeInstall = () => {
        if (chromeInstalled) return;
        setShowChromeModal(true);
        setChromeStep(1);

        // Simulate flow
        setTimeout(() => setChromeStep(2), 1500);
        setTimeout(() => setChromeStep(3), 3000);
        setTimeout(() => {
            setChromeInstalled(true);
            setShowChromeModal(false);
            setChromeStep(0);
            toast.success("CogniGuard Extension added to Chrome");
        }, 4500);
    };

    const handleZoomConnect = () => {
        if (zoomConnected) return; // Already connected
        setShowZoomModal(true);
        setZoomStep(0);

        setTimeout(() => setZoomStep(1), 1500);
        setTimeout(() => {
            setZoomConnected(true);
            setZoomStep(2);
        }, 3000);
        setTimeout(() => {
            setShowZoomModal(false);
            setZoomStep(0);
            toast.success("Zoom account connected successfully");
        }, 4500);
    };

    return (
        <div className="min-h-screen p-8 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black -z-10" />

            <div className="max-w-5xl w-full relative z-10">
                <header className="text-center mb-16">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-4 tracking-tight"
                    >
                        Connect Your Environment
                    </motion.h1>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg"
                    >
                        Integrate CogniGuard with your favorite communication tools.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Chrome Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={handleChromeInstall}
                    >
                        <IntegrationCard
                            title="Google Chrome Extension"
                            description="Access CogniGuard directly in your browser for Google Meet and web calls."
                            icon={Chrome}
                            actionLabel={chromeInstalled ? "Installed" : "Add to Chrome"}
                            isActive={chromeInstalled}
                        />
                    </motion.div>

                    {/* Zoom Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => !zoomConnected && handleZoomConnect()}
                    >
                        <IntegrationCard
                            title="Zoom Companion App"
                            description="Integrate with Zoom for real-time coaching and analysis during meetings."
                            icon={Video}
                            isActive={zoomConnected}
                            actionLabel={zoomConnected ? "Active" : "Connect Zoom"}
                        />
                    </motion.div>

                    {/* Audio Bridge Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <IntegrationCard
                            title="Desktop Audio Bridge"
                            description="Listen to system audio for Discord, Teams, and other desktop applications."
                            icon={Mic}
                            hasToggle={true}
                            isActive={audioBridgeActive}
                            onToggle={(val) => {
                                setAudioBridgeActive(val);
                                if (val) toast.info("Audio Bridge Activated: Listening to System Audio");
                                else toast.info("Audio Bridge Deactivated");
                            }}
                        />
                        {/* Visual Feedback for Audio Bridge */}
                        {audioBridgeActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 flex justify-center gap-1"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-green-500/50 rounded-full"
                                        animate={{ height: [10, Math.random() * 20 + 10, 10] }}
                                        transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Chrome Installation Modal */}
            <Dialog open={showChromeModal} onOpenChange={setShowChromeModal}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Chrome Web Store</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Installing CogniGuard Browser Extension...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        {chromeStep === 1 && (
                            <>
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <p className="text-sm text-slate-300">Checking compatibility...</p>
                            </>
                        )}
                        {chromeStep === 2 && (
                            <>
                                <Download className="w-12 h-12 text-blue-500 animate-bounce" />
                                <p className="text-sm text-slate-300">Downloading package...</p>
                            </>
                        )}
                        {chromeStep === 3 && (
                            <>
                                <CheckCircle2 className="w-16 h-16 text-green-500 scale-110 transition-all" />
                                <p className="text-lg font-bold text-white">Installation Complete!</p>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Zoom Connection Modal */}
            <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Zoom Integration</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-6">
                        {zoomStep < 2 ? (
                            <div className="w-full space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-slate-800">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Video className="text-white w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3 }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {zoomStep === 0 ? "Requesting permissions..." : "Establishing secure handshake..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold">Connected to Zoom</h3>
                                <p className="text-slate-400 text-sm">CogniGuard is now active in your meetings.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
