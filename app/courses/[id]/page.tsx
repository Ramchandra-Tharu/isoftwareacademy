"use client";

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Star,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart,
  FileText
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PublicCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"chapters" | "leaderboard" | "about">("chapters");

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        if (session) {
           const enrollRes = await fetch(`/api/enrollments/check?itemId=${data._id}`);
           if (enrollRes.ok) {
              const enrollData = await enrollRes.json();
              setIsEnrolled(enrollData.isEnrolled);
           }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing_Catalog_Data...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center uppercase font-black tracking-widest text-xs">Registry_Entry_Not_Found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900 font-sans pb-32">
      {/* Navigation Header */}
      <nav className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
             <Star size={18} fill="currentColor" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
        </Link>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all flex items-center gap-2">
           <ArrowRight size={14} className="rotate-180" /> Back_To_Grid
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pt-16 lg:pt-24 space-y-20">
         {/* Hero Section - Matching Reference Image */}
         <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left: Large Thumbnail */}
            <div className="w-full lg:w-[55%] aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-600/10 border border-gray-100 group">
               <img 
                 src={course.thumbnail} 
                 alt={course.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               />
            </div>

            {/* Right: Course Core Details */}
            <div className="w-full lg:w-[45%] space-y-10">
               <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tighter uppercase">
                  {course.title}
               </h1>

               {/* Metadata Grid */}
               <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><BookOpen size={24} /></div>
                     <div>
                        <p className="text-lg font-black text-gray-900">{course.lessons?.length || 0} Chapters</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><BarChart size={24} /></div>
                     <div>
                        <p className="text-lg font-black text-gray-900">{course.difficulty || "Intermediate"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><Users size={24} /></div>
                     <div>
                        <p className="text-lg font-black text-gray-900">{course.enrolledCount || 0} Students</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><FileText size={24} /></div>
                     <div>
                        <p className="text-lg font-black text-gray-900">160 Resources</p>
                     </div>
                  </div>
               </div>

               {/* Primary Action */}
               <div className="pt-4">
                  {isEnrolled ? (
                    <Link href={`/dashboard/courses/${course.slug || course._id}`} className="w-full flex items-center justify-center gap-4 py-6 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 uppercase text-xs tracking-[0.2em]">
                       <PlayCircle size={24} /> Resume_Course
                    </Link>
                  ) : (
                    <Link href={`/dashboard/courses/${course.slug || course._id}`} className="w-full flex items-center justify-center gap-4 py-6 bg-[#004e64] text-white font-black rounded-[1.5rem] hover:bg-[#003d4f] transition-all shadow-2xl shadow-[#004e64]/30 uppercase text-xs tracking-[0.2em]">
                       Start Course <ArrowRight size={24} />
                    </Link>
                  )}
               </div>
            </div>
         </div>

         {/* Tabbed Navigation */}
         <div className="space-y-12">
            <div className="flex items-center gap-8 bg-gray-50/50 p-2.5 rounded-[1.5rem] border border-gray-100 w-fit">
               {[
                 { id: "chapters", label: "Chapters" },
                 { id: "leaderboard", label: "Leaderboard" },
                 { id: "about", label: "About" }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={cn(
                     "px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                     activeTab === tab.id ? "bg-white text-gray-900 shadow-xl border border-gray-100" : "text-gray-400 hover:text-gray-600"
                   )}
                 >
                    {tab.label}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-500">
               {activeTab === "chapters" && (
                 <div className="grid md:grid-cols-2 gap-8">
                    {course.lessons?.map((lesson: any, i: number) => (
                      <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-between hover:border-blue-200 transition-all group shadow-sm hover:shadow-xl hover:shadow-blue-600/5">
                         <div className="flex items-center gap-8">
                            <span className="text-4xl font-black text-gray-100 group-hover:text-blue-600/20 transition-colors tracking-tighter">0{i+1}</span>
                            <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{lesson.title}</h4>
                         </div>
                         <PlayCircle size={28} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                      </div>
                    ))}
                 </div>
               )}
               {activeTab === "about" && (
                 <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm text-gray-500 text-lg leading-relaxed font-medium max-w-4xl">
                    {course.description}
                 </div>
               )}
               {activeTab === "leaderboard" && (
                 <div className="h-64 flex flex-col items-center justify-center text-gray-200 italic font-black uppercase tracking-widest text-xs bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    Leaderboard_Registry_Initializing...
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
