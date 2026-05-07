"use client";

import React, { useEffect, useState } from "react";
import { 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Award, 
  ArrowRight,
  Play,
  RotateCcw,
  BarChart,
  Search,
  Filter,
  Layers,
  Zap,
  Target,
  Loader2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useSession } from "next-auth/react";

export default function QuizDashboardPage() {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper because of constant issues
  const HELP_CIRCLE = HelpCircle;
  const TARGET = Target;
  const ZAP = Zap;
  const CHECK_CIRCLE = CheckCircle;

  const quizStats = [
    { title: "Total Quizzes", value: quizzes.length, icon: Layers, description: "course assessments" },
    { title: "Overall Progress", value: "0%", icon: BarChart, description: "completion rate" },
    { title: "Pending Quizzes", value: quizzes.length, icon: Clock, description: "to be attempted" },
    { title: "Finished Quizzes", value: 0, icon: CheckCircle, description: "passed quizzes" },
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes");
        const data = await res.json();
        
        if (res.ok && Array.isArray(data)) {
          setQuizzes(data);
        } else {
          console.error("API error or invalid data format:", data);
          setQuizzes([]);
        }
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Quiz_Center</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Test your knowledge and track your progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search quizzes..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm"
              />
           </div>
           <button className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
              <Filter size={16} />
           </button>
        </div>
      </div>

      {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {quizStats.map((stat, i) => (
           <StatsCard key={i} {...stat} />
         ))}
      </div>

      {/* Quizzes List */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
               <Layers className="text-blue-600" size={20} /> Available Quizzes
            </h3>
         </div>

         {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
               <Loader2 className="animate-spin text-blue-600" size={32} />
               <p className="text-xs font-black tracking-widest uppercase">Loading quiz center...</p>
            </div>
         ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.map((quiz) => {
              if (!quiz || !quiz._id) return null;
              return (
                 <div onClick={() => window.location.href = `/dashboard/quiz/${quiz._id}`} key={quiz._id} className="cursor-pointer group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-600/20 hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 flex flex-col">
                 <div className="h-28 overflow-hidden relative bg-gray-100 flex items-center justify-center border-b border-gray-100">
                    <img src={quiz.image || "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"} alt={quiz.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm border border-gray-100">
                       <div className={`w-1.5 h-1.5 rounded-full ${quiz.difficulty === 'Easy' ? 'bg-emerald-500' : quiz.difficulty === 'Hard' ? 'bg-red-500' : 'bg-amber-500'}`} />
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">{quiz.difficulty}</span>
                    </div>
                 </div>

                 <div className="p-4 flex-1 flex flex-col space-y-3">
                    <div>
                       <h4 className="text-[13px] font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{quiz.title}</h4>
                       <p className="text-[9px] font-medium text-gray-500 line-clamp-2 leading-relaxed mt-1">{quiz.description || "Test your knowledge on this module."}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between relative overflow-hidden min-h-[2.5rem]">
                       <div className="flex items-center gap-4 transition-transform duration-300 group-hover:-translate-x-2">
                          <div className="flex items-center gap-1.5 text-gray-500">
                             <Clock size={12} />
                             <span className="text-[10px] font-bold">{quiz.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                             <HelpCircle size={12} />
                             <span className="text-[10px] font-bold">{quiz.questions?.length || 0} Qs</span>
                          </div>
                       </div>

                       <div className="absolute right-0 flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 gap-1.5 shadow-md">
                          Start <ArrowRight size={10} />
                       </div>
                    </div>
                 </div>
              </div>
              );
            })}
          </div>
         ) : (
           <div className="h-64 bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-4 shadow-sm">
              <AlertCircle size={40} className="text-gray-300" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">No quizzes available.</p>
           </div>
         )}
      </div>
    </div>
  );
}
