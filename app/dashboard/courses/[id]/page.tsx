"use client";

import React, { useEffect, useState } from "react";
import { 
  ChevronLeft, 
  Menu, 
  Layout, 
  BookOpen, 
  CheckCircle, 
  PlayCircle, 
  MessageCircle, 
  HelpCircle,
  MoreVertical,
  Settings,
  Clock,
  Award,
  Loader2,
  Zap,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import ContentSection from "@/components/dashboard/ContentSection";
import CommentSection from "@/components/dashboard/CommentSection";
import { useParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CourseViewerPage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>({ completedLessons: [], percentage: 0 });

  const fetchProgress = async (courseId: string) => {
    try {
      const res = await fetch(`/api/progress?courseId=${courseId}`);
      if (res.ok) setProgress(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await fetch(`/api/courses?slug=${params.id}`);
        const courses = await courseRes.json();
        const foundCourse = courses.find((c: any) => c.slug === params.id);
        if (foundCourse) {
          setCourse(foundCourse);
          const lessonsRes = await fetch(`/api/lessons?courseId=${foundCourse._id}`);
          const lessons = await lessonsRes.json();
          foundCourse.lessons = lessons;
          if (lessons.length > 0) setActiveLesson(lessons[0]);
          await fetchProgress(foundCourse._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCourseData();
  }, [params.id]);

  const handleToggleComplete = async (lessonId: string) => {
    if (!course?._id) return;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id, lessonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-400 font-black uppercase tracking-widest text-xs">
        System_Error: Course_Not_Found
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden font-sans">
      {/* Curriculum Sidebar */}
      <aside className="w-full lg:w-[26rem] border-r border-gray-100 bg-gray-50/50 flex flex-col h-screen overflow-hidden">
        <div className="p-10 space-y-8 border-b border-gray-100 bg-white">
           <Link href="/dashboard/my-courses" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back_To_Catalog
           </Link>
           
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-tight">{course.title}</h2>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                 <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.lessons?.length || 0} Units</span>
                 <span className="flex items-center gap-1.5 text-blue-600"><Award size={14} /> Certificate Verified</span>
              </div>
           </div>
  
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-600">
                 <span>Mastery Progress</span>
                 <span>{progress.percentage || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                 <div 
                   className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progress.percentage || 0}%` }}
                 ></div>
              </div>
           </div>
        </div>
  
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
           <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-gray-400 font-black mb-4">Registry_Manifest</div>
           {course.lessons?.map((lesson: any) => {
             const isCompleted = progress.completedLessons.includes(lesson._id);
             const isActive = activeLesson?._id === lesson._id;
             return (
              <button 
                key={lesson._id} 
                onClick={() => setActiveLesson(lesson)}
                className={cn(
                  "w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all group border",
                  isActive 
                    ? "bg-white border-blue-100 shadow-xl shadow-blue-600/5" 
                    : "bg-transparent border-transparent text-gray-400 hover:bg-white hover:text-gray-900"
                )}
              >
                 <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                    isActive ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : 
                    isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    "bg-gray-100 border-gray-100 text-gray-400 group-hover:bg-white group-hover:border-gray-200"
                 )}>
                    {isCompleted ? <CheckCircle size={18} /> : isActive ? <PlayCircle size={18} /> : <span className="text-xs font-black">{lesson.order}</span>}
                 </div>
                 
                 <div className="flex-1 text-left space-y-0.5">
                    <p className={cn(
                      "text-sm font-black uppercase tracking-tight truncate",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )}>{lesson.title}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1.5"><Clock size={12} /> {lesson.duration}</p>
                 </div>
              </button>
             );
           })}
        </nav>
      </aside>
  
      {/* Content Viewer */}
      <main className="flex-1 bg-white overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-10 lg:px-20 py-20 space-y-20">
           {activeLesson ? (
             <ContentSection 
               title={activeLesson.title} 
               blocks={activeLesson.content} 
               duration={activeLesson.duration} 
               isCompleted={progress.completedLessons.includes(activeLesson._id)} 
               onToggleComplete={() => handleToggleComplete(activeLesson._id)}
             />
           ) : (
             <div className="h-96 flex flex-col items-center justify-center text-gray-200 space-y-6">
                <Target size={80} className="opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest italic text-gray-300">Select_Academic_Module_To_Initialize</p>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-gray-100">
              <div className="space-y-10">
                 {activeLesson && <CommentSection courseId={course._id} lessonId={activeLesson._id} />}
              </div>

              <div className="space-y-8">
                 <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 flex items-center gap-3">
                   <HelpCircle className="text-blue-600" size={24} /> Support_Protocols
                 </h3>
                 <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-8 relative overflow-hidden group">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed relative z-10">
                       Stuck on a deployment? Our <span className="text-gray-900 font-black">AI Mentor Core</span> and community expert network are online to troubleshoot in real-time.
                    </p>
                    <div className="space-y-3 relative z-10">
                       <button className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                          <Zap size={16} /> Consult AI Mentor
                       </button>
                       <button className="w-full py-4 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-gray-100 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                          Academic Help Center
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
