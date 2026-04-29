"use client";

import React, { useState, useEffect } from "react";
import { 
  HelpCircle, 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  BarChart3, 
  MoreVertical,
  Settings2,
  CheckSquare,
  Trash2,
  Loader2,
  Filter,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quizzes");
      if (res.ok) setQuizzes(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      if (res.ok) fetchQuizzes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title?.toLowerCase().includes(search.toLowerCase()) ||
    quiz.courseId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Evaluation Core...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Quiz_Architecture</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Design cognitive assessments and track performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/quizzes/question-bank" className="px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <FileText size={16} /> Question Bank
          </Link>
          <Link href="/admin/quizzes/new" className="btn-primary flex items-center gap-2 text-xs">
            <Plus size={18} /> Create Quiz
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="FILTER_ASSESSMENTS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-blue-100 focus:bg-white transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
           <Filter size={16} /> Filter_Config
        </button>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredQuizzes.length === 0 ? (
          <div className="card-premium p-20 text-center space-y-4">
             <HelpCircle className="mx-auto text-gray-100" size={60} />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">No active assessment modules found.</p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="card-premium p-8 group relative overflow-hidden flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm transition-transform group-hover:scale-110">
                 {quiz.image ? (
                   <img src={quiz.image} className="w-full h-full object-cover rounded-2xl" />
                 ) : (
                   <Zap size={32} />
                 )}
              </div>
              
              <div className="flex-1 space-y-4">
                 <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-full">
                       {quiz.courseId?.title || "Independent"}
                    </span>
                    {!quiz.isPublished && (
                       <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest rounded-full">Draft</span>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><CheckSquare size={14} /> {quiz.questions?.length || 0} Questions</div>
                    <div className="flex items-center gap-2"><Clock size={14} /> {quiz.duration || "N/A"} Limit</div>
                    <div className="flex items-center gap-2"><BarChart3 size={14} /> {quiz.attemptsCount || 0} Attempts</div>
                    <div className="flex items-center gap-2"><Settings2 size={14} /> Pass: {quiz.passingScore || 80}%</div>
                 </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-50 lg:pl-8">
                 <Link href={`/admin/quizzes/${quiz._id}/analytics`} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                    <BarChart3 size={20} />
                 </Link>
                 <Link href={`/admin/quizzes/${quiz._id}/edit`} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                    <Settings2 size={20} />
                 </Link>
                 <button onClick={() => handleDelete(quiz._id)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                    <Trash2 size={20} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
