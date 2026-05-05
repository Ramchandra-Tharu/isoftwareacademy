"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PublicNavbar() {
  const { status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 font-sans ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-white py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-tight text-[#1A4B6B]">iSoftware Lab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-[#4270BD] transition-colors">Home</Link>
            
            <div className="relative group py-4">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-[#4270BD] transition-colors">
                Courses <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 mt-[-8px]">
                <Link href="/courses" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">All Courses</Link>
                <Link href="/courses?tab=free" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Free Courses</Link>
                <Link href="/courses?tab=premium" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Premium Courses</Link>
              </div>
            </div>

            <Link href="/certificates" className="text-sm font-semibold text-slate-600 hover:text-[#4270BD] transition-colors">Certifications</Link>

            <Link href="#" className="text-sm font-semibold text-slate-600 hover:text-[#4270BD] transition-colors">About</Link>
            <Link href="#" className="text-sm font-semibold text-slate-600 hover:text-[#4270BD] transition-colors">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => router.push(status === "authenticated" ? "/dashboard" : "/get-started")}
              className="bg-[#1A4B6B] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#153a54] transition-all shadow-sm"
            >
              Start Learning
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 hover:text-slate-900">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden overflow-y-auto">
          <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-6">
              <Link href="/" className="text-lg font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              
              <div className="flex flex-col gap-4">
                <span className="text-lg font-bold text-slate-400">Courses</span>
                <Link href="/courses" className="text-lg font-bold text-slate-800 pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>All Courses</Link>
                <Link href="/courses?tab=free" className="text-lg font-bold text-slate-800 pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Free Courses</Link>
                <Link href="/courses?tab=premium" className="text-lg font-bold text-slate-800 pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Premium Courses</Link>
              </div>

              <Link href="/certificates" className="text-lg font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Certifications</Link>

              <Link href="#" className="text-lg font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="#" className="text-lg font-bold text-slate-800" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
               <button 
                  onClick={() => { setMobileMenuOpen(false); router.push(status === "authenticated" ? "/dashboard" : "/get-started"); }}
                  className="w-full bg-[#1A4B6B] text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-[#153a54] transition-all shadow-sm text-center"
                >
                  Start Learning
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
