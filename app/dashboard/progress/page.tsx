"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Award, 
  Calendar,
  ChevronRight,
  Target,
  Zap,
  BarChart3,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProgressTrackingPage() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalFinished = progressData.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);

  const learningStats = [
    { title: "Learning Streak", value: "12 Days", icon: TrendingUp, description: "consistent sync", trend: "Hot!", trendType: "positive" },
    { title: "Engagement Time", value: "84.5h", icon: Clock, description: "total uptime", trend: "+12h", trendType: "positive" },
    { title: "Units Finished", value: totalFinished, icon: BookOpen, description: "deployed modules", trend: "On track", trendType: "positive" },
    { title: "Achievements", value: 15, icon: Award, description: "milestones hit", trend: "Level 4", trendType: "positive" },
  ] as const;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        setProgressData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aggregating Learning Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Learning_Analytics</h1>
           <p className="text-gray-500 font-medium mt-1">Real-time performance telemetry and academic milestone tracking.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
           <Sparkles size={14} /> Data Accuracy 100%
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {learningStats.map((stat, i) => (
           <StatsCard key={i} {...stat} />
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Weekly Activity Chart */}
        <div className="xl:col-span-8 card-premium p-10 space-y-10">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Activity_Stream</h3>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">DAILY_ENGAGEMENT_HOURS</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400">
                 <Calendar size={14} /> Last 7 Days
              </div>
           </div>

           <div className="h-64 flex items-end justify-between gap-6 px-4">
              {[4, 6, 3, 8, 5, 7, 2].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-5 group">
                   <div className="w-full bg-gray-50 rounded-2xl relative overflow-hidden transition-all group-hover:bg-blue-50 border border-gray-100/50" style={{ height: `100%` }}>
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-2xl transition-all duration-1000 group-hover:scale-y-105" 
                        style={{ height: `${height * 10}%` }} 
                      />
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Learning Goals */}
        <div className="xl:col-span-4 card-premium p-10 space-y-10 bg-white border border-gray-100 relative overflow-hidden group shadow-xl shadow-blue-600/5">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Target size={200} />
           </div>
           
           <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 relative z-10 text-gray-900">
             <Target className="text-blue-600" size={24} /> Goal_Stack
           </h3>

           <div className="space-y-8 relative z-10">
              {[
                { title: "React Mastery", progress: 85, color: "bg-blue-600" },
                { title: "Daily Coding", progress: 60, color: "bg-emerald-500" },
                { title: "Quiz Champ", progress: 40, color: "bg-amber-500" }
              ].map((goal, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>{goal.title}</span>
                      <span className="text-gray-900">{goal.progress}%</span>
                   </div>
                   <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", goal.color)}
                        style={{ width: `${goal.progress}%` }}
                      />
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10">
              <Zap size={16} /> Update Objectives
           </button>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="space-y-8">
         <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Milestone_Breakdown
         </h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressData.length > 0 ? (
              progressData.map((item, i) => (
                <Link key={i} href={`/dashboard/courses/${item.courseId?.slug || ''}`} className="flex items-center justify-between p-8 card-premium hover:border-blue-100 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
                         <BookOpen size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">{item.courseId?.title || "Module"}</h4>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.courseId?.totalLessons || 0} Segment Uptime</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <p className="text-xl font-black text-gray-900 tracking-tighter">{item.percentage || 0}%</p>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">DEPLOYED</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                         <ChevronRight size={20} />
                      </div>
                   </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full h-48 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 gap-4">
                 <BarChart3 size={60} className="opacity-10" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No Telemetry Detected</p>
                 <Link href="/dashboard/my-courses" className="text-blue-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">Start Engagement <ArrowRight size={14}/></Link>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
