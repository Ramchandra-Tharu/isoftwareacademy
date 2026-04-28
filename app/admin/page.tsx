"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Plus,
  ArrowLeft,
  BarChart3,
  Loader2,
  ShieldAlert,
  Activity,
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
          if (res.ok) {
            const data = await res.json();
            setAdminData(data);
          }
        } catch (error) {
          console.error("Failed to fetch admin stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdminStats();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4 font-mono">
        <Cpu className="animate-pulse text-[#EBBB54]" size={48} />
        <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">Initializing Administrative Node...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  return (
    <div className="space-y-10 pb-12 font-mono">
      {/* 1. TOP HEADER - COMMAND CENTER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded uppercase">Live</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                MISSION <span className="text-[#EBBB54]">CONTROL</span>
              </h1>
           </div>
           <p className="text-gray-500 text-sm max-w-xl">
             Node: <span className="text-white">Admin-HQ-01</span> | Session: <span className="text-white truncate max-w-[100px] inline-block align-bottom">{session?.user?.id}</span> | Status: <span className="text-green-500">OPTIMAL</span>
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              <span className="text-xs font-bold text-gray-400">DB CONNECTED</span>
           </div>
           <button className="px-6 py-3 bg-[#EBBB54] text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#EBBB54]/10 flex items-center gap-2">
             <Plus size={18} />
             <span>NEW_ASSET</span>
           </button>
        </div>
      </div>

      {/* 2. CORE METRICS - GRID 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: adminData?.totalStudents || "0", icon: Users, color: "text-blue-500" },
          { label: "Total Courses", val: adminData?.totalCourses || "0", icon: BookOpen, color: "text-[#EBBB54]" },
          { label: "Total Programs", val: adminData?.totalPrograms || "0", icon: BarChart3, color: "text-green-500" },
          { label: "Total Certificates", val: adminData?.totalCertificates || "0", icon: Award, color: "text-purple-500" },
        ].map((item, i) => (
          <div key={i} className="bg-black border border-white/5 p-6 hover:border-white/20 transition-all group relative">
             <div className="flex items-center justify-between mb-4">
                <item.icon className={item.color} size={24} />
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">LIVE_METRIC</span>
             </div>
             <h3 className="text-3xl font-black text-white group-hover:text-[#EBBB54] transition-colors">{item.val}</h3>
             <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">{item.label}</p>
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 group-hover:bg-[#EBBB54]/50 transition-all"></div>
          </div>
        ))}
      </div>

      {/* 3. BENTO CONTROL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Analytics - 8 cols */}
        <div className="lg:col-span-8 bg-black border border-white/5 p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={150} /></div>
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Activity className="text-[#EBBB54]" /> SYSTEM_LOAD
              </h3>
              <div className="flex gap-2">
                 <div className="w-8 h-8 bg-white/5 rounded border border-white/5 flex items-center justify-center"><BarChart3 size={14} /></div>
                 <div className="w-8 h-8 bg-[#EBBB54]/10 rounded border border-[#EBBB54]/20 flex items-center justify-center text-[#EBBB54]"><Terminal size={14} /></div>
              </div>
           </div>
           
           <div className="aspect-[21/9] bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center relative">
              {/* Fake Graph */}
              <div className="flex items-end gap-1 h-32">
                 {[30, 45, 60, 40, 80, 95, 70, 50, 40, 60, 85, 90, 100].map((h, i) => (
                   <div key={i} className="w-4 bg-[#EBBB54]/20 border-t border-[#EBBB54]/40 hover:bg-[#EBBB54] transition-all" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="absolute top-4 left-4 text-[10px] text-gray-600">THROUGHPUT: 1.2GB/S</div>
           </div>
        </div>

        {/* Action Logs - 4 cols */}
        <div className="lg:col-span-4 bg-black border border-white/5 p-8 flex flex-col gap-6">
           <h3 className="text-xl font-bold uppercase tracking-tighter">Event_Stream</h3>
           <div className="space-y-6 flex-1">
              {adminData?.recentActivities?.map((act: any) => (
                <div key={act.id} className="border-l-2 border-[#EBBB54]/30 pl-4 py-1">
                   <p className="text-xs text-white font-bold leading-relaxed">
                     {act.user} <span className="text-gray-500 px-1">»</span> {act.action} <span className="text-gray-500 px-1">»</span> {act.target}
                   </p>
                   <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">{act.time}</p>
                </div>
              ))}
           </div>
           <button className="w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              Download_Full_Logs
           </button>
        </div>
      </div>

      {/* 4. SECURITY & SYSTEM STATUS */}
      <div className="p-10 bg-red-600/5 border border-red-600/20 rounded-2xl flex flex-col md:flex-row items-center gap-8">
         <div className="p-4 bg-red-600/10 text-red-600 rounded-full">
            <ShieldAlert size={40} />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-lg font-bold text-red-500 uppercase tracking-tighter">Security_Protocol_Active</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
               Current session is restricted to administrative IP ranges. All modifications to <span className="text-white">COURSE_DB</span> and <span className="text-white">USER_SCHEMA</span> are mirrored to the cold-storage vault.
            </p>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-gray-600 font-black">ENCRYPTION: AES-256</p>
            <p className="text-[10px] text-gray-600 font-black">SSL: VERIFIED</p>
         </div>
      </div>
    </div>
  );
}
