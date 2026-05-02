"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Globe,
  MoreVertical,
  Layers,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
  Filter,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      if (res.ok) setCourses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching Asset Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-light tracking-tight text-black">Course Management</h1>
          <p className="text-gray-600 font-normal mt-2">Develop and organize your enterprise academic curriculum.</p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary">
          + Create New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Assets", val: courses.length, icon: BookOpen, bg: "bg-gray-50" },
          { label: "Live Deployment", val: courses.filter(c => c.isPublished).length, icon: Globe, bg: "bg-gray-50" },
          { label: "Draft Units", val: courses.filter(c => !c.isPublished).length, icon: Layers, bg: "bg-gray-50" },
        ].map((item, i) => (
          <div key={i} className="border border-gray-200 p-8 flex items-center gap-6 rounded-md">
            <div className={cn("w-14 h-14 rounded-sm flex items-center justify-center bg-black text-white")}>
              <item.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
              <h3 className="text-3xl font-light text-black leading-none mt-1">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="FILTER_COURSES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-blue-100 focus:bg-white transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
          <Filter size={16} /> Filter_Config
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCourses.map((course) => (
          <div key={course._id} className="card-premium group relative overflow-hidden flex flex-col">
            <div className="p-10 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-sm uppercase tracking-widest">{course.category || "General"}</span>
                    {course.isPublished && (
                      <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-sm uppercase tracking-widest">Live</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-light text-black tracking-tight leading-tight">{course.title}</h3>
                </div>
                <button className="text-gray-300 hover:text-black p-2"><MoreVertical size={20} /></button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Clock size={14} /> Updated {new Date(course.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/courses/${course._id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isPublished: !course.isPublished })
                    });
                    if (res.ok) fetchCourses();
                  }}
                  className={cn(
                    "p-2.5 bg-white border rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    course.isPublished ? "text-emerald-600 border-emerald-100 hover:bg-emerald-50" : "text-amber-600 border-amber-100 hover:bg-amber-50"
                  )}
                >
                  {course.isPublished ? <Globe size={16} /> : <Layers size={16} />}
                  {course.isPublished ? "Unpublish" : "Go Live"}
                </button>

                <button
                  onClick={async () => {
                    const res = await fetch(`/api/courses/${course._id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ featured: !course.featured })
                    });
                    if (res.ok) fetchCourses();
                  }}
                  className={cn(
                    "p-2.5 bg-white border rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    course.featured ? "text-blue-600 border-blue-100 bg-blue-50" : "text-gray-400 border-gray-100 hover:bg-gray-50"
                  )}
                >
                  <Sparkles size={16} className={course.featured ? "fill-blue-600" : ""} />
                  {course.featured ? "Featured" : "Feature"}
                </button>

                <div className="w-px h-8 bg-gray-100 mx-2"></div>
                <Link href={`/courses/${course.slug || course._id}`} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                  <Eye size={18} />
                </Link>
                <Link href={`/admin/courses/${course._id}/edit`} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                  <Edit2 size={18} />
                </Link>
              </div>
              <button
                onClick={() => deleteCourse(course._id)}
                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-400 italic font-bold uppercase tracking-widest text-[10px]">No education assets found.</div>
        )}
      </div>
    </div>
  );
}
