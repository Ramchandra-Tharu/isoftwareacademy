"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Loader2, Cpu, Sparkles, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-all group font-black uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return_Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
               <Cpu size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
           {/* Left Side: Branding/Value Prop */}
           <div className="hidden lg:flex flex-col space-y-10 pr-12">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                    <ShieldCheck size={14} /> Enterprise Security Verified
                 </div>
                 <h1 className="text-6xl font-black tracking-tighter text-gray-900 uppercase leading-[0.9]">
                    Initialize Your <br/> <span className="text-blue-600">Evolution.</span>
                 </h1>
                 <p className="text-gray-500 font-medium text-lg max-w-md">
                    Access the most advanced technical curriculum designed for the next generation of software engineers.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                 {[
                   { label: "Active Nodes", val: "5k+" },
                   { label: "Deployment Ready", val: "98%" }
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.val}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Right Side: Auth Form */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             className="w-full max-w-md bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-blue-600/5 relative mx-auto"
           >
             <div className="text-center mb-10">
               <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm border border-blue-100">
                  {isLogin ? <Lock size={28} /> : <User size={28} />}
               </div>
               <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                 {isLogin ? "System_Login" : "Register_Node"}
               </h2>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                 {isLogin ? "Authenticate credentials to continue" : "Join the global developer grid"}
               </p>
             </div>

             {error && (
               <div className={cn(
                 "mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border",
                 error.includes("successful") 
                  ? "border-emerald-100 bg-emerald-50 text-emerald-600" 
                  : "border-red-100 bg-red-50 text-red-600"
               )}>
                 {error}
               </div>
             )}

             <form className="space-y-6" onSubmit={handleSubmit}>
               {!isLogin && (
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Identification Name</label>
                   <div className="relative group">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                     <input
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="FULL_NAME"
                       required={!isLogin}
                       className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-100 focus:bg-white transition-all placeholder:text-gray-300 shadow-sm"
                     />
                   </div>
                 </div>
               )}

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Security Email</label>
                 <div className="relative group">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="EMAIL_INTERFACE"
                     required
                     className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-100 focus:bg-white transition-all placeholder:text-gray-300 shadow-sm"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <div className="flex items-center justify-between px-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Key</label>
                   {isLogin && (
                     <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                       Recover
                     </a>
                   )}
                 </div>
                 <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     required
                     className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-100 focus:bg-white transition-all placeholder:text-gray-300 shadow-sm"
                   />
                 </div>
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-black rounded-2xl py-5 mt-6 text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isLogin ? "Authenticate_System" : "Initialize_Protocol"
                  )}
                </button>
             </form>

             <div className="mt-10 mb-10 relative flex items-center py-2">
               <div className="flex-grow border-t border-gray-100"></div>
               <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-black uppercase tracking-widest">OAuth_Override</span>
               <div className="flex-grow border-t border-gray-100"></div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={handleGoogleSignIn}
                 className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl py-4 hover:bg-gray-50 hover:border-blue-100 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
               >
                 <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[10px]">G</div>
                 Google
               </button>
               <button className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl py-4 hover:bg-gray-50 hover:border-blue-100 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                 <svg className="w-5 h-5 text-gray-900 fill-current" viewBox="0 0 24 24">
                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                 </svg>
                 GitHub
               </button>
             </div>

             <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest mt-10">
               {isLogin ? "New to the grid?" : "Already registered?"}{" "}
               <button
                 type="button"
                 onClick={() => {
                   setIsLogin(!isLogin);
                   setError("");
                 }}
                 className="text-blue-600 hover:underline"
               >
                 {isLogin ? "Initialize Account" : "Access Console"}
               </button>
             </p>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
