"use client";

import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  BarChart2, 
  Award, 
  Clock, 
  PlayCircle, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Ghost,
  Loader2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StudentDashboardOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statsData, setStatsData] = useState<any>(null);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch courses for 'Recently Accessed'
        const courseRes = await fetch("/api/courses?featured=true");
        const courses = await courseRes.json();
        setRecentCourses(courses.slice(0, 3));

        // Fetch user stats (Total enrolled, certs, etc.)
        setStatsData({
           enrolled: courses.length,
           completed: 48, 
           avgScore: "92%", 
           certs: 3 
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { 
      title: "Enrolled Courses", 
      value: statsData?.enrolled || 0, 
      icon: BookOpen, 
      trend: "+2 this month", 
      trendType: "positive", 
      description: "active courses" 
    },
    { 
      title: "Completed Lessons", 
      value: statsData?.completed || 0, 
      icon: CheckCircle, 
      trend: "85%", 
      trendType: "positive", 
      description: "total lessons" 
    },
    { 
      title: "Average Quiz Score", 
      value: statsData?.avgScore || "0%", 
      icon: BarChart2, 
      trend: "High Score", 
      trendType: "positive", 
      description: "across all quizzes" 
    },
    { 
      title: "Earned Certificates", 
      value: statsData?.certs || 0, 
      icon: Award, 
      trend: "Level Up!", 
      trendType: "positive", 
      description: "professional certs" 
    },
  ] as const;

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#EBBB54]" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Initializing your learning environment...</p>
      </div>
    );
  }

  const userName = session?.user?.name?.trim() || "";

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
             Welcome back, <span className="text-[#EBBB54]">
               {userName || "Student"}
             </span>!
           </h1>
           <p className="text-gray-400 text-lg">Next milestone: Master <span className="text-white font-bold underline decoration-[#EBBB54]">Modern React Patterns</span>.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-5 py-3 bg-[#EBBB54]/10 border border-[#EBBB54]/20 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBBB54] flex items-center justify-center text-black font-bold">Lvl 4</div>
              <div className="space-y-1">
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Current Status</p>
                 <p className="text-sm font-bold text-white">Intermediate Learner</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <StatsCard key={i} {...stat} />
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recently Accessed Courses */}
        <div className="xl:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <PlayCircle className="text-[#EBBB54]" /> Recently Accessed
              </h2>
              <Link href="/dashboard/my-courses" className="text-sm text-[#EBBB54] hover:underline flex items-center gap-1 font-bold">
                View all <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentCourses.length > 0 ? recentCourses.map((course) => (
                <div key={course._id} className="group bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 hover:border-[#EBBB54]/30 hover:bg-[#222222] transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <BookOpen size={120} />
                   </div>
                   <div className="relative z-10 space-y-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                         <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">{course.category}</span>
                         <span className="text-[10px] font-bold text-[#EBBB54] flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#EBBB54] transition-colors">{course.title}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#EBBB54]">
                               <TrendingUp size={16} />
                            </div>
                            <span className="text-xs font-bold text-gray-500">{course.progress || 0}% Complete</span>
                         </div>
                         <Link href={`/dashboard/courses/${course.slug}`} className="p-2 bg-[#EBBB54] text-black rounded-lg hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                         </Link>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="col-span-full h-48 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-2">
                   <Ghost size={40} className="opacity-20" />
                   <p>No recent activity. Start your first course today!</p>
                </div>
              )}
           </div>
        </div>

        {/* Community Feed / Quick Activity */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <MessageSquare className="text-[#EBBB54]" /> Community Feed
           </h2>

           <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02]"><MessageSquare size={100} /></div>
              
              <div className="space-y-6 relative z-10">
                 {[
                   { user: "Ramchandra Tharu", action: "Just finished Module 4", time: "2m ago", points: "+50" },
                   { user: "Sandeep Tharu", action: "Replied to your doubt", time: "15m ago", points: "REPLY" },
                   { user: "John Doe", action: "Earned Certification", time: "1h ago", points: "CERT" }
                 ].map((activity, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#EBBB54] font-bold border border-white/10 group-hover:border-[#EBBB54]">
                         {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-white leading-tight">{activity.user}</p>
                         <p className="text-xs text-gray-500">{activity.action}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-[#EBBB54] font-bold">{activity.points}</p>
                         <p className="text-[10px] text-gray-600">{activity.time}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <Link href="/dashboard/comments" className="block w-full py-4 bg-white/5 hover:bg-white/10 text-white text-center font-bold rounded-2xl border border-white/10 transition-all text-sm mt-4">
                 Join the Discussion
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
