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
    <div className="space-y-10 font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <h1 className="text-4xl font-light tracking-tight text-gray-900">
                Instructor Management
              </h1>
           </div>
           <p className="text-gray-500 text-sm font-medium">
             Authorized content creators and subject-matter experts.
           </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative group w-full max-w-2xl">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
         <input 
           placeholder="Search by instructor name or email..." 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
         />
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
             <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
             <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Querying Faculty Database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-500 font-medium text-sm bg-gray-50/50 space-y-1">
            <p className="text-gray-900 font-bold text-base">No instructors found</p>
            <p>Promoted users from student management will appear here.</p>
          </div>
        ) : (
          filtered.map((inst) => (
            <div key={inst._id} className="bg-white border border-gray-100 rounded-[1.5rem] p-8 group hover:border-blue-100 hover:shadow-md transition-all flex flex-col space-y-6">
               
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                     {inst.image ? (
                        <img src={inst.image} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
                           {inst.name.charAt(0)}
                        </div>
                     )}
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">{inst.name}</h3>
                     <p className="text-xs text-gray-500 font-medium">{inst.email}</p>
                     <div className="flex gap-2 pt-1.5">
                        {inst.socialLinks?.github && <Code2 size={14} className="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />}
                        {inst.socialLinks?.linkedin && <Link2 size={14} className="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />}
                        {inst.socialLinks?.twitter && <Link2 size={14} className="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />}
                     </div>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                     {inst.bio || "No professional biography available for this instructor entity."}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-0.5">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Courses</p>
                     <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-blue-500" />
                        <span className="text-sm font-bold text-gray-900">4 Modules</span>
                     </div>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                     <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-900">4.9</span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-2 pt-4 border-t border-gray-50">
                  <button className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all border border-gray-200 shadow-sm">
                     View Profile
                  </button>
                  <button className="px-4 py-2.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all border border-gray-200 hover:border-red-100 shadow-sm flex items-center justify-center">
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
