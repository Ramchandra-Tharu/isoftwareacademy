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
  Loader2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export default function ProgressTrackingPage() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper because of constant issues
  const TRENDING_UP = TrendingUp;
  const CLOCK = Clock;
  const BOOK_OPEN = BookOpen;
  const AWARD = Award;

  const totalFinished = progressData.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);

  const learningStats = [
    { title: "Learning Streak", value: "12 Days", icon: TRENDING_UP, description: "consistent learning", trend: "Hot!", trendType: "positive" },
    { title: "Total Time", value: "84.5h", icon: CLOCK, description: "spent learning", trend: "+12h", trendType: "positive" },
    { title: "Modules Finished", value: totalFinished, icon: BOOK_OPEN, description: "across all courses", trend: "On track", trendType: "positive" },
    { title: "Achievements", value: 15, icon: AWARD, description: "points & badges", trend: "Level 4", trendType: "positive" },
  ] as const;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        setProgressData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div>
         <h1 className="text-4xl font-bold font-serif text-white mb-2">Learning Analytics</h1>
         <p className="text-gray-400">Track your journey, milestones, and daily progress.</p>
      </div>

      {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {learningStats.map((stat, i) => (
           <StatsCard key={i} {...stat} />
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Weekly Activity Chart Mockup */}
        <div className="xl:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
                 <p className="text-xs text-gray-500 mt-1">Daily learning hours (last 7 days)</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400">
                 <Calendar size={14} /> Last 7 Days
              </div>
           </div>

           <div className="h-64 flex items-end justify-between gap-4 px-4">
              {[4, 6, 3, 8, 5, 7, 2].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                   <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden transition-all group-hover:bg-[#EBBB54]/20" style={{ height: `${height * 10}%` }}>
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#EBBB54] to-[#f5d085] opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: "100%" }}></div>
                   </div>
                   <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] border border-[#EBBB54]/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
              <Target size={200} />
           </div>
           
           <h3 className="text-xl font-bold text-white relative z-10 flex items-center gap-3">
             <Target className="text-[#EBBB54]" size={20} /> Current Goals
           </h3>

           <div className="space-y-6 relative z-10">
              {[
                { title: "React Mastery", progress: 85, color: "#EBBB54" },
                { title: "Daily Coding", progress: 60, color: "#4ade80" },
                { title: "Quiz Champ", progress: 40, color: "#60a5fa" }
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-400">{goal.title}</span>
                      <span className="text-white">{goal.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full py-4 bg-[#EBBB54] text-black font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-sm mt-4 flex items-center justify-center gap-2">
              <Zap size={16} /> Set New Goal
           </button>
        </div>
      </div>

      {/* Progress by Course */}
      <div className="space-y-6">
         <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="text-[#EBBB54]" /> Course Milestone Breakdown
         </h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full h-32 flex items-center justify-center">
                 <Loader2 className="animate-spin text-[#EBBB54]" />
              </div>
            ) : progressData.length > 0 ? (
              progressData.map((item, i) => (
                <Link key={i} href={`/dashboard/courses/${item.courseId?.slug || ''}`} className="flex items-center justify-between p-6 bg-[#1a1a1a] border border-white/5 rounded-3xl hover:border-white/10 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#EBBB54] group-hover:scale-110 transition-transform">
                         <BookOpen size={20} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white">{item.courseId?.title || "Course"}</h4>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">{item.courseId?.totalLessons || 0} total lessons</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="text-sm font-bold text-white">{item.percentage || 0}%</p>
                         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">progress</p>
                      </div>
                      <ChevronRight className="text-gray-700 group-hover:text-[#EBBB54] transition-colors" size={20} />
                   </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full h-32 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-gray-600 italic">
                 No progress data found yet. Start learning to see analytics!
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
