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
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAccessed, setLastAccessed] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/enrollments/my-courses");
        const data = await res.json();
        setCourses(data);
        if (data.length > 0) {
           // Sort by most recently updated/progressed if available, or just take first for now
           setLastAccessed(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "All Courses") return matchesSearch;
    if (activeTab === "In Progress") return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === "Completed") return matchesSearch && course.progress === 100;
    return matchesSearch;
  });

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
      {/* 1. Header & Identity */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                 Command Center
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry_v2.4</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-none uppercase">
             My_Curriculum
           </h1>
           <p className="text-gray-500 font-medium">Synchronizing your active learning modules and skill milestones.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH_CATALOG..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-blue-100 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
              />
           </div>
           
           <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* 2. Resume Operation (Last Accessed) */}
      {lastAccessed && searchQuery === "" && activeTab === "All Courses" && (
         <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link href={`/dashboard/courses/${lastAccessed.slug}`} className="card-premium p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 bg-white border-blue-50 shadow-2xl shadow-blue-600/5">
               <div className="w-full lg:w-72 aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <img src={lastAccessed.thumbnail} alt={lastAccessed.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">RESUME_OPERATION</p>
                     <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">{lastAccessed.title}</h2>
                     <p className="text-sm text-gray-400 font-medium">Continue from where you left off. 8 units remaining in this module.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between min-w-[200px]">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                           <span className="text-[10px] font-black text-blue-600">{lastAccessed.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: `${lastAccessed.progress}%` }} />
                        </div>
                     </div>
                     <div className="btn-primary px-8 py-4 text-xs">
                        Access Module <ArrowRight size={16} className="ml-2" />
                     </div>
                  </div>
               </div>
            </Link>
         </div>
      )}

      {/* 3. Filter Navigation */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-1">
         <div className="flex items-center gap-8">
            {["All Courses", "In Progress", "Completed"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                  activeTab === tab 
                    ? "text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
         </div>
         <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredCourses.length} Modules Found</span>
         </div>
      </div>

      {/* 4. Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
         {filteredCourses.length > 0 ? (
           filteredCourses.map((course) => (
             <CourseCard key={course._id} {...course} id={course.slug} />
           ))
         ) : (
           <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200">
                 <BookOpen size={40} />
              </div>
              <div className="space-y-2">
                 <p className="text-xl font-black text-gray-900 uppercase tracking-tight">No Modules Matched</p>
                 <p className="text-sm text-gray-400 font-medium">Try adjusting your filters or search parameters.</p>
              </div>
           </div>
         )}
         
         {/* Browse More Call to Action */}
         {activeTab === "All Courses" && searchQuery === "" && (
            <Link 
              href="/courses" 
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
         )}
      </div>
    </div>
  );
}
