"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBalance } from "../../../redux/slices/userSlice";
import MinesButton from "./_components/MinesButton";
import MineAsset from "./_assets/Mine.js"; 
import BombeAsset from "./_assets/Bombe.js";

const Page = () => {
    // Game State
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWon, setIsWon] = useState(false);
    
    // Game Data
    const [minesCount, setMinesCount] = useState(3);
    const [pointsInvested, setPointsInvested] = useState(1);
    const [positions, setPositions] = useState([]); // Revealed tiles
    const [bombsPositions, setBombsPositions] = useState([]); // All bomb locations (on end)
    const [multiplier, setMultiplier] = useState(1.00);
    
    // UI State
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
  
    useEffect(() => {
      // Restore game state if user refreshes
      const checkUserInGame = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
  
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/games/mines/check-user-in-game`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
             // Check if game is actually in progress
            if (data.isPlaying) {
               setIsGameStarted(true);
               setIsPlaying(true);
               setMultiplier(data.multiplier ? data.multiplier.toFixed(2) : 1.00);
               setPositions(data.positions || []);
               // Just keep default minesCount/points if backend doesn't send them back in this specific endpoint
               // or set if available
            }
          }
        } catch (error) {
          console.error("Failed to restore game", error);
        }
      };
      checkUserInGame();
    }, []);
  
    const startGame = async () => {
      if (pointsInvested <= 0) {
          setError("Please enter a valid amount of points.");
          return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/games/mines/start`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ 
                minesCount: Number(minesCount), 
                pointsInvested: Number(pointsInvested) 
            }),
          }
        );
  
        const data = await response.json();
  
        if (response.status !== 200) {
          setError(data.error || "Failed to start game");
          setLoading(false);
          return;
        }
  
        setIsGameStarted(true);
        setIsPlaying(true);
        setIsWon(false);
        setPositions(data.positions || []); 
        setMultiplier(1.00);
        setBombsPositions([]);
        dispatch(setBalance(data.newBalance));
        setLoading(false);
  
      } catch (error) {
        setError("Network error. Please try again.");
        setLoading(false);
      }
    };
  
    const handleTileClick = async (row, col) => {
      if (!isPlaying || loading) return;
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/games/mines/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ target: { x: row, y: col } }),
          }
        );
        
        const data = await response.json();
        
        setPositions(data.positions);
        setMultiplier(data.multiplier ? data.multiplier.toFixed(2) : multiplier);
        
        if (!data.isPlaying) {
          // Game Over (Lost)
          setIsPlaying(false);
          setBombsPositions(data.bombsPositions || []); 
        } 
      } catch (error) {
        console.error("Move failed", error);
      }
    };
  
    const cashOut = async () => {
      if (!isPlaying) return;
      setLoading(true);
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/games/mines/collect`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const data = await response.json();
        
        if (response.status === 200) {
          setIsPlaying(false);
          setIsWon(true);
          setBombsPositions(data.bombsPositions || []);
          dispatch(setBalance(data.newBalance));
          setMultiplier(data.multiplier.toFixed(2));
        } else {
            setError(data.error);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                  <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                          <span>💣</span> Mines Rush
                      </h2>
  
                      {/* Points Input */}
                      <div className="mb-6">
                          <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
                              Points to Play
                          </label>
                          <div className="relative">
                              <input 
                                  type="number" 
                                  value={pointsInvested}
                                  onChange={(e) => setPointsInvested(Number(e.target.value))}
                                  disabled={isPlaying}
                                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 pl-10 text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">❖</span>
                          </div>
                      </div>
  
                      {/* Mines Count */}
                      <div className="mb-8">
                          <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
                              Mines Density ({minesCount})
                          </label>
                          <input 
                              type="range"
                              min="1"
                              max="24"
                              value={minesCount}
                              onChange={(e) => setMinesCount(Number(e.target.value))}
                              disabled={isPlaying}
                              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                           <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                              <span>1 MINE</span>
                              <span>24 MINES</span>
                          </div>
                      </div>
  
                      {/* Action Button */}
                      {error && (
                          <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-4 border border-red-500/30">
                              {error}
                          </div>
                      )}
  
                      {!isPlaying ? (
                          <button 
                              onClick={startGame}
                              disabled={loading}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {loading ? "Loading..." : "Start Game"}
                          </button>
                      ) : (
                          <button 
                              onClick={cashOut}
                              disabled={loading || positions.length === 0}
                              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center leading-tight"
                          >
                              <span className="text-xs opacity-90 uppercase tracking-widest">Cash Out</span>
                              <span>{Math.floor(pointsInvested * multiplier)} PTS</span>
                          </button>
                      )}
                  </div>
              </div>
  
              {/* Stats Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center">
                      <div>
                          <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">Current Multiplier</div>
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                              {multiplier}x
                          </div>
                      </div>
                       <div>
                          <div className="text-slate-400 text-xs uppercase font-bold tracking-wider text-right">Potential Win</div>
                          <div className="text-xl font-bold text-emerald-400 text-right">
                              {(pointsInvested * multiplier).toFixed(0)} PTS
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          {/* Game Grid */}
          <div className="lg:col-span-8 flex justify-center items-center">
              <div className="relative glass-panel p-4 md:p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/40">
                  
                  {/* Game Over Overlay */}
                  {!isPlaying && isGameStarted && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
                          <div className="text-center p-8 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl transform scale-110">
                              {isWon ? (
                                  <>
                                      <div className="text-6xl mb-4">🏆</div>
                                      <h3 className="text-3xl font-black text-white mb-2">YOU WON!</h3>
                                      <p className="text-emerald-400 text-xl font-bold">+{Math.floor(pointsInvested * multiplier)} PTS</p>
                                  </>
                              ) : (
                                  <>
                                      <div className="text-6xl mb-4">💥</div>
                                      <h3 className="text-3xl font-black text-white mb-2">GAME OVER</h3>
                                      <p className="text-slate-400">Better luck next time!</p>
                                  </>
                              )}
                              <button 
                                  onClick={() => setIsGameStarted(false)}
                                  className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors"
                              >
                                  Play Again
                              </button>
                          </div>
                       </div>
                  )}
  
                  <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 w-fit mx-auto">
                       {[...Array(5)].map((_, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                              {[...Array(5)].map((_, colIndex) => {
                                  const key = `${rowIndex}-${colIndex}`;
                                  
                                  // Determine state of this cell
                                  const isRevealed = positions.some(p => p.x === rowIndex && p.y === colIndex);
                                  
                                  // Formatting bomb positions from backend
                                  // Backend might send array of objects {x,y} 
                                  let isBomb = false;
                                  if (!isPlaying && bombsPositions) {
                                      if (Array.isArray(bombsPositions)) {
                                          isBomb = bombsPositions.some(b => b.x === rowIndex && b.y === colIndex);
                                      }
                                  }

                                  return (
                                    <div key={key} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 relative bg-slate-800/20 rounded-xl">
                                        {/* If Revealed & Not Bomb -> Show Gem/MineAsset */}
                                        {isRevealed && (
                                            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/50 shadow-inner shadow-indigo-500/20 animate-in zoom-in duration-200">
                                                <div className="w-2/3 h-2/3">
                                                   <MineAsset />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* If Game Ended & Is Bomb -> Show Bomb */}
                                        {!isPlaying && isBomb && (
                                             <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/50 animate-in zoom-in duration-200">
                                                  <div className="w-2/3 h-2/3 opacity-80">
                                                     <BombeAsset /> 
                                                  </div>
                                             </div>
                                        )}

                                        {/* Cover Button */}
                                        {!isRevealed && !( !isPlaying && isBomb ) && (
                                            <div className="absolute inset-0">
                                                <MinesButton
                                                    onClick={() => handleTileClick(rowIndex, colIndex)}
                                                    disabled={!isPlaying} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                  );
                              })}
                          </React.Fragment>
                       ))}
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Page;
