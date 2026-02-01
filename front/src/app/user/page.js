"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTransactions from "./_components/_UserTransactions";
import { useDispatch } from "react-redux";

const UserPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({ email: "", username: "" });
  const [showTransactions, setShowTransactions] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [balanceUpdated, setBalanceUpdated] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/checkauth`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          localStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    fetchUserInfo();
  }, [balanceUpdated]);

  const changePasswordHandler = async () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least one letter, at least one number, and be longer than six characters"
      );
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ newPassword, oldPassword }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully");
        setShowChangePassword(false);
        setNewPassword("");
        setConfirmPassword("");
        setOldPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to change password");
      }
    } catch (error) {
      setError("An error occurred while changing the password");
    }
  };


  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-slate-900 font-sans text-white">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header / Profile Card */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/20">
                        {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{userInfo.username}</h1>
                        <p className="text-slate-400">{userInfo.email}</p>
                    </div>
                </div>
                <button
                    className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-semibold"
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/");
                    }}
                >
                    sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Settings Panel */}
                <div className="md:col-span-1 space-y-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <button 
                            onClick={() => setShowChangePassword(!showChangePassword)}
                            className="w-full flex justify-between items-center text-lg font-bold mb-4"
                        >
                            <span>Security</span>
                            <span className="text-slate-500 text-sm">
                                {showChangePassword ? "Close" : "Edit"}
                            </span>
                        </button>
                        
                        {showChangePassword && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                                {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                                
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-2">Old Password</label>
                                    <input
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        type="password"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-2">New Password</label>
                                    <input
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-2">Confirm Password</label>
                                    <input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                <button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20 mt-2" 
                                    onClick={changePasswordHandler}
                                >
                                    Update Password
                                </button>
                            </div>
                        )}
                        {!showChangePassword && (
                            <p className="text-slate-500 text-sm">Manage your password and account security settings.</p>
                        )}
                    </div>
                </div>

                {/* Main Content Area (History) */}
                <div className="md:col-span-2">
                     <div className="glass-panel p-6 rounded-2xl border border-white/10 min-h-[400px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>📜</span> Activity Log
                        </h2>
                        {showTransactions && <UserTransactions />}
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UserPage;
