"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletImage from "../../../public/WalletImage";
import Image from "next/image";
import { setBalance } from "@/redux/slices/userSlice";

const GlobalHeader = ({ children }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const balance = useSelector((state) => state.user.balance);
  const IsUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [balancePopUp, setBalancePopUp] = useState(null);

  const fetchBalanceInUsd = async (balance) => {
    const currency = localStorage.getItem("currency");
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/${currency.toLowerCase()}.json`
      );
      if (response.ok) {
        const currencyData = await response.json();
        const conversionRate = currencyData[currency.toLowerCase()]["usd"];

        if (typeof conversionRate !== "number" || isNaN(conversionRate)) {
          return;
        }

        if (currency.toLowerCase() !== "usd") {
          setBalance(balance * conversionRate);
        } else {
          setBalance(balance);
        }
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    
    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data?.newBalance) {
        await fetchBalanceInUsd(data.newBalance);
        setBalancePopUp(data);
        setTimeout(() => {
          setBalancePopUp(null);
        }, 5000);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    fetchBalanceInUsd(balance);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {balancePopUp && (
        <div className="fixed top-24 right-4 z-[60] glass-panel px-6 py-4 rounded-xl text-white animate-fade-in-down border-l-4 border-yellow-500 shadow-xl">
          <div className="font-bold text-lg mb-1">{balancePopUp.amount_usd > 0 ? "+ Credits" : "- Credits"}</div>
          <div className="text-sm opacity-90">
             <span className="font-mono font-bold text-yellow-400">{balancePopUp.amount_usd} pts</span>
          </div>
        </div>
      )}
      
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/5 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {}
            <div className="flex-shrink-0 flex items-center">
              <Link href={IsUserLoggedIn ? "/games" : "/"} className="group flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                  Z
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all font-sans tracking-tight">
                  ZEEK
                </h1>
              </Link>
            </div>

            {}
            <div className="flex items-center space-x-6">
              {IsUserLoggedIn ? (
                <>
                  <div className="hidden sm:flex items-center bg-slate-800/80 rounded-full px-5 py-2 border border-white/5 shadow-inner">
                    <span className="text-yellow-400 font-bold mr-2 text-sm">PTS</span>
                    <span className="font-mono font-medium text-lg tracking-wide text-white">{balance.toFixed(0)}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {}
                    
                    <Link href="/user" className="flex items-center gap-3 pl-2 py-1 pr-1 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/5">
                      <div className="hidden md:block text-right">
                        <div className="text-sm font-medium text-white">{username}</div>
                        <div className="text-xs text-indigo-400">Level 1</div>
                      </div>
                       <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20 border-2 border-slate-900">
                        {username ? username.charAt(0).toUpperCase() : "U"}
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <button className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
                      Log In
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full group-hover:left-0"></span>
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-6 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 hover:translate-y-[-1px]">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      <footer className="border-t border-white/5 mt-20 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Zeek Gaming Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GlobalHeader;
