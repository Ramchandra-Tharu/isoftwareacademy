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
  ShieldAlert,
  Database,
  ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const quizzes = [
    { id: "1", title: "Java Core Concepts", description: "Master foundational Java elements, including OOP principles, syntax, and algorithms.", category: "Java", questions: 45, timeLimit: "60 mins", difficulty: "Intermediate", status: "Active", enrolled: 342, imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { id: "2", title: "Python Data Structures", description: "Deep dive into lists, dictionaries, sets, and tuples to optimize data manipulation.", category: "Python", questions: 30, timeLimit: "45 mins", difficulty: "Advanced", status: "Active", enrolled: 128, imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { id: "3", title: "C++ Memory Management", description: "Understand pointers, references, and manual memory allocation for high-performance apps.", category: "C++", questions: 50, timeLimit: "90 mins", difficulty: "Advanced", status: "Draft", enrolled: 0, imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { id: "4", title: "JavaScript ES6 Fundamentals", description: "Learn modern JS syntax, arrow functions, promises, and modules for web development.", category: "JavaScript", questions: 25, timeLimit: "30 mins", difficulty: "Beginner", status: "Scheduled", enrolled: 45, imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { id: "5", title: "SQL Database Design", description: "Master relational database concepts, normalization, and complex querying architectures.", category: "SQL", questions: 40, timeLimit: "60 mins", difficulty: "Intermediate", status: "Active", enrolled: 210, imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = searchQuery === "" || 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || quiz.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Quiz_Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Create, configure, and monitor evaluation protocols.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/admin/quizzes/question-bank" className="btn-secondary flex items-center gap-2 text-xs bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              <Database size={16} /> Question Bank
           </Link>
           <Link href="/admin/quizzes/new" className="btn-primary flex items-center gap-2 text-xs bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
              <Plus size={16} /> New Quiz
           </Link>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col gap-6 bg-gray-50/30">
            {/* Top row: Search and Difficulty */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
               <div className="relative group w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm" 
                    placeholder="Search by title, category or keywords..." 
                  />
               </div>
               
               <select className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm w-full sm:w-auto shrink-0">
                  <option>All Difficulties</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
               </select>
            </div>
            
            {/* Bottom row: Status filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
               {["All", "Active", "Draft", "Scheduled"].map((status) => (
                  <button 
                     key={status}
                     onClick={() => setStatusFilter(status)}
                     className={cn(
                        "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        statusFilter === status 
                          ? "bg-gray-900 text-white shadow-md shadow-gray-900/10" 
                          : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                     )}
                  >
                     {status}
                  </button>
               ))}
            </div>
         </div>
         <div className="p-8 bg-gray-50/30">
            {filteredQuizzes.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="group flex flex-col bg-white border border-gray-100 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-600/10 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                    
                    {/* Banner Image */}
                    <div className="h-24 w-full relative overflow-hidden bg-gray-900 flex items-center justify-center p-4 border-b border-gray-800">
                       <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 opacity-80" />
                       <img 
                          src={quiz.imageUrl} 
                          alt={quiz.title}
                          className="relative z-10 h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                       />
                       
                       <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <Link href={`/admin/quizzes/${quiz.id}/edit`} className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm backdrop-blur-sm border border-white/10">
                             <Settings size={12} />
                          </Link>
                       </div>

                       <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md px-2 py-1 rounded-lg shadow-xl border border-white/10">
                          <div className={`w-1 h-1 rounded-full ${quiz.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : quiz.status === 'Draft' ? 'bg-gray-400' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} title={quiz.status} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white">{quiz.status}</span>
                       </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                       <div className="flex-1 space-y-2">
                          <div className="inline-flex">
                             <span className="px-2 py-0.5 bg-blue-50 text-[9px] font-black uppercase tracking-widest text-blue-600 rounded-md">
                                {quiz.category}
                             </span>
                          </div>
                          <div>
                             <h3 className="text-sm font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">{quiz.title}</h3>
                             <p className="text-[10px] font-medium text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{quiz.description}</p>
                          </div>
                       </div>

                       <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Clock size={14} />
                             </div>
                             <p className="text-xs font-bold text-gray-700">{quiz.timeLimit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <ClipboardList size={14} />
                             </div>
                             <p className="text-xs font-bold text-gray-700">{quiz.questions} Qs</p>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            ) : (
               <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                     <Search size={24} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">No Quizzes Found</h3>
                  <p className="text-xs font-medium text-gray-500">Try adjusting your search or status filters.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
