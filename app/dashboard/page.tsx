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
import CourseCard from "@/components/dashboard/CourseCard";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
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
        const statsRes = await fetch("/api/dashboard/stats");
        if (statsRes.ok) {
           const stats = await statsRes.json();
           setStatsData(stats);
        }

        const courseRes = await fetch("/api/courses?featured=true");
        let courses = await courseRes.json();
        
        if (courses.length === 0) {
           const allCourseRes = await fetch("/api/courses");
           courses = await allCourseRes.json();
        }
        setRecentCourses(courses.slice(0, 3));
        
        const activityRes = await fetch("/api/dashboard/activities");
        if (activityRes.ok) {
           const activityData = await activityRes.json();
           setActivities(activityData);
        }

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
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Zap className="text-blue-600 animate-pulse" size={24} />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Initializing your learning environment...</p>
      </div>
    );
  }

  const summaryCards = [
    { label: "Enrolled Courses", val: statsData?.enrolled || 0, icon: BookOpen, color: "from-blue-500 to-indigo-600" },
    { label: "My Programs", val: statsData?.programs || 0, icon: Target, color: "from-purple-500 to-pink-600" },
    { label: "Avg. Progress", val: statsData?.avgProgress || "0%", icon: BarChart2, color: "from-emerald-500 to-teal-600" },
    { label: "Completed", val: statsData?.completedCourses || 0, icon: CheckCircle, color: "from-orange-500 to-red-600" },
    { label: "Pending Tasks", val: statsData?.pendingTasks || 0, icon: Clock, color: "from-slate-700 to-slate-900" },
  ];

  const quickStats = [
    { label: "Active Days", val: `${statsData?.streak || 0}`, icon: Zap, detail: "Genuine stats", color: "text-orange-500" },
    { label: "Quiz Hours", val: statsData?.timeSpent || "0h", icon: Clock, detail: "Recorded time", color: "text-blue-500" },
    { label: "Certificates", val: statsData?.certs || 0, icon: Award, detail: "Earned credentials", color: "text-amber-500" },
  ];

  const shortcuts = [
    { label: "My Courses", href: "/dashboard/my-courses", icon: BookOpen },
    { label: "My Programs", href: "/dashboard/programs", icon: Target },
    { label: "Certificates", href: "/dashboard/certificates", icon: Award },
    { label: "Settings", href: "/dashboard/settings", icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      
      {/* Personalized Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{session?.user?.name?.split(' ')[0] || "Learner"}</span>! 👋
          </h1>
          <p className="text-gray-500 max-w-lg">
            You've completed <span className="font-semibold text-gray-900">{statsData?.completedLessons || 0}</span> lessons so far. 
            Ready to jump back into your journey?
          </p>
        </div>
        <div className="relative z-10">
          <Link 
            href={recentCourses.length > 0 ? `/dashboard/courses/${recentCourses[0].slug}` : "/dashboard/my-courses"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
          >
            <PlayCircle size={20} />
            Continue Learning
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br text-white shadow-lg", card.color)}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.val}</p>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Stats, Analytics & Recent Courses */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{stat.val}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Section */}
          {statsData?.analytics && (
            <PerformanceAnalytics analytics={statsData.analytics} />
          )}

          {/* Continue Learning / Recent Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
              <Link href="/dashboard/my-courses" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentCourses.map((course) => (
                <CourseCard 
                  key={course._id} 
                  {...course} 
                  id={course.slug} 
                  href={`/dashboard/courses/${course.slug}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Shortcuts */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Shortcuts */}
          <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
            <h3 className="text-lg font-bold mb-6 relative z-10">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {shortcuts.map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5 group"
                >
                  <link.icon size={24} className="mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" /> Community Activity
            </h3>
            <div className="space-y-6">
              {activities.length > 0 ? activities.map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                    {activity.image ? <img src={activity.image} className="w-full h-full rounded-full object-cover" /> : activity.user.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{activity.action}</p>
                    <p className="text-[10px] text-gray-300 font-medium mt-1 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  <Ghost size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No recent activity</p>
                </div>
              )}
            </div>
            <Link href="/dashboard/comments" className="mt-8 w-full py-3 bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
               Discussion Hub
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
