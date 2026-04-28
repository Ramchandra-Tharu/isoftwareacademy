"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, User, ChevronDown, Award, LogOut, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TopNav() {
  const { data: session, status } = useSession();
  console.log("TopNav: session status", status, "session data", session);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Derived user data for cleaner rendering
  // Fallback chain: Full Name -> Email Username -> "Student"
  const displayName = session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || "";
  const displayEmail = session?.user?.email?.trim() || "";
  const userImage = session?.user?.image || null;
  const userRole = session?.user?.role || "Student";

  useEffect(() => {
    const fetchNotifications = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/notifications");
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.read).length);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, [status]);

  return (
    <header className="h-20 bg-[#111111]/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search courses, lessons, help..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EBBB54]/20 focus:border-[#EBBB54]/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111111]"></span>
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin text-gray-500" size={16} />
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white group-hover:text-[#EBBB54] transition-colors line-clamp-1">
                  {displayName || "Student"}
                </span>
                <span className="text-[10px] text-gray-500 tracking-tight line-clamp-1 max-w-[150px]">
                  {displayEmail || userRole}
                </span>
              </div>
            )}
            
            {userImage ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 ring-2 ring-transparent group-hover:ring-[#EBBB54]/30 transition-all">
                <img 
                  src={userImage} 
                  alt={displayName || "User"} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EBBB54] to-[#f5d085] flex items-center justify-center text-black font-bold border border-white/20">
                {displayName ? displayName.charAt(0).toUpperCase() : "S"}
              </div>
            )}
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-white/5 mb-2">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-white truncate">{displayEmail}</p>
              </div>
              <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <User size={18} /> Profile Settings
              </Link>
              <Link href="/dashboard/certificates" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Award size={18} /> My Achievements
              </Link>
              <div className="h-px bg-white/5 my-2"></div>
              <button 
                onClick={() => signOut({ callbackUrl: "/get-started" })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
