"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, Cpu, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Initializing validation protocol...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Null_Token_Detected: Verification string missing.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Validation_Failure");
        }

        setStatus("success");
        setMessage(data.message || "Credential_Verified: Node activation complete.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="text-center space-y-8">
      {status === "loading" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center justify-center relative">
             <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
             <div className="absolute inset-0 bg-blue-600/10 rounded-[1.5rem] animate-ping opacity-20" />
          </div>
          <div className="space-y-2">
             <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900">Validating_Node</h2>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{message}</p>
          </div>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
             <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
             <h2 className="text-3xl font-black tracking-tighter uppercase text-gray-900">Success_Confirmed</h2>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed px-6">{message}</p>
          </div>
          <Link href="/get-started" className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-blue-600/20 text-[10px] uppercase tracking-widest">
            Initialize_Session <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
             <XCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
             <h2 className="text-3xl font-black tracking-tighter uppercase text-gray-900">Validation_Denied</h2>
             <p className="text-xs font-bold text-red-400 uppercase tracking-widest leading-relaxed px-6">{message}</p>
          </div>
          <Link href="/get-started" className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all text-[10px] uppercase tracking-widest">
            Retray_Registration
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <nav className="p-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
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

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md bg-white border border-gray-100 rounded-[3rem] p-12 relative z-10 shadow-2xl shadow-blue-600/5 overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
             <ShieldCheck size={160} />
          </div>

          <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
            <VerifyContent />
          </Suspense>

          <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <Sparkles size={12} className="text-blue-600" /> End-To-End Security Enabled
             </div>
          </div>
        </motion.div>
      </main>

      <footer className="p-10 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            © 2026 iSoftware_Lab_Academy // System_Ver_2.0.0
         </p>
      </footer>
    </div>
  );
}
