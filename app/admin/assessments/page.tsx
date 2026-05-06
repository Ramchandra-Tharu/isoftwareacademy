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
import { cn } from "@/lib/utils"; // Assuming cn is available, or I'll define it locally if I must

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const assessments = [
    { id: "1", title: "Frontend Engineering Core", category: "React.js", questions: 45, timeLimit: "60 mins", difficulty: "Intermediate", status: "Active", enrolled: 342 },
    { id: "2", title: "Backend Architecture", category: "Node.js", questions: 30, timeLimit: "45 mins", difficulty: "Advanced", status: "Active", enrolled: 128 },
    { id: "3", title: "Database Design Principles", category: "SQL", questions: 50, timeLimit: "90 mins", difficulty: "Beginner", status: "Draft", enrolled: 0 },
    { id: "4", title: "Cloud Deployment Practices", category: "AWS", questions: 25, timeLimit: "30 mins", difficulty: "Intermediate", status: "Scheduled", enrolled: 45 },
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
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment Detail</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Configuration</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {assessments.map((assessment) => (
                    <tr key={assessment.id} className="group hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                                <ClipboardList size={20} />
                             </div>
                             <div>
                               <span className="text-sm font-black text-gray-900 uppercase tracking-tight block">{assessment.title}</span>
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{assessment.category} • {assessment.questions} Questions</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                               <Clock size={12} className="text-gray-400" /> {assessment.timeLimit}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                               <ShieldAlert size={12} className="text-gray-400" /> {assessment.difficulty}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${assessment.status === 'Active' ? 'bg-emerald-500' : assessment.status === 'Draft' ? 'bg-gray-300' : 'bg-amber-500'}`} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{assessment.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Settings">
                               <Settings size={16} />
                             </button>
                             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Schedule">
                               <Calendar size={16} />
                             </button>
                             <Link href={`/admin/assessments/${assessment.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                               <MoreHorizontal size={16} />
                             </Link>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
