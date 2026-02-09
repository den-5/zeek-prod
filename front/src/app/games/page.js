"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const GamesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 p-8 mb-12 relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                    COMMUNITY REWARDS
                </h1>
                <p className="text-indigo-200 text-lg max-w-xl">
                    Join daily challenges, compete with friends, and earn badges on the most social gaming platform.
                </p>
                <div className="mt-6 flex space-x-4 justify-center md:justify-start">
                    <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                        View Challenges
                    </button>
                    <button className="px-6 py-3 bg-indigo-800/50 text-white font-bold rounded-xl border border-indigo-500/30 hover:bg-indigo-700/50 transition-colors">
                        Leaderboard
                    </button>
                </div>
            </div>
            {}
            <div className="hidden md:block text-9xl">🎁</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-indigo-500">Popular Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {}
        <Link href="/games/dice" className="group">
          <div className="relative h-64 rounded-2xl overflow-hidden glass-panel hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src="/dice.webp"
              alt="dice"
              layout="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h2 className="text-3xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Dice</h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-sm">Predict the outcome & win</p>
                <span className="px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold">HOT</span>
              </div>
            </div>
          </div>
        </Link>

        {}
        <Link href="/games/limbo" className="group">
          <div className="relative h-64 rounded-2xl overflow-hidden glass-panel hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src="/limbo.webp"
              alt="limbo"
              layout="fill"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h2 className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Limbo</h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-sm">How high can you go?</p>
                <div className="flex text-yellow-400 text-xs gap-1">
                    ★★★★★
                </div>
              </div>
            </div>
          </div>
        </Link>

        {}
        <Link href="/games/mines" className="group">
           <div className="relative h-64 rounded-2xl overflow-hidden glass-panel hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src="/mine.webp"
              alt="mine"
              layout="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h2 className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Mines</h2>
              <div className="flex justify-between items-center">
                 <p className="text-gray-300 text-sm">Avoid the bombs to win</p>
                 <span className="px-3 py-1 bg-emerald-600 rounded-full text-xs font-bold">NEW</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GamesPage;
