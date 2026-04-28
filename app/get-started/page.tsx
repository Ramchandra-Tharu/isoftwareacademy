"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          throw new Error(res.error);
        }

        // Fetch session to determine role and redirect accordingly
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        const targetPath = sessionData?.user?.role === "admin" ? "/admin" : "/dashboard";
        router.push(targetPath);
        router.refresh();
      } else {
        const endpoint = "/api/auth/register";
        const payload = { name, email, password };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        // Registration success, switch to login
        setIsLogin(true);
        setError("Registration successful! Please sign in.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans selection:bg-[#EBBB54] selection:text-black">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#C2C2C2] hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#EBBB54]">
              iSoftware
            </span>
            <span className="font-serif text-xl font-bold">Academy</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-[#EBBB54]/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="text-[#C2C2C2] text-sm">
              {isLogin
                ? "Enter your credentials to access your courses."
                : "Join the platform and start mastering new technologies."}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-3 rounded-xl text-sm text-center border ${error.includes("successful") ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-red-500/50 bg-red-500/10 text-red-400"}`}>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#C2C2C2] mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={!isLogin}
                    className="w-full bg-[#0c0c0c] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EBBB54]/50 focus:ring-1 focus:ring-[#EBBB54]/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#C2C2C2] mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EBBB54]/50 focus:ring-1 focus:ring-[#EBBB54]/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
                <label className="block text-sm font-medium text-[#C2C2C2]">Password</label>
                {isLogin && (
                  <a href="#" className="flex text-xs text-[#EBBB54] hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EBBB54]/50 focus:ring-1 focus:ring-[#EBBB54]/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full bg-[#EBBB54] text-black font-bold rounded-2xl py-3.5 mt-4 hover:bg-[#d9ab4b] transition-colors shadow-[0_0_20px_rgba(235,187,84,0.15)] hover:shadow-[0_0_25px_rgba(235,187,84,0.25)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {loading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 isLogin ? "Sign In" : "Create Account"
               )}
             </button>
          </form>

          <div className="mt-6 mb-6 relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 bg-[#0c0c0c] border border-white/10 rounded-xl py-3 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs">G</div>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#0c0c0c] border border-white/10 rounded-xl py-3 hover:bg-white/5 transition-colors text-sm font-medium">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-[#C2C2C2] text-sm mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#EBBB54] font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
