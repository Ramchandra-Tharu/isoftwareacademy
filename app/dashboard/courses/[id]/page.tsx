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
  Loader2
} from "lucide-react";
import Link from "next/link";
import ContentSection from "@/components/dashboard/ContentSection";
import CommentSection from "@/components/dashboard/CommentSection";
import { useParams } from "next/navigation";

export default function CourseViewerPage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>({ completedLessons: [], percentage: 0 });

  const fetchProgress = async (courseId: string) => {
    try {
      const res = await fetch(`/api/progress?courseId=${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (err) {
      console.error("Failed to fetch progress", err);
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
          // Fetch lessons for this course
          const lessonsRes = await fetch(`/api/lessons?courseId=${foundCourse._id}`);
          const lessons = await lessonsRes.json();
          foundCourse.lessons = lessons;
          
          if (lessons.length > 0) {
            setActiveLesson(lessons[0]);
          }

          // Fetch real progress
          await fetchProgress(foundCourse._id);
        }
      } catch (err) {
        console.error("Failed to fetch course data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
       fetchCourseData();
    }
  }, [params.id]);

  const handleToggleComplete = async (lessonId: string) => {
    if (!course?._id) return;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          lessonId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        if (data.certificateGenerated) {
          alert("Congratulations! You've earned a certificate for this course!");
        }
      }
    } catch (err) {
      console.error("Error updating progress", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0c0c]">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0c0c] text-white">
        Course not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-[#0c0c0c]">
      {/* Course Sidebar / Lesson Navigator */}
      <aside className="w-full lg:w-96 border-r border-white/5 bg-[#111111] overflow-y-auto h-screen hidden lg:flex flex-col sticky top-0">
        <div className="p-8 space-y-6">
           <Link href="/dashboard/my-courses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#EBBB54] transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to My Courses
           </Link>
           
           <div>
              <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                 <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessons?.length || 0} Lessons</span>
                 <span>•</span>
                 <span className="flex items-center gap-1 text-[#EBBB54]"><Award size={14} /> Certificate included</span>
              </div>
           </div>
 
           <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#EBBB54]">
                 <span>Overall Progress</span>
                 <span>{progress.percentage || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-[#EBBB54] to-[#f5d085] rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progress.percentage || 0}%` }}
                 ></div>
              </div>
           </div>
        </div>
 
        <nav className="flex-1 px-4 space-y-1 pb-10 custom-scrollbar">
           <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-gray-600 font-bold">Curriculum</div>
           {course.lessons?.map((lesson: any) => {
             const isCompleted = progress.completedLessons.includes(lesson._id);
             return (
              <button 
                key={lesson._id} 
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${
                  activeLesson?._id === lesson._id 
                    ? "bg-[#EBBB54]/10 border border-[#EBBB54]/20 text-[#EBBB54]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                 <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                    activeLesson?._id === lesson._id ? "bg-[#EBBB54] border-[#EBBB54] text-black" : 
                    isCompleted ? "bg-green-500/10 border-green-500/20 text-green-500" :
                    "bg-white/5 border-white/5"
                 }`}>
                    {isCompleted ? <CheckCircle size={16} /> : activeLesson?._id === lesson._id ? <PlayCircle size={16} /> : <span className="text-[10px] font-bold">{lesson.order}</span>}
                 </div>
                 
                 <div className="flex-1 text-left">
                    <p className="text-sm font-bold truncate">{lesson.title}</p>
                    <p className="text-[10px] opacity-60 flex items-center gap-1"><Clock size={10} /> {lesson.duration}</p>
                 </div>
              </button>
             );
           })}
        </nav>
      </aside>
 
      {/* Main Lesson Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
           {/* Lesson Navigation Header (Mobile & Sticky) */}
           <div className="lg:hidden flex items-center justify-between mb-8">
              <button className="p-2.5 bg-white/5 text-[#EBBB54] rounded-xl"><Menu size={24} /></button>
              <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{course.title}</h4>
              <button className="p-2.5 bg-white/5 text-gray-400 rounded-xl"><Settings size={24} /></button>
           </div>
 
           {/* Lesson Component */}
           {activeLesson ? (
             <ContentSection 
               title={activeLesson.title} 
               blocks={activeLesson.content} 
               duration={activeLesson.duration} 
               isCompleted={progress.completedLessons.includes(activeLesson._id)} 
               onToggleComplete={() => handleToggleComplete(activeLesson._id)}
             />
           ) : (
             <div className="h-96 flex items-center justify-center text-gray-500 italic">Select a lesson to begin learning.</div>
           )}

           {/* Interactive Footer */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
              <div className="space-y-6">
                 {activeLesson && (
                    <CommentSection courseId={course._id} lessonId={activeLesson._id} />
                 )}
              </div>

              <div className="space-y-6">
                 <h3 className="text-xl font-bold font-serif text-white flex items-center gap-3">
                   <HelpCircle className="text-[#EBBB54]" size={24} /> Learning Assistance
                 </h3>
                 <div className="p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] border border-[#EBBB54]/10 rounded-[2rem] space-y-6 relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#EBBB54]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EBBB54]/10 transition-all duration-700"></div>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                       Stuck on a concept? Our AI Mentor and community experts are here to help you get unstuck in seconds.
                    </p>
                    <div className="space-y-3 relative z-10">
                       <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#EBBB54] text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(235,187,84,0.3)]">
                          Ask AI Mentor
                       </button>
                       <button className="w-full py-3.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                          Help Center
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
