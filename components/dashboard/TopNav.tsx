"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, User, ChevronDown, Award, LogOut, Loader2, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TopNav() {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session) {
      console.log("TopNav: Session User Data", session.user);
    }
  }, [session]);

  const displayName = session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || "Student";
  const displayEmail = session?.user?.email?.trim() || "";
  const userImage = session?.user?.image || (session?.user as any)?.picture || (session?.user as any)?.imageUrl || null;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search courses, lessons, or resources..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-100 focus:bg-white transition-all shadow-sm shadow-gray-900/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Credits/Streak Placeholder */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
           <Sparkles size={14} /> 125 XP Earned
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-xl transition-all shadow-sm group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-100"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 p-1 group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Student Profile
              </p>
            </div>
            
            <div className="relative group/avatar">
              {session?.user?.image || (session?.user as any)?.picture || (session?.user as any)?.imageUrl ? (
                <img src={session?.user?.image || (session?.user as any)?.picture || (session?.user as any)?.imageUrl} alt="Avatar" className="w-11 h-11 rounded-2xl border border-gray-100 group-hover:border-blue-200 transition-all shadow-sm" />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black shadow-sm group-hover:scale-105 transition-transform">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              )}
            </div>
            <ChevronDown size={14} className={cn("text-gray-300 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-60 bg-white border border-gray-100 rounded-[2rem] shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-xs font-bold text-gray-900 truncate">{displayEmail}</p>
              </div>
              <Link href="/dashboard/settings" className="w-full flex items-center gap-4 px-6 py-3.5 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <User size={16} /> Profile
              </Link>
              <Link href="/dashboard/certificates" className="w-full flex items-center gap-4 px-6 py-3.5 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <Award size={16} /> Achievements
              </Link>
              <div className="h-px bg-gray-50 my-2"></div>
              <button 
                onClick={() => signOut({ callbackUrl: "/get-started" })}
                className="w-full flex items-center gap-4 px-6 py-3.5 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
