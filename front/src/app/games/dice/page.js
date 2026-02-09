"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBalance } from "../../../redux/slices/userSlice";

const Page = () => {
  const dispatch = useDispatch();
  
  
  const [number, setNumber] = useState(50.00); 
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null); 
  
  
  const [pointsInvested, setPointsInvested] = useState(1);
  const [multiplier, setMultiplier] = useState(2.00);
  const [successChance, setSuccessChance] = useState(48.00); 
  const [variant, setVariant] = useState("over"); 
  const [rollOver, setRollOver] = useState(52.00); 
  
  const [error, setError] = useState(null);
  
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    
    updateValuesFromChance(48.00);
  }, []);

  
  
  
  const updateValuesFromChance = (chance) => {
    let val = parseFloat(chance);
    if (isNaN(val) || val < 0.01 || val > 98) return; 
    
    
    const newMult = 96 / val;
    setMultiplier(newMult.toFixed(4));
    
    
    
    
    if (variant === "over") {
        setRollOver((100 - val).toFixed(2));
    } else {
        setRollOver(val.toFixed(2));
    }
  };

  const handleChanceChange = (e) => {
    const val = e.target.value;
    setSuccessChance(val);
    updateValuesFromChance(val);
  };

  const handleMultiplierChange = (e) => {
    const val = e.target.value;
    setMultiplier(val);
    
    if (val > 0) {
        const newChance = 96 / val;
        setSuccessChance(newChance.toFixed(2));
        if (variant === "over") {
            setRollOver((100 - newChance).toFixed(2));
        } else {
            setRollOver(newChance.toFixed(2));
        }
    }
  };
  
  const handleVariantToggle = () => {
      const newVariant = variant === "over" ? "under" : "over";
      setVariant(newVariant);
      
      if (newVariant === "over") {
          setRollOver((100 - successChance).toFixed(2));
      } else {
          setRollOver(parseFloat(successChance).toFixed(2));
      }
  };

  const playDice = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/games/random-number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
              successChance: Number(successChance), 
              variant, 
              entry: Number(pointsInvested) 
          }),
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "Game failed");
      } else {
        setIsSuccess(data.isSuccess);
        setNumber(data.randomNumber);
        setIsGameStarted(true);
        dispatch(setBalance(data.newBalance));
        
        
        setHistory(prev => [{ result: data.randomNumber, won: data.isSuccess }, ...prev].slice(0, 10));
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
        
        {}
        <div className="lg:col-span-4 space-y-6">
             <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span>🎲</span> Dice Roll
                </h2>

                {}
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
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                            Multiplier (x)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={multiplier}
                            onChange={handleMultiplierChange}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white font-bold text-center focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                 <button 
                    onClick={handleVariantToggle}
                    className="w-full mb-6 py-3 px-4 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 transition-colors font-bold text-sm tracking-wide text-indigo-300"
                >
                    Predict: {variant === "over" ? "ROLL OVER" : "ROLL UNDER"} {rollOver}
                </button>

                {error && (
                    <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-4 text-center border border-red-500/30">
                        {error}
                    </div>
                )}

                <button 
                    onClick={playDice}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Rolling..." : "Roll Dice"}
                </button>
             </div>
        </div>

        {}
        <div className="lg:col-span-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 h-full min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                
                {}
                <div className="absolute top-8 left-0 w-full text-center">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">History</div>
                    <div className="flex justify-center gap-2">
                        {history.map((h, i) => (
                            <div 
                                key={i} 
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${h.won ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}
                            >
                                {parseFloat(h.result).toFixed(0)}
                            </div>
                        ))}
                    </div>
                </div>

                {}
                <div className="w-full px-4 md:px-12 py-12">
                     <div className="relative h-24 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center px-4 overflow-hidden">
                        
                        {}
                        <div className="absolute inset-0 w-full h-full">
                            {}
                            {variant === "over" ? (
                                <div className="w-full h-full flex">
                                    <div className="h-full bg-red-500/10 border-r border-red-500/30 transition-all duration-300" style={{ width: `${rollOver}%` }} />
                                    <div className="h-full bg-emerald-500/10 transition-all duration-300" style={{ width: `${100 - rollOver}%` }} />
                                </div>
                            ) : (
                                <div className="w-full h-full flex">
                                    <div className="h-full bg-emerald-500/10 border-r border-emerald-500/30 transition-all duration-300" style={{ width: `${rollOver}%` }} />
                                    <div className="h-full bg-red-500/10 transition-all duration-300" style={{ width: `${100 - rollOver}%` }} />
                                </div>
                            )}
                        </div>

                        {}
                        <div 
                            className="absolute top-0 bottom-0 w-1 bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                            style={{ left: `${rollOver}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs font-bold py-1 px-2 rounded">
                                {rollOver}
                            </div>
                        </div>

                        {}
                        <div 
                           className="absolute top-1/2 -translate-y-1/2 w-16 h-16 z-20 transition-all duration-700 ease-out flex items-center justify-center"
                           style={{ left: `calc(${number}% - 32px)` }}
                        >
                            <div className={`
                                w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black shadow-2xl border-4 transform transition-colors duration-200
                                ${isGameStarted 
                                    ? (isSuccess ? 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/50 scale-110' : 'bg-red-500 border-red-300 text-white shadow-red-500/50')
                                    : 'bg-white border-slate-200 text-slate-900'}
                            `}>
                                {number}
                            </div>
                        </div>
                     </div>

                     {}
                     <div className="flex justify-between mt-4 text-xs font-bold text-slate-500 px-1">
                         <span>0</span>
                         <span>25</span>
                         <span>50</span>
                         <span>75</span>
                         <span>100</span>
                     </div>
                </div>
                
                {}
                <div className="absolute bottom-8 w-full text-center h-8">
                    {isGameStarted && (
                        <div className={`text-2xl font-black animate-in slide-in-from-bottom-2 fade-in ${isSuccess ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isSuccess ? `YOU WON +${(pointsInvested * multiplier).toFixed(0)} PTS` : 'ROLLED LOW'}
                        </div>
                    )}
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
