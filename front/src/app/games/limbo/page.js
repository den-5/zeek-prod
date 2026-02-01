"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBalance } from "../../../redux/slices/userSlice";
import CountUp from "react-countup";

const Page = () => {
  const dispatch = useDispatch();

  // Game State
  const [resultMultiplier, setResultMultiplier] = useState(1.00); 
  // We initialize at 1.00 so CountUp starts there or stays there.
  
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null); // null = not played yet, true/false
  
  // Inputs
  const [pointsInvested, setPointsInvested] = useState(1);
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);
  const [successChance, setSuccessChance] = useState(48.00);

  const [error, setError] = useState(null);

  // Stats
  const [history, setHistory] = useState([]);

  useEffect(() => {
     // Init default sync
     updateValuesFromMultiplier(2.00);
  }, []);

  const updateValuesFromMultiplier = (mult) => {
    let val = parseFloat(mult);
    if (isNaN(val)) return;
    
    // safe guard
    let chance = 96 / val;
    if (chance > 99) chance = 99;
    if (chance < 0.01) chance = 0.01;
    
    setSuccessChance(chance.toFixed(2));
  };

  const handleMultiplierChange = (e) => {
      const val = e.target.value;
      setTargetMultiplier(val);
      updateValuesFromMultiplier(val);
  }

  const handleChanceChange = (e) => {
      const val = e.target.value;
      setSuccessChance(val);
      // Inverse
      let mult = 96 / parseFloat(val);
      if (isFinite(mult)) {
         setTargetMultiplier(mult.toFixed(2));
      }
  }

  const playLimbo = async () => {
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to play");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/games/limbo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            successChance: Number(successChance),
            target: Number(targetMultiplier),
            entry: Number(pointsInvested),
          }),
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message || data.error || "Game failed");
      } else {
        setIsSuccess(data.isSuccess); // Did we win?
        setResultMultiplier(data.multiplier); // What was the crash point?
        
        dispatch(setBalance(data.newBalance));
        
        // Add to history
        setHistory(prev => [{ result: data.multiplier, target: targetMultiplier, won: data.isSuccess }, ...prev].slice(0, 10));
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-slate-900 font-sans text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
             <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>🚀</span> Limbo
                </h2>

                {/* Points Input */}
                <div className="mb-6">
                    <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
                        Bet Amount (PTS)
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={pointsInvested}
                            onChange={(e) => setPointsInvested(Number(e.target.value))}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 pl-10 text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">❖</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                            Target Multiplier (x)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={targetMultiplier}
                            onChange={handleMultiplierChange}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white font-bold text-center focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                         <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                            Win Chance (%)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={successChance}
                            onChange={handleChanceChange}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white font-bold text-center focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-4 text-center border border-red-500/30">
                        {error}
                    </div>
                )}

                <button 
                    onClick={playLimbo}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Launching..." : "Launch Rocket"}
                </button>
             </div>
        </div>

        {/* Game Area */}
        <div className="lg:col-span-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 h-full min-h-[400px] flex flex-col relative overflow-hidden">
                
                {/* Visual History */}
                <div className="w-full flex justify-end gap-2 mb-8 h-8">
                     {history.map((h, i) => (
                            <div 
                                key={i} 
                                className={`px-2 py-1 rounded text-xs font-bold min-w-[3rem] text-center flex items-center justify-center
                                ${h.won ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400 border border-white/5'}`}
                            >
                                {parseFloat(h.result).toFixed(2)}x
                            </div>
                    ))}
                </div>

                {/* Main Limbo Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className={`text-9xl font-black font-mono tracking-tighter transition-colors duration-300
                            ${isSuccess === null ? 'text-white' : (isSuccess ? 'text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]')}
                        `}>
                             <CountUp
                                start={0}
                                end={resultMultiplier}
                                decimals={2}
                                duration={0.8} // Faster animation for snappy feel
                                separator=","
                                suffix="x"
                                preserveValue={true} 
                            />
                        </div>
                    </div>

                     {/* Result Message */}
                     <div className="h-12 mt-8">
                        {isSuccess !== null && (
                            <div className={`text-xl font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-300 ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isSuccess ? `Target Hit! +${(pointsInvested * targetMultiplier).toFixed(0)} PTS` : `Crashed @ ${resultMultiplier}x`}
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
