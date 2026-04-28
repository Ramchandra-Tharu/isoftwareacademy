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
  Loader2
} from "lucide-react";
import CourseCard from "@/components/dashboard/CourseCard";
import Link from "next/link";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Courses");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-bold font-serif text-white mb-2">My Courses</h1>
           <p className="text-gray-400">Continue where you left off and master new skills.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search my courses..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#EBBB54]/50 transition-all"
              />
           </div>
           
           <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
              <Filter size={18} />
           </button>
           
           <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
              <button className="p-1.5 bg-[#EBBB54] text-black rounded-lg shadow-lg">
                 <Grid size={16} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white">
                 <List size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* Categories / Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
         {["All Courses", "In Progress", "Completed", "Wishlist", "Archived"].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
               activeTab === tab 
                ? "bg-[#EBBB54] text-black border-[#EBBB44] shadow-[0_0_15px_rgba(235,187,84,0.3)]" 
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
         {loading ? (
           <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
              <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
              <p className="font-medium animate-pulse">Loading your curriculum...</p>
           </div>
         ) : courses.length > 0 ? (
           courses.map((course) => (
             <CourseCard key={course._id} {...course} id={course.slug} />
           ))
         ) : (
           <div className="col-span-full h-64 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-2">
              <BookOpen size={40} className="opacity-20" />
              <p>No courses found. Try browsing the catalog!</p>
           </div>
         )}
         
         {/* Browse More Card */}
         <Link 
           href="/dashboard/browse" 
           className="group border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-10 hover:border-[#EBBB54]/40 hover:bg-[#EBBB54]/5 transition-all duration-300 min-h-[350px]"
         >
            <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#EBBB54]/10 flex items-center justify-center text-gray-400 group-hover:text-[#EBBB54] transition-all mb-4">
               <BookOpen size={30} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Explore Catalog</h3>
            <p className="text-gray-500 text-center text-sm max-w-[200px]">Find your next course and level up your skills.</p>
            <div className="mt-6 px-6 py-2 bg-white/5 group-hover:bg-[#EBBB54] text-white group-hover:text-black font-bold rounded-xl transition-all border border-white/10 group-hover:border-transparent">
               Browse All
            </div>
         </Link>
      </div>
    </div>
  );
}
