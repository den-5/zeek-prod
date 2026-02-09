"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setEmail, setIsLoggedIn } from "../../../redux/slices/userSlice";

const LoginPage = () => {
  const [email, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    } else {
      setError(null);
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        setError(null);
        const { token, username } = await response.json();
        localStorage.setItem("token", token);
        dispatch(setEmail(username));
        dispatch(setIsLoggedIn(true));
        router.push("/games");
      } else {
        setIsLoading(false);
        setError("Invalid credentials");
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-pulse text-xl font-medium text-indigo-400">Signing in...</div>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">Welcome Back</h1>
          <p className="text-slate-400">Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg mb-6 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmailState(e.target.value.toLowerCase())}
              placeholder="name@example.com"
              className="input-modern"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <button 
                onClick={() => router.push("/auth/forgot-password")}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-modern"
            />
          </div>
          
          <button 
            onClick={handleLogin}
            className="btn-primary w-full mt-2"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <button 
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-1" 
              onClick={() => router.push("/auth/signup")}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
