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
   const [allCatalogCourses, setAllCatalogCourses] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("All Courses");
   const [searchQuery, setSearchQuery] = useState("");
   const [lastAccessed, setLastAccessed] = useState<any>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch enrolled courses
            const enrolledRes = await fetch("/api/enrollments/my-courses");
            const enrolledData = await enrolledRes.json();
            setCourses(enrolledData);
            if (enrolledData.length > 0) {
               setLastAccessed(enrolledData[0]);
            }

            // Fetch all available courses for the catalog
            const catalogRes = await fetch("/api/courses");
            const catalogData = await catalogRes.json();
            setAllCatalogCourses(catalogData);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   const filteredCourses = (() => {
      const query = searchQuery.toLowerCase();
      
      // Helper to merge enrollment progress into a catalog course
      const mergeProgress = (catalogList: any[]) => catalogList.map(catCourse => {
         const enrollment = courses.find(e => e.courseId?._id === catCourse._id || e._id === catCourse._id);
         return enrollment ? { ...catCourse, progress: enrollment.progress } : catCourse;
      });

      if (activeTab === "Explore") {
         return mergeProgress(allCatalogCourses).filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.category.toLowerCase().includes(query)
         );
      }
      if (activeTab === "All Courses") {
         return mergeProgress(allCatalogCourses).filter(c => c.title.toLowerCase().includes(query));
      }
      if (activeTab === "In Progress") {
         return courses.filter(c => c.title.toLowerCase().includes(query) && (c.progress || 0) > 0 && (c.progress || 0) < 100);
      }
      if (activeTab === "Completed") {
         return courses.filter(c => c.title.toLowerCase().includes(query) && (c.progress || 0) === 100);
      }
      return [];
   })();

   // Recommendations logic for Explore tab
   const recommendedCourses = allCatalogCourses
      .filter(c => c.featured)
      .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
      .slice(0, 3);

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
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-black text-white text-[9px] font-bold rounded-sm uppercase tracking-[0.2em]">
                     Catalog Access
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Cloud_Registry</span>
               </div>
               <h1 className="text-5xl font-light tracking-tight text-black leading-none">
                  My Courses
               </h1>
               <p className="text-gray-600 font-normal">Synchronizing your active learning modules and skill milestones.</p>
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
               <div className="absolute inset-0 bg-black/5 blur-3xl rounded-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Link href={`/dashboard/courses/${lastAccessed.slug}`} className="border border-gray-200 p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 bg-white rounded-lg hover:border-black transition-all">
                  <div className="w-full lg:w-72 aspect-video rounded-md overflow-hidden transition-all duration-700">
                     <img src={lastAccessed.thumbnail} alt={lastAccessed.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-6">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resume_Operation</p>
                        <h2 className="text-4xl font-light text-black tracking-tight leading-none">{lastAccessed.title}</h2>
                        <p className="text-sm text-gray-500 font-normal">Continue from where you left off. 8 units remaining in this module.</p>
                     </div>

                     <div className="flex flex-wrap items-center gap-8">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between min-w-[200px]">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                              <span className="text-[10px] font-bold text-black">{lastAccessed.progress}%</span>
                           </div>
                           <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-black rounded-full" style={{ width: `${lastAccessed.progress}%` }} />
                           </div>
                        </div>
                        <div className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg">
                           Access Module <ArrowRight size={16} className="ml-2 inline" />
                        </div>
                     </div>
                  </div>
               </Link>
            </div>
         )}

         {/* 3. Filter Navigation */}
         <div className="flex items-center justify-between border-b border-gray-100 pb-1">
            <div className="flex items-center gap-8">
               {["All Courses", "In Progress", "Completed", "Explore"].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                        "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                        activeTab === tab
                           ? "text-black border-b-2 border-black"
                           : "text-gray-400 hover:text-gray-900"
                     )}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            <div className="hidden sm:flex items-center gap-2">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredCourses.length} Modules Found</span>
            </div>
         </div>

         {/* 4. Explore Special View */}
         {activeTab === "Explore" && (
            <div className="space-y-12">
               {/* Recommendations Section */}
               {recommendedCourses.length > 0 && searchQuery === "" && (
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <Sparkles className="text-black" size={18} />
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black">Recommended_Assets</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendedCourses.map(course => (
                           <div key={course._id} className="p-6 border border-gray-200 rounded-lg relative group overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={60} /></div>
                              <div className="space-y-4 relative z-10">
                                 <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-white rounded-full border border-blue-50">Trending Asset</span>
                                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight line-clamp-2">{course.title}</h3>
                                 <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all">
                                    Explore Module <ArrowRight size={14} />
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* 4. Course Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredCourses.length > 0 ? (
               filteredCourses.map((course) => (
                  <CourseCard 
                     key={course._id} 
                     {...course} 
                     instructor={course.instructorName || course.instructor}
                     lessonsCount={course.totalLessons || course.lessonsCount}
                     id={course.slug} 
                     href={course.progress === undefined ? `/courses/${course.slug}` : undefined}
                  />
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
