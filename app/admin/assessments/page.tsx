"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Clock, 
  Settings, 
  MoreHorizontal, 
  Globe, 
  Calendar,
  ShieldAlert
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const assessments = [
    { id: "1", title: "Java Core Concepts", category: "Java", questions: 45, timeLimit: "60 mins", difficulty: "Intermediate", status: "Active", enrolled: 342 },
    { id: "2", title: "Python Data Structures", category: "Python", questions: 30, timeLimit: "45 mins", difficulty: "Advanced", status: "Active", enrolled: 128 },
    { id: "3", title: "C++ Memory Management", category: "C++", questions: 50, timeLimit: "90 mins", difficulty: "Advanced", status: "Draft", enrolled: 0 },
    { id: "4", title: "JavaScript ES6 Fundamentals", category: "JavaScript", questions: 25, timeLimit: "30 mins", difficulty: "Beginner", status: "Scheduled", enrolled: 45 },
    { id: "5", title: "SQL Database Design", category: "SQL", questions: 40, timeLimit: "60 mins", difficulty: "Intermediate", status: "Active", enrolled: 210 },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Assessment_Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Create, configure, and monitor evaluation protocols.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/admin/assessments/new" className="btn-primary flex items-center gap-2 text-xs">
              <Plus size={16} /> New Assessment
           </Link>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex gap-4 items-center w-full md:w-auto">
               <div className="relative group flex-1 md:w-80">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm" 
                    placeholder="Search by title or category..." 
                  />
               </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm">
                 <option>All Difficulties</option>
                 <option>Beginner</option>
                 <option>Intermediate</option>
                 <option>Advanced</option>
              </select>
              <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm">
                 <option>All Statuses</option>
                 <option>Active</option>
                 <option>Draft</option>
                 <option>Scheduled</option>
              </select>
            </div>
         </div>
         <div className="p-8 bg-gray-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {assessments.map((assessment) => (
                 <div key={assessment.id} className="group flex flex-col bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-600/10 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                       <Link href={`/admin/assessments/${assessment.id}/edit`} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                          <Settings size={14} />
                       </Link>
                    </div>

                    <div className="flex items-start justify-between mb-6">
                       <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100/50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <ClipboardList size={24} />
                       </div>
                       <div className={`w-2 h-2 rounded-full mt-2 ${assessment.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : assessment.status === 'Draft' ? 'bg-gray-300' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} title={assessment.status} />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                       <div className="inline-flex">
                          <span className="px-2.5 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500 rounded-md">
                             {assessment.category}
                          </span>
                       </div>
                       <div>
                          <h3 className="text-sm font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{assessment.title}</h3>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                             <Clock size={10} className="text-blue-600/50" /> Duration
                          </p>
                          <p className="text-xs font-bold text-gray-700">{assessment.timeLimit}</p>
                       </div>
                       <div className="space-y-1.5">
                          <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                             <ClipboardList size={10} className="text-blue-600/50" /> Items
                          </p>
                          <p className="text-xs font-bold text-gray-700">{assessment.questions} Qs</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
