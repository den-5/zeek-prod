"use client";
import React from 'react';
import Link from 'next/link';

function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            {}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-sm mb-4">
                    Next Generation Gaming
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                    PLAY TO WIN
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Experience real-time multiplayer gaming with fair odds and instant payouts. 
                    Join thousands of players winning daily.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <Link href="/games">
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 hover:shadow-indigo-600/40 w-full sm:w-auto">
                            Start Playing Now
                        </button>
                    </Link>
                    <Link href="/auth/signup">
                        <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all border border-white/10 hover:border-white/20 w-full sm:w-auto">
                            Create Account
                        </button>
                    </Link>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl text-left">
                <div className="glass-panel p-8 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform text-indigo-400">
                        ⚡
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Instant Action</h3>
                    <p className="text-slate-400 leading-relaxed">
                        No delays, no lags. built on high-performance WebSockets for real-time gameplay experiences.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform text-purple-400">
                        🎮
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Fair Play</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Provably fair algorithms ensure every game result is random and verifiable. Compete with peace of mind.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform text-emerald-400">
                        🏆
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Rewards & Ranks</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Climb the leaderboards, earn achievements, and unlock exclusive rewards as you level up.
                    </p>
                </div>
            </div>
            
            {}
            <div className="mt-32 w-full border-t border-white/5 pt-16">
                 <div className="flex flex-wrap justify-center gap-16 md:gap-32">
                    <div>
                        <div className="text-4xl font-black text-white mb-2">10k+</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Active Players</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-2">50M+</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Games Played</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-2">99.9%</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Uptime</div>
                    </div>
                 </div>
            </div>
        </div>
    );
}

export default Page;