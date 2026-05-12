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
  const [search, setSearch] = useState("");

  const passedCount = quizzes.filter(q => q.isPassed).length;
  const totalCount = quizzes.length;
  const completionPct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - passedCount;

  const quizStats = [
    { title: "Total Quizzes", value: totalCount, icon: Layers, description: "Curriculum stack" },
    { title: "Average Completion", value: `${completionPct}%`, icon: BarChart, description: "Deployment sync" },
    { title: "Pending Quizzes", value: pendingCount, icon: Clock, description: "Awaiting attempt" },
    { title: "Total Cleared", value: passedCount, icon: CheckCircle, description: "Successful nodes" },
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes");
        const data = await res.json();
        
        if (res.ok && Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setQuizzes([]);
        }
      } catch (err) {
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Quiz_Center</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Measure execution capabilities through scheduled evaluations.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter protocols..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600 transition-all shadow-sm placeholder:text-gray-300"
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
         <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
               <div className="w-1 h-5 bg-blue-600 rounded-full"></div> Available Vectors
            </h3>
         </div>

         {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
               <Loader2 className="animate-spin text-blue-600" size={32} />
               <p className="text-[10px] font-black tracking-widest uppercase">Accessing Quiz Matrix...</p>
            </div>
         ) : filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuizzes.map((quiz) => {
              if (!quiz || !quiz._id) return null;
              return (
                 <div 
                   onClick={() => window.location.href = `/dashboard/quiz/${quiz._id}`} 
                   key={quiz._id} 
                   className={`cursor-pointer group bg-white border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col relative
                     ${quiz.isPassed ? 'border-emerald-100 bg-emerald-50/10 hover:border-emerald-300 hover:shadow-emerald-600/10' : 'border-gray-100 hover:shadow-blue-600/10 hover:-translate-y-1 hover:border-blue-300'}`}
                 >
                 
                 {/* Pass Overlay Indicator */}
                 {quiz.isPassed && (
                   <div className="absolute top-3 right-3 z-30 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircle size={10} /> Passed
                   </div>
                 )}

                 <div className="h-28 overflow-hidden relative bg-gray-50 flex items-center justify-center border-b border-gray-50">
                    <img 
                       src={quiz.image || "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"} 
                       alt={quiz.title} 
                       className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[30%] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm border border-gray-100">
                       <div className={`w-1.5 h-1.5 rounded-full ${quiz.difficulty === 'Easy' ? 'bg-emerald-500' : quiz.difficulty === 'Hard' ? 'bg-red-500' : 'bg-amber-500'}`} />
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">{quiz.difficulty}</span>
                    </div>
                 </div>

                 <div className="p-5 flex-1 flex flex-col space-y-3">
                    <div>
                       <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-0.5">{quiz.courseId?.title || "Module"}</p>
                       <h4 className="text-[14px] font-black text-gray-900 leading-tight transition-colors line-clamp-1">{quiz.title}</h4>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between relative overflow-hidden min-h-[2.5rem]">
                       <div className="flex items-center gap-4 transition-transform duration-300 group-hover:-translate-x-2">
                          <div className="flex items-center gap-1 text-gray-400">
                             <Clock size={11} />
                             <span className="text-[10px] font-bold text-gray-500">{quiz.duration}</span>
                          </div>
                          {quiz.isPassed ? (
                             <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px]">
                                <Award size={11} /> {quiz.bestScore}%
                             </div>
                          ) : (
                             <div className="flex items-center gap-1 text-gray-400">
                                <HelpCircle size={11} />
                                <span className="text-[10px] font-bold text-gray-500">{quiz.questions?.length || 0} Qs</span>
                             </div>
                          )}
                       </div>

                       <div className={`absolute right-0 flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 gap-1.5 shadow-md
                         ${quiz.isPassed ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white'}`}>
                          {quiz.isPassed ? 'Retake' : 'Launch'} <ArrowRight size={10} />
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
