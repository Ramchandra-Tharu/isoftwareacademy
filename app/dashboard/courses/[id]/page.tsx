"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Clock,
  Award,
  Loader2,
  ArrowRight,
  Users,
  BarChart,
  FileText
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
  const topRef = React.useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>({ completedLessons: [], percentage: 0 });
  const [activeTab, setActiveTab] = useState<"chapters" | "leaderboard" | "about">("chapters");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

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
        const courseRes = await fetch(`/api/courses/${params.id}`);
        if (courseRes.ok) {
          const foundCourse = await courseRes.json();
          setCourse(foundCourse);
          const lessonsRes = await fetch(`/api/lessons?courseId=${foundCourse._id}`);
          if (lessonsRes.ok) {
            const lessons = await lessonsRes.json();
            foundCourse.lessons = lessons;
            // Select first chapter by default if none selected
            if (lessons.length > 0) {
              const firstChapter = lessons[0].moduleName || "General";
              setSelectedChapter(firstChapter);
            }
          }
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

  useEffect(() => {
    if (activeLesson) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeLesson]);

  // Group lessons by moduleName
  const groupedLessons = course?.lessons?.reduce((acc: any, lesson: any) => {
    const chapter = lesson.moduleName || "General";
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(lesson);
    return acc;
  }, {});

  // Calculate total duration for a chapter
  const getChapterDuration = (lessons: any[]) => {
    let totalSeconds = 0;
    lessons.forEach(l => {
      const parts = (l.duration || "0:0").split(':');
      if (parts.length === 3) {
        totalSeconds += parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
      } else if (parts.length === 2) {
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    });
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) return `${h}h ${m}m`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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

  const handleNext = () => {
    if (!activeLesson || !course?.lessons) return;
    const currentIndex = course.lessons.findIndex((l: any) => l._id === activeLesson._id);
    if (currentIndex < course.lessons.length - 1) {
      setActiveLesson(course.lessons[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!activeLesson || !course?.lessons) return;
    const currentIndex = course.lessons.findIndex((l: any) => l._id === activeLesson._id);
    if (currentIndex > 0) {
      setActiveLesson(course.lessons[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!course) return <div className="flex h-screen items-center justify-center uppercase font-black tracking-widest text-xs text-gray-300">Registry_Entry_Missing</div>;

  const currentIdx = activeLesson ? course.lessons.findIndex((l: any) => l._id === activeLesson._id) : -1;

  return (
    <div className="min-h-screen bg-white font-sans p-6 lg:p-12">
      <div ref={topRef} className="absolute top-0 left-0 h-0 w-0" />
      <div className="max-w-6xl mx-auto space-y-16">
        {activeLesson ? (
          /* Active Lesson Viewer */
          <div className="animate-in fade-in duration-500 pb-20">
            <button onClick={() => setActiveLesson(null)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all mb-8">
              <ArrowRight size={14} className="rotate-180" /> Back_To_Overview
            </button>
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 lg:p-12 shadow-2xl shadow-blue-600/5">
              <ContentSection
                title={activeLesson.title}
                blocks={activeLesson.content}
                duration={activeLesson.duration}
                isCompleted={progress.completedLessons.includes(activeLesson._id)}
                onToggleComplete={() => handleToggleComplete(activeLesson._id)}
                onNext={currentIdx < course.lessons.length - 1 ? handleNext : undefined}
                onPrevious={currentIdx > 0 ? handlePrevious : undefined}
                nextUnitName={currentIdx < course.lessons.length - 1 ? course.lessons[currentIdx + 1].title : undefined}
                prevUnitName={currentIdx > 0 ? course.lessons[currentIdx - 1].title : undefined}
              />
            </div>
          </div>
        ) : (
          /* Course Overview Header - Matching Reference Image Exactly */
          <div className="space-y-16 animate-in fade-in duration-700">

            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
              {/* Mini Thumbnail */}
              <div className="w-full lg:w-[35%] aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-600/10 border border-gray-100 shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>

              {/* Ultra-Compact Info Section */}
              <div className="flex-1 space-y-4 py-0.5 w-full">
                <div className="space-y-1">
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">
                    {course.title}
                  </h1>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Instructor: {course.instructorName || "Academy Team"}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: BookOpen, label: `${Object.keys(groupedLessons || {}).length} Chapters` },
                    { icon: Clock, label: course.duration || "Self-Paced" },
                    { icon: BarChart, label: course.difficulty || "Intermediate" },
                    { icon: Users, label: `${course.enrolledCount || 0} Enrolled` }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <item.icon size={12} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("chapters")}
                  className="w-full lg:w-fit px-10 py-4 bg-[#004e64] text-white font-black rounded-xl hover:bg-[#003d4f] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-[#004e64]/20"
                >
                  START COURSE <ArrowRight size={8} />
                </button>

              </div>
            </div>

            {/* Tabs & Tab Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 w-fit">
                {["chapters", "leaderboard", "about"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "px-10 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in duration-500">
                {activeTab === "chapters" && (
                  <div className="flex flex-col lg:flex-row gap-12 pb-24 items-start">
                    {/* Left: Chapters List */}
                    <div className="w-full lg:w-[35%] space-y-2 shrink-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 px-2">Navigation_Index</p>
                      {Object.keys(groupedLessons || {}).map((chapterTitle, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedChapter(chapterTitle)}
                          className={cn(
                            "flex items-center justify-between py-3.5 px-5 rounded-xl transition-all group cursor-pointer border border-transparent",
                            selectedChapter === chapterTitle 
                              ? "bg-gray-900 border-gray-900 shadow-xl shadow-gray-900/10" 
                              : "bg-transparent hover:bg-white hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1 h-1 rounded-full transition-colors",
                              selectedChapter === chapterTitle ? "bg-blue-500" : "bg-gray-300 group-hover:bg-gray-600"
                            )} />
                            <h3 className={cn(
                              "text-[11px] font-bold uppercase tracking-wide transition-colors",
                              selectedChapter === chapterTitle ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
                            )}>{chapterTitle}</h3>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className={cn(
                               "text-[9px] font-black uppercase tracking-widest",
                               selectedChapter === chapterTitle ? "text-blue-400" : "text-gray-300"
                             )}>
                               {getChapterDuration(groupedLessons[chapterTitle])}
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: Topics for Selected Chapter */}
                    <div className="flex-1 w-full p-2 lg:p-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      {selectedChapter ? (
                        <div className="space-y-10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-8 h-[1px] bg-blue-600/30"></span>
                              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-600/60">Module_Selection</p>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">{selectedChapter}</h2>
                          </div>
                          
                          <div className="grid gap-1">
                            {groupedLessons[selectedChapter].map((lesson: any, i: number) => (
                              <div 
                                key={i}
                                onClick={() => setActiveLesson(lesson)}
                                className="group flex items-center justify-between p-4 bg-transparent border border-transparent rounded-xl hover:bg-white hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/5 transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="text-xs font-black text-gray-200 group-hover:text-blue-600/30 transition-colors">0{i+1}</span>
                                  <h4 className="text-[12px] font-bold text-gray-600 uppercase tracking-tight group-hover:text-gray-900 transition-colors">{lesson.title}</h4>
                                </div>
                                 <div className="flex items-center gap-4">
                                   <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{lesson.duration || "10:00"}</span>
                                   <div className={cn(
                                     "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                     progress.completedLessons.includes(lesson._id) 
                                       ? "bg-emerald-50 text-emerald-500 shadow-sm" 
                                       : "bg-transparent text-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600"
                                   )}>
                                      {progress.completedLessons.includes(lesson._id) ? <CheckCircle size={16} /> : <PlayCircle size={16} />}
                                   </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-gray-200 font-black uppercase tracking-[0.5em] text-[9px] italic">
                          Awaiting_Module_Selection...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "about" && (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-500 text-sm leading-relaxed font-medium">
                    {course.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
