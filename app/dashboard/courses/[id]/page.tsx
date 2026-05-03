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
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>({ completedLessons: [], percentage: 0 });
  const [activeTab, setActiveTab] = useState<"chapters" | "leaderboard" | "about">("chapters");

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

  if (!course) return <div className="flex h-screen items-center justify-center uppercase font-black tracking-widest text-xs text-gray-300">Registry_Entry_Missing</div>;

  return (
    <div className="min-h-screen bg-white font-sans p-6 lg:p-12">
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
                    { icon: BookOpen, label: `${course.totalLessons || course.lessons?.length || 0} Chapters` },
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
                    {course.lessons?.map((lesson: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => setActiveLesson(lesson)}
                        className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between hover:border-blue-200 transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-600/5"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-gray-100 group-hover:text-blue-600/20 transition-colors tracking-tighter">0{i + 1}</span>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase">{lesson.title}</h4>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{lesson.duration || "15m"}</p>
                          </div>
                        </div>
                        <PlayCircle size={20} className="text-gray-200 group-hover:text-blue-600 transition-colors shrink-0" />
                      </div>
                    ))}
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
