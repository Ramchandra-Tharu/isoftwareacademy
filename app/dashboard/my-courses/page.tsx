"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  TrendingUp,
  Clock,
  Layout,
  Loader2,
  ArrowRight,
  Plus
} from "lucide-react";
import CourseCard from "@/components/dashboard/CourseCard";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Courses");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/enrollments/my-courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Personal Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">My_Curriculum</h1>
           <p className="text-gray-500 font-medium mt-1">Manage your active learning modules and skill milestones.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH_CATALOG..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-blue-100 shadow-sm shadow-gray-900/5"
              />
           </div>
           
           <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
              <Filter size={20} />
           </button>
           
           <div className="flex items-center p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                 <Grid size={18} />
              </button>
              <button className="p-2 text-gray-300 hover:text-gray-500">
                 <List size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Categories / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
         {["All Courses", "In Progress", "Completed", "Wishlist"].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={cn(
               "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
               activeTab === tab 
                ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20" 
                : "bg-white text-gray-400 border-gray-100 hover:border-blue-100 hover:text-blue-600"
             )}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
         {courses.length > 0 ? (
           courses.map((course) => (
             <CourseCard key={course._id} {...course} id={course.slug} />
           ))
         ) : (
           <div className="col-span-full h-80 card-premium border-dashed flex flex-col items-center justify-center text-gray-400 gap-6">
              <BookOpen size={60} className="opacity-10" />
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest">Registry Empty</p>
                 <p className="text-xs text-gray-400 mt-2">No active course deployments found in this segment.</p>
              </div>
              <Link href="/dashboard/browse" className="btn-primary text-xs">Browse Library</Link>
           </div>
         )}
         
         {/* Browse More Card */}
         <Link 
           href="/dashboard/browse" 
           className="card-premium border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300 min-h-[400px] group"
         >
            <div className="w-20 h-20 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-all mb-8 shadow-sm">
               <Plus size={40} />
            </div>
            <div className="text-center space-y-2">
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Expand_Library</h3>
               <p className="text-xs text-gray-400 font-medium max-w-[220px] mx-auto">Discover new academic modules and accelerate your growth path.</p>
            </div>
            <div className="mt-10 px-8 py-3.5 bg-white border border-gray-100 group-hover:bg-blue-600 text-gray-400 group-hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-blue-600/20">
               Access Catalog
            </div>
         </Link>
      </div>
    </div>
  );
}
