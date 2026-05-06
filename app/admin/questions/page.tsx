"use client";

import React, { useState } from "react";
import { 
  Database, 
  Plus, 
  Search, 
  Upload, 
  Filter, 
  MoreHorizontal, 
  HelpCircle,
  FolderTree,
  Tag,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionsBankPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const questions = [
    { id: "1", text: "What is the primary difference between a clustered and non-clustered index?", category: "Database Design", type: "Multiple Choice", difficulty: "Advanced", usage: 4 },
    { id: "2", text: "Explain the concept of closures in JavaScript and provide a practical use case.", category: "Frontend Engineering", type: "Short Answer", difficulty: "Intermediate", usage: 12 },
    { id: "3", text: "Which AWS service is best suited for deploying a containerized application without managing underlying servers?", category: "Cloud Deployment", type: "Multiple Choice", difficulty: "Intermediate", usage: 8 },
    { id: "4", text: "A microservices architecture always results in better performance than a monolithic one.", category: "Systems Architecture", type: "True/False", difficulty: "Beginner", usage: 15 },
    { id: "5", text: "Write a React hook that manages a debounced value.", category: "Frontend Engineering", type: "Coding", difficulty: "Advanced", usage: 2 },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Question_Bank</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Structured repository for managing assessment items.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn-secondary flex items-center gap-2 text-xs bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              <Upload size={16} /> Bulk Upload
           </button>
           <button className="btn-primary flex items-center gap-2 text-xs bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
              <Plus size={16} /> New Question
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {/* Categories Sidebar */}
         <div className="lg:col-span-1 space-y-4">
            <div className="card-premium p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                     <FolderTree size={14} /> Taxonomy
                  </h3>
                  <button className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Plus size={14} /></button>
               </div>
               <div className="space-y-1">
                  {["All Categories", "Frontend Engineering", "Backend Architecture", "Database Design", "Cloud Deployment", "Systems Architecture"].map((cat, i) => (
                    <button key={i} className={cn(
                       "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                       i === 0 ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}>
                       {cat}
                       {i > 0 && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md">12</span>}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Questions List */}
         <div className="lg:col-span-3 card-premium overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
               <div className="relative group flex-1 w-full sm:max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm" 
                    placeholder="Search question text or tags..." 
                  />
               </div>
               
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <select className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm">
                    <option>Type: All</option>
                    <option>Multiple Choice</option>
                    <option>Short Answer</option>
                    <option>Coding</option>
                    <option>True/False</option>
                 </select>
                 <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm flex items-center justify-center">
                    <Filter size={16} />
                 </button>
               </div>
            </div>
            
            <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
               {questions.map((q) => (
                 <div key={q.id} className="p-6 group hover:bg-gray-50/50 transition-colors relative">
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Actions">
                          <MoreHorizontal size={16} />
                       </button>
                    </div>

                    <div className="pr-12">
                       <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                             <HelpCircle size={10} /> {q.type}
                          </span>
                          <span className={cn(
                             "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border",
                             q.difficulty === "Advanced" ? "bg-red-50 text-red-600 border-red-100" :
                             q.difficulty === "Intermediate" ? "bg-amber-50 text-amber-600 border-amber-100" :
                             "bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}>
                             {q.difficulty}
                          </span>
                       </div>
                       
                       <h4 className="text-sm font-bold text-gray-900 leading-snug mb-4">{q.text}</h4>
                       
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             <Tag size={12} /> {q.category}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             <CheckCircle2 size={12} /> Used in {q.usage} Assessments
                          </div>
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
