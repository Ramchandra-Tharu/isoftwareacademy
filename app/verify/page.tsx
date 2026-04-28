"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="text-center">
      {status === "loading" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#EBBB54] mb-4" />
          <h2 className="text-xl font-serif">Verifying...</h2>
          <p className="text-[#C2C2C2] text-sm mt-2">{message}</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-serif text-green-400 mb-2">Verified!</h2>
          <p className="text-[#C2C2C2] text-sm mb-8">{message}</p>
          <Link href="/get-started" className="bg-[#EBBB54] text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-200">
            Go to Login
          </Link>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-serif text-red-400 mb-2">Verification Failed</h2>
          <p className="text-[#C2C2C2] text-sm mb-8">{message}</p>
          <Link href="/get-started" className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors duration-200">
            Back to Login / Register
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans selection:bg-[#EBBB54] selection:text-black">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#EBBB54]">iSoftware</span>
            <span className="font-serif text-xl font-bold">Academy</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-[#EBBB54]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 relative z-10 shadow-2xl">
          <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#EBBB54]" /></div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
