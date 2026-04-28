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
import Link from "next/link";

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
    { title: "Quizzes Attempted", value: 24, icon: HELP_CIRCLE, description: "total quizzes", trend: "+4", trendType: "positive" },
    { title: "Average Score", value: "88%", icon: TARGET, description: "across all modules", trend: "Top Tier", trendType: "positive" },
    { title: "Fastest Time", value: "4m 12s", icon: ZAP, description: "Next.js Basics", trend: "Record!", trendType: "positive" },
    { title: "Pass Rate", value: "95%", icon: CHECK_CIRCLE, description: "successful attempts", trend: "Excellent", trendType: "positive" },
  ] as const;

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
           <h1 className="text-4xl font-bold font-serif text-white mb-2">Quiz Center</h1>
           <p className="text-gray-400">Test your knowledge and earn exclusive badges.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search quizzes..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#EBBB54]/50 transition-all"
              />
           </div>
           <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
              <Filter size={18} />
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
      <div className="space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
               <Layers className="text-[#EBBB54]" /> Available Assessments
            </h3>
         </div>

         {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
               <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
               <p>Loading assessment center...</p>
            </div>
         ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {quizzes.map((quiz) => {
              if (!quiz || !quiz._id) return null;
              return (
                <div key={quiz._id} className="group bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#EBBB54]/30 hover:bg-[#222222] transition-all duration-300 flex flex-col">
                 <div className="h-40 overflow-hidden relative">
                    <img src={quiz.image || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60"} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-white/10 backdrop-blur-md">
                       {quiz.difficulty}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                 </div>

                 <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                       <h4 className="text-lg font-bold text-white group-hover:text-[#EBBB54] transition-colors">{quiz.title}</h4>
                       <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1.5"><HelpCircle size={14} /> {quiz.questions?.length || 0} Qs</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.duration}</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#EBBB54]">
                             <Award size={16} />
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold max-w-[80px] leading-tight">Reward Unlockable</span>
                       </div>
                       
                       <Link href={`/dashboard/quiz/${quiz._id}`} className="px-4 py-2 bg-[#EBBB54] text-black rounded-xl text-xs font-bold hover:scale-105 transition-all flex items-center gap-2">
                          Start Assessment <ArrowRight size={14} />
                       </Link>
                    </div>
                 </div>
              </div>
              );
            })}
          </div>
         ) : (
           <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-4">
              <AlertCircle size={40} className="opacity-20" />
              <p>No quizzes available for your current modules.</p>
           </div>
         )}
      </div>
    </div>
  );
}
