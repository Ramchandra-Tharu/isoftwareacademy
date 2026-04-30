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
  Loader2,
  Zap,
  Target,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function StudentDashboardOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statsData, setStatsData] = useState<any>(null);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch courses
        const courseRes = await fetch("/api/courses?featured=true");
        let courses = await courseRes.json();
        
        // Fallback: If no featured courses, fetch all published courses
        if (courses.length === 0) {
           const allCourseRes = await fetch("/api/courses");
           courses = await allCourseRes.json();
        }

        setRecentCourses(courses.slice(0, 3));
        
        // Fetch real activities
        const activityRes = await fetch("/api/dashboard/activities");
        if (activityRes.ok) {
           const activityData = await activityRes.json();
           setActivities(activityData);
        }

        setStatsData({
           enrolled: courses.length,
           completed: 48, 
           avgScore: "92%", 
           certs: 3 
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Learning Path...</p>
      </div>
    );
  }

  const stats = [
    { label: "Active Courses", val: statsData?.enrolled || 0, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Lessons Done", val: statsData?.completed || 0, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Average Score", val: statsData?.avgScore || "0%", icon: BarChart2, color: "bg-indigo-50 text-indigo-600" },
    { label: "Certificates", val: statsData?.certs || 0, icon: Award, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                 Student Dashboard
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">v2.0.4 Premium</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-none uppercase">
             Good Day, <span className="text-blue-600">{session?.user?.name || "Learner"}</span>.
           </h1>
           <p className="text-gray-500 font-medium">Continue your journey to mastery. You're <span className="text-gray-900 font-black">48% closer</span> to your next certificate.</p>
        </div>
        
        <div className="card-premium p-6 flex items-center gap-6 group cursor-pointer hover:border-blue-100">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Target size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Milestone</p>
              <p className="text-sm font-black text-gray-900 uppercase">React Design Patterns</p>
           </div>
           <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-premium p-8 group">
             <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                   <stat.icon size={22} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                   <TrendingUp size={14} /> +8%
                </div>
             </div>
             <h3 className="text-4xl font-black tracking-tighter text-gray-900">{stat.val}</h3>
             <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Recently Accessed Courses */}
        <div className="xl:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <PlayCircle className="text-blue-600" /> Continue_Learning
              </h2>
              <Link href="/dashboard/my-courses" className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:gap-3 transition-all">
                View Catalog <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentCourses.length > 0 ? recentCourses.map((course) => (
                <div key={course._id} className="card-premium group p-8 flex flex-col h-full relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                      <BookOpen size={120} />
                   </div>
                   <div className="relative z-10 flex-1 flex flex-col space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.category}</span>
                         <span className="text-[10px] font-black text-blue-600 flex items-center gap-1 uppercase tracking-widest"><Clock size={12} /> {course.duration}</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tighter uppercase leading-tight">{course.title}</h3>
                      <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                               <TrendingUp size={16} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-gray-900 uppercase">{course.progress || 0}% Done</p>
                               <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress || 0}%` }} />
                               </div>
                            </div>
                         </div>
                         <Link href={`/dashboard/courses/${course.slug}`} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-blue-600/20">
                            <ArrowRight size={20} />
                         </Link>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="col-span-full h-64 card-premium border-dashed flex flex-col items-center justify-center text-gray-400 gap-4">
                   <Ghost size={48} className="opacity-10" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No active deployments found.</p>
                   <Link href="/courses" className="btn-primary text-xs">Start Your First Course</Link>
                </div>
              )}
           </div>
        </div>

        {/* Community / Social Side Bar */}
        <div className="xl:col-span-4 space-y-8">
           <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
             <MessageSquare className="text-blue-600" /> Community_Sync
           </h2>

           <div className="card-premium p-10 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none"><MessageSquare size={120} /></div>
              
              <div className="space-y-8 relative z-10">
                 {activities.length > 0 ? activities.map((activity, i) => (
                   <div key={activity.id || i} className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden font-black text-lg group-hover:border-blue-100 transition-all shadow-sm shrink-0">
                         {activity.image ? (
                            <img src={activity.image} alt={activity.user} className="w-full h-full object-cover" />
                         ) : (
                            <span className="text-gray-400 group-hover:text-blue-600 uppercase">{activity.user.charAt(0)}</span>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight truncate">{activity.user}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate">{activity.action}</p>
                      </div>
                      <div className="text-right shrink-0">
                         <div className="flex items-center justify-end gap-1 text-[10px] text-blue-600 font-black uppercase tracking-widest">
                            {activity.type === "Comment" ? <MessageSquare size={14}/> : <Sparkles size={14}/>} {activity.points}
                         </div>
                         <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest mt-1">{activity.time}</p>
                      </div>
                   </div>
                 )) : (
                    <div className="py-10 text-center space-y-4">
                       <Ghost size={40} className="mx-auto text-gray-100" />
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Awaiting_Activity</p>
                    </div>
                 )}
              </div>

              <Link href="/dashboard/comments" className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                 Explore Discussion Hub
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
