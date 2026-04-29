"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Plus,
  BarChart3,
  Loader2,
  Activity,
  Cpu,
  Globe,
  ArrowUpRight,
  Search,
  MoreHorizontal,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (status === "authenticated" && session?.user?.role === "admin") {
        try {
          const res = await fetch("/api/admin/stats");
          if (res.ok) setAdminData(await res.json());
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAdminStats();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Ecosystem...</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: adminData?.totalStudents || "0", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Courses", value: adminData?.totalCourses || "0", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
    { label: "Rev Revenue", value: "₹4.2L", icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
    { label: "Certifications", value: adminData?.totalCertificates || "0", icon: Award, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Dashboard_Overview</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Welcome back, {session?.user?.name || "Administrator"}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Optimal</span>
           </div>
           <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2 text-xs">
              <Plus size={16} /> Create Course
           </Link>
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
                   <TrendingUp size={14} /> +12%
                </div>
             </div>
             <h3 className="text-4xl font-black tracking-tighter text-gray-900">{stat.value}</h3>
             <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-8 card-premium p-10 space-y-8 relative overflow-hidden">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="text-xl font-black tracking-tight">Growth_Analytics</h4>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">User Engagement & Enrollment metrics</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-lg">Monthly</button>
                 <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-lg">Yearly</button>
              </div>
           </div>
           
           <div className="h-[300px] w-full flex items-end gap-3 pt-10">
              {[40, 60, 45, 90, 65, 80, 55, 75, 95, 100, 85, 70].map((h, i) => (
                <div key={i} className="flex-1 group/bar relative">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                      Value: {h}%
                   </div>
                   <div 
                     className="w-full bg-blue-100 group-hover/bar:bg-blue-600 rounded-t-lg transition-all duration-500" 
                     style={{ height: `${h}%` }}
                   />
                </div>
              ))}
           </div>
        </div>

        {/* Activity Stream */}
        <div className="lg:col-span-4 card-premium p-10 flex flex-col space-y-8">
           <div className="flex items-center justify-between">
              <h4 className="text-xl font-black tracking-tight">System_Logs</h4>
              <MoreHorizontal size={20} className="text-gray-300 cursor-pointer" />
           </div>
           
           <div className="space-y-8 flex-1">
              {adminData?.recentActivities?.slice(0, 5).map((act: any) => (
                <div key={act.id} className="flex gap-4 group">
                   <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                      <Activity size={16} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                         {act.user} <span className="text-gray-400 font-medium">performed</span> {act.action}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{act.time}</p>
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">
              View All Logs
           </button>
        </div>
      </div>

      {/* Recent Modules / Tables Section */}
      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h4 className="text-xl font-black tracking-tight">Active_Modules</h4>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all" placeholder="Search Assets..." />
               </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Entity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Operations</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {adminData?.recentCourses?.map((course: any) => (
                    <tr key={course._id} className="group hover:bg-gray-50/30 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                <BookOpen size={18} />
                             </div>
                             <span className="text-sm font-bold text-gray-900">{course.title}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-full">
                             {course.category}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                             <span className="text-xs font-bold text-gray-900">Active</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="text-xs font-bold text-blue-600 hover:underline">Manage</button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
