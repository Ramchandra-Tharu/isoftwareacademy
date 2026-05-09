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
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

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
    if (activeLesson && course?._id) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Auto-initialize progress for this course when a lesson is viewed
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id, action: "view" }),
      }).catch(err => console.error("Auto-progress init failed", err));
    }
  }, [activeLesson, course?._id]);

  useEffect(() => {
    if (selectedChapter && course?.lessons) {
      const chapterLessons = course.lessons.filter((l: any) => (l.moduleName || "General") === selectedChapter);
      if (chapterLessons.length > 0) {
        setExpandedTopics({ [chapterLessons[0]._id]: true });
      }
    }
  }, [selectedChapter, course?.lessons]);

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
                quiz={activeLesson.quiz}
              />
            </div>
          </div>
        ) : (
          /* Course Overview Header - Matching Reference Image Exactly */
          <div className="space-y-16 animate-in fade-in duration-700">

            <div className="bg-white border border-[#d6f0ff] rounded-[2.5rem] p-8 md:p-10 shadow-[0_12px_40px_-12px_rgba(214,240,255,0.35)] flex flex-col md:flex-row gap-8 items-stretch">
              {/* Large Highly-Rounded Thumbnail on Left */}
              <div className="w-full md:w-[320px] aspect-square rounded-[2rem] overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>

              {/* Info Section on Right */}
              <div className="flex-1 flex flex-col justify-between py-1 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructor: {course.instructorName || "Academy Team"}</p>
                </div>

                {/* Two-Column Details Grid with Vertical Separator */}
                <div className="flex flex-row items-center gap-8 md:gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <BookOpen size={18} className="text-slate-800 shrink-0" />
                      <span className="text-sm font-semibold tracking-tight">{course.totalChapters || Object.keys(groupedLessons || {}).length || 0} Chapters</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Users size={18} className="text-slate-800 shrink-0" />
                      <span className="text-sm font-semibold tracking-tight">{course.enrolledCount || 8589} Students Enrolled</span>
                    </div>
                  </div>

                  {/* Subtle Vertical Divider Line */}
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <BarChart size={18} className="text-slate-800 shrink-0" />
                      <span className="text-sm font-semibold tracking-tight">{course.difficulty || "Intermediate"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <FileText size={18} className="text-slate-800 shrink-0" />
                      <span className="text-sm font-semibold tracking-tight">{course.totalLessons * 3 || 133} Resources</span>
                    </div>
                  </div>
                </div>

                {/* Progress-integrated Resume Course Button */}
                <div 
                  onClick={() => setActiveTab("chapters")}
                  className="w-full relative border border-[#d6f0ff] rounded-2xl px-6 py-4 bg-gradient-to-r from-white to-[#f0f9ff] flex justify-between items-center overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 text-[#1A4B6B] font-bold text-sm">
                    <span>Resume Course</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="text-slate-500 text-sm font-semibold">
                    {progress?.percentage || 0}% complete
                  </div>
                  {/* Dark Blue Progress Bar at the absolute bottom */}
                  <div 
                    className="absolute bottom-0 left-0 h-[4px] bg-[#1A4B6B] transition-all duration-500" 
                    style={{ width: `${progress?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tabs & Tab Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 bg-[#f2f8fc] p-1.5 rounded-2xl border border-[#d6f0ff]/40 w-fit">
                {["chapters", "leaderboard", "about"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                      activeTab === tab 
                        ? "bg-white text-[#0F172A] shadow-[0_4px_12px_rgba(214,240,255,0.4)] border border-[#d6f0ff] font-extrabold" 
                        : "text-slate-500 hover:text-slate-800 font-semibold"
                    )}
                  >
                    {tab === "chapters" ? "Chapters" : tab === "leaderboard" ? "Leaderboard" : "About"}
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in duration-500">
                {activeTab === "chapters" && (
                  <div className="flex flex-col lg:flex-row gap-12 pb-24 items-start">
                    {/* Left: Chapters List */}
                    <div className="w-full lg:w-[32%] space-y-1.5 shrink-0">
                      {Object.keys(groupedLessons || {}).map((chapterTitle, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedChapter(chapterTitle)}
                          className={cn(
                            "flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 group cursor-pointer border-b border-slate-100/60 pb-4 last:border-b-0",
                            selectedChapter === chapterTitle 
                              ? "bg-[#f0f8ff] text-[#1A4B6B] shadow-[0_4px_20px_-4px_rgba(214,240,255,0.4)]" 
                              : "bg-transparent text-slate-600 hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <h3 className={cn(
                              "text-sm font-bold transition-colors",
                              selectedChapter === chapterTitle ? "text-[#1A4B6B]" : "text-slate-600 group-hover:text-slate-900"
                            )}>{chapterTitle}</h3>
                          </div>
                          {selectedChapter === chapterTitle && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A4B6B] shrink-0">
                              <Clock size={13} />
                              <span>{getChapterDuration(groupedLessons[chapterTitle])}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Right: Topics for Selected Chapter */}
                    <div className="flex-1 w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {selectedChapter ? (
                        <div className="space-y-6">
                          {groupedLessons[selectedChapter].map((lesson: any, i: number) => {
                            const isExpanded = !!expandedTopics[lesson._id];
                            const isCompleted = progress.completedLessons.includes(lesson._id);
                            const completionPercentage = isCompleted ? 100 : 0;
                            const totalCount = (lesson.content?.length || 0) + (lesson.quiz?.length ? 1 : 0);

                            return (
                              <div 
                                key={lesson._id}
                                className="border border-[#d6f0ff] rounded-2xl shadow-[0_6px_24px_-8px_rgba(214,240,255,0.35)] bg-[#f3fafc]/30 overflow-hidden transition-all duration-300"
                              >
                                {/* Topic Card Header */}
                                <div 
                                  onClick={() => {
                                    setActiveLesson(lesson);
                                  }}
                                  className="p-5 md:p-6 cursor-pointer flex justify-between items-center select-none hover:bg-[#f0f8ff]/40 transition-colors"
                                >
                                  <div className="space-y-2 flex-1 pr-4">
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1",
                                        isCompleted 
                                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                          : "bg-[#f0f8ff] text-[#1A4B6B] border border-sky-100"
                                      )}>
                                        TOPIC {i + 1} • {completionPercentage}% Completed
                                        {isCompleted && <CheckCircle size={10} className="fill-emerald-600 text-white" />}
                                      </span>
                                    </div>
                                    <h4 className="text-lg md:text-xl font-extrabold text-[#0F172A] tracking-tight">
                                      {lesson.title}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0">
                                    {/* Resources Badge */}
                                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm bg-white px-3 py-1.5 rounded-xl border border-sky-100/60 shadow-sm">
                                      <FileText size={15} className="text-slate-600" />
                                      <span>{totalCount}</span>
                                    </div>

                                    {/* Chevron */}
                                    <div 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedTopics(prev => ({ ...prev, [lesson._id]: !prev[lesson._id] }));
                                      }}
                                      className="w-8 h-8 rounded-full bg-white border border-sky-100/60 flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                      {isExpanded ? (
                                        <svg className="w-4 h-4 text-[#1A4B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-[#1A4B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                  <div className="animate-in fade-in duration-200">
                                    {/* Bold Thick Dark Blue Separator Line */}
                                    <div className="h-[4px] bg-[#1A4B6B]" />

                                    <div className="p-6 bg-white divide-y divide-slate-100/80">
                                      {lesson.content && lesson.content.length > 0 ? (
                                        lesson.content.map((block: any, blockIdx: number) => {
                                          return (
                                            <div 
                                              key={blockIdx}
                                              onClick={() => setActiveLesson(lesson)}
                                              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer group"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FileText size={16} className="text-slate-400 group-hover:text-[#1A4B6B] transition-colors shrink-0" />
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                                  {block.caption || `${lesson.title} - Part ${blockIdx + 1}`}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-4 shrink-0">
                                                {isCompleted && (
                                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                    <CheckCircle size={12} className="fill-emerald-600 text-white" />
                                                    Completed On...
                                                  </span>
                                                )}
                                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                                  <Clock size={12} />
                                                  {block.duration || lesson.duration || "00:10:00"}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div 
                                          onClick={() => setActiveLesson(lesson)}
                                          className="py-4 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer group"
                                        >
                                          <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-slate-400 group-hover:text-[#1A4B6B] transition-colors shrink-0" />
                                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                              Video Tutorial & Study Guide
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-4 shrink-0">
                                            {isCompleted && (
                                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                <CheckCircle size={12} className="fill-emerald-600 text-white" />
                                                Completed On...
                                              </span>
                                            )}
                                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                              <Clock size={12} />
                                              {lesson.duration || "00:12:00"}
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {lesson.quiz && lesson.quiz.length > 0 && (
                                        <div 
                                          onClick={() => setActiveLesson(lesson)}
                                          className="py-4 last:pb-0 flex items-center justify-between cursor-pointer group"
                                        >
                                          <div className="flex items-center gap-3">
                                            <Award size={16} className="text-slate-400 group-hover:text-[#1A4B6B] transition-colors shrink-0" />
                                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                              Lesson Concept Quiz
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-4 shrink-0">
                                            {isCompleted && (
                                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                <CheckCircle size={12} className="fill-emerald-600 text-white" />
                                                Passed
                                              </span>
                                            )}
                                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                              <Clock size={12} />
                                              00:05:00
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.4em] text-[10px] italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          Awaiting Chapter Selection...
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
