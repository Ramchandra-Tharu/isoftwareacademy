"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Menu,
  ChevronDown,
  LogOut
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
    <header className="flex items-center justify-between h-20 px-8 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 font-mono">
      <div className="flex items-center gap-4 flex-1">
        <div className="px-3 py-1 bg-[#EBBB54] text-black text-[10px] font-black rounded-full uppercase tracking-tighter">
          SECURE_SESSION
        </div>
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="ACCESS_DATABASE_QUERY..." 
            className="w-full h-11 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-xl focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group border border-white/5">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#EBBB54] rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-white/5"></div>

        <div className="flex items-center gap-4 pl-2 group cursor-pointer relative">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-white group-hover:text-[#EBBB54] transition-colors uppercase tracking-tight">
              {session?.user?.name || "ADMIN_UNIT"}
            </p>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
              {session?.user?.role || "ROOT_USER"}
            </p>
          </div>
          
          <div className="relative">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-[#EBBB54]/50 transition-all" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#EBBB54] flex items-center justify-center text-black font-black">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50 p-2">
             <button 
              onClick={() => signOut({ callbackUrl: "/get-started" })}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
             >
                <LogOut size={16} /> TERMINATE_SESSION
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
