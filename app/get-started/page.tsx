"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(true);
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

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
    <div className="min-h-screen bg-slate-50 text-[#0F172A] flex flex-col font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group font-bold text-slate-400 hover:text-[#1A4B6B] transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-9 h-9 object-contain" />
            <span className="text-lg font-bold tracking-tight text-[#1A4B6B]">iSoftware Lab</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
           {/* Left Side: Features */}
           <div className="hidden lg:flex flex-col space-y-12 pr-12">
              <div className="space-y-6">
                 <h1 className="text-5xl font-bold tracking-tight leading-[1.1]">
                    Join the Elite <br />
                    <span className="text-[#4270BD]">Developer Community.</span>
                 </h1>
                 <p className="text-slate-500 text-lg leading-relaxed">
                    Master Data Structures, Algorithms, and System Design with the most comprehensive curriculum.
                 </p>
              </div>

              <div className="space-y-6">
                 {[
                   "Access to 300+ Curated Problems",
                   "Live Sessions with Industry Experts",
                   "Gamified Learning Platform",
                   "Company-wise Interview Roadmaps"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-3 font-semibold text-slate-700">
                      <CheckCircle2 className="text-green-500" size={20} /> {text}
                   </div>
                 ))}
              </div>

              <div className="flex items-center gap-4 pt-6">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i+30}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="Student" />
                    ))}
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by 20,000+ Students</p>
              </div>
           </div>

           {/* Right Side: Auth Form */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mx-auto"
           >
             <div className="text-center mb-10">
               <h2 className="text-3xl font-bold mb-2">
                 {isLogin ? "Welcome Back!" : "Create Account"}
               </h2>
               <p className="text-slate-400 text-sm font-medium">
                 {isLogin ? "Login to access your learning dashboard" : "Sign up to start your technical journey"}
               </p>
             </div>

             {error && (
               <div className={cn(
                 "mb-8 p-4 rounded-xl text-sm font-bold text-center border",
                 error.includes("successful") 
                  ? "border-green-100 bg-green-50 text-green-600" 
                  : "border-red-100 bg-red-50 text-red-600"
               )}>
                 {error}
               </div>
             )}

             <form className="space-y-5" onSubmit={handleSubmit}>
               {!isLogin && (
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-600 px-1">Full Name</label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                     <input
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="Enter your full name"
                       required={!isLogin}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:border-[#4270BD] transition-all"
                     />
                   </div>
                 </div>
               )}

               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-600 px-1">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="name@company.com"
                     required
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:border-[#4270BD] transition-all"
                   />
                 </div>
               </div>

               <div className="space-y-1.5">
                 <div className="flex items-center justify-between px-1">
                   <label className="text-xs font-bold text-slate-600">Password</label>
                   {isLogin && (
                     <a href="#" className="text-xs font-bold text-[#4270BD] hover:underline">Forgot?</a>
                   )}
                 </div>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     required
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-sm font-semibold focus:outline-none focus:border-[#4270BD] transition-all"
                   />
                 </div>
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A4B6B] text-white font-bold rounded-xl py-4 mt-4 hover:bg-[#153a54] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isLogin ? "Login to Account" : "Create My Account"
                  )}
                </button>
             </form>

             <div className="mt-8 mb-8 relative flex items-center py-2">
               <div className="flex-grow border-t border-slate-100"></div>
               <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
               <div className="flex-grow border-t border-slate-100"></div>
             </div>

             <button 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-3.5 hover:bg-slate-50 transition-all font-bold text-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>

             <p className="text-center text-slate-500 text-sm font-semibold mt-10">
               {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
               <button
                 type="button"
                 onClick={() => {
                   setIsLogin(!isLogin);
                   setError("");
                 }}
                 className="text-[#4270BD] hover:underline"
               >
                 {isLogin ? "Sign up" : "Login"}
               </button>
             </p>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
