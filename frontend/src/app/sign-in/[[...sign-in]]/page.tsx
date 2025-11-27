'use client';

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Marketing */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"
            >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-black" />
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="relative z-10 flex flex-col items-center text-center p-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    >
                        <ShieldAlert className="w-24 h-24 text-blue-500" />
                    </motion.div>

                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        Cogni<span className="text-blue-500">Guard</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                        Negotiate with Superintelligence. Real-time fallacy detection and counter-scripting for high-stakes conversations.
                    </p>
                </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "w-full max-w-md",
                            card: "glass-panel bg-black/40 border-slate-800 shadow-2xl w-full",
                            headerTitle: "text-2xl font-bold text-white",
                            headerSubtitle: "text-slate-400",
                            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300",
                            formFieldInput: "bg-slate-900/50 border-slate-700 text-white focus:border-blue-500 transition-colors",
                            formFieldLabel: "text-slate-300",
                            footerActionLink: "text-blue-400 hover:text-blue-300",
                            identityPreviewText: "text-slate-300",
                            socialButtonsIconButton: "border-slate-700 hover:bg-slate-800 text-white",
                            dividerLine: "bg-slate-800",
                            dividerText: "text-slate-500"
                        }
                    }}
                />
            </div>
        </div>
    );
}
