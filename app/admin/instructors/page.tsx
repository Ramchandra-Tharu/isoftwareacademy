"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Award, 
  Star, 
  BookOpen, 
  ExternalLink,
  Shield,
  Loader2,
  Mail,
  Code2,
  Link2,
  Trash2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      // For admin, we might want a slightly richer API, but for now we use the public one
      const res = await fetch("/api/instructors");
      if (res.ok) setInstructors(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = instructors.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500 text-black text-[10px] font-black rounded uppercase tracking-widest animate-pulse">Faculty_Directory</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                INSTRUCTOR_<span className="text-blue-500">MANAGEMENT</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             Authorized content creators and technical leads
           </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
         <input 
           placeholder="FILTER_BY_NAME_OR_EXPERTISE..." 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all"
         />
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
             <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Querying_Faculty_Database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl text-gray-700 italic font-bold uppercase tracking-widest text-[10px]">No instructors found. Promoted users from Student Management.</div>
        ) : (
          filtered.map((inst) => (
            <div key={inst._id} className="bg-black border border-white/5 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all relative overflow-hidden flex flex-col space-y-6">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                  <Shield size={120} />
               </div>

               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
                     {inst.image ? (
                        <img src={inst.image} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-blue-500/30 bg-blue-500/5">
                           {inst.name.charAt(0)}
                        </div>
                     )}
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-blue-500 transition-colors">{inst.name}</h3>
                     <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{inst.email}</p>
                     <div className="flex gap-2 pt-2">
                        {inst.socialLinks?.github && <Code2 size={14} className="text-gray-700 hover:text-white cursor-pointer" />}
                        {inst.socialLinks?.linkedin && <Link2 size={14} className="text-gray-700 hover:text-white cursor-pointer" />}
                        {inst.socialLinks?.twitter && <Link2 size={14} className="text-gray-700 hover:text-white cursor-pointer" />}
                     </div>
                  </div>
               </div>

               <div className="relative z-10 bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[100px]">
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                     {inst.bio || "No professional biography available for this instructor entity."}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Active_Courses</p>
                     <div className="flex items-center gap-2">
                        <BookOpen size={12} className="text-blue-500" />
                        <span className="text-sm font-black text-white">4 Units</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Global_Rating</p>
                     <div className="flex items-center gap-2">
                        <Star size={12} className="text-[#EBBB54]" />
                        <span className="text-sm font-black text-white">4.92</span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-4 relative z-10">
                  <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">
                     VIEW_PROFILE
                  </button>
                  <button className="px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl transition-all flex items-center justify-center">
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
