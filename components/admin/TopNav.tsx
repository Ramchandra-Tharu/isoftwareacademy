"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Menu,
  ChevronDown,
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between h-20 px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 font-sans">
      <div className="flex items-center gap-6 flex-1">
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
          <ShieldCheck size={14} /> SECURE_SESSION
        </div>
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search assets, users, or logs..." 
            className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-100 focus:bg-white transition-all text-xs font-bold text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="relative p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all group shadow-sm">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-gray-100"></div>

        <div className="flex items-center gap-4 pl-2 group cursor-pointer relative">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
              {session?.user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {session?.user?.role || "Super Admin"}
            </p>
          </div>
          
          <div className="relative group/avatar">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="w-11 h-11 rounded-2xl border border-gray-100 group-hover:border-blue-200 transition-all shadow-sm" />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black shadow-sm">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
            )}
            
            {/* Dropdown menu on hover */}
            <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/avatar:opacity-100 group-hover/avatar:translate-y-0 transition-all z-50 p-3 overflow-hidden">
               <div className="px-4 py-3 mb-2 border-b border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active_Profile</p>
                  <p className="text-xs font-bold text-gray-900 truncate">{session?.user?.email}</p>
               </div>
               <button 
                onClick={() => signOut({ callbackUrl: "/get-started" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
               >
                  <LogOut size={16} /> Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
