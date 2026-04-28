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
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      setError("An error occurred while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    drafts: courses.filter(c => !c.isPublished).length,
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter(c => c._id !== id));
      } else {
        alert("Failed to delete course");
      }
    } catch (err) {
      console.error("Delete course error:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            COURSE <span className="text-[#EBBB54]">MANAGEMENT</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Build and organize your education modules</p>
        </div>
        <Link href="/admin/courses/new" className="flex items-center gap-2 px-6 py-3 bg-[#EBBB54] text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#EBBB54]/10 uppercase text-xs">
          <Plus size={18} />
          <span>New_Course</span>
        </Link>
      </div>

      {/* Course Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Courses", val: stats.total, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Published", val: stats.published, icon: Globe, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Drafts", val: stats.drafts, icon: Layers, color: "text-[#EBBB54]", bg: "bg-[#EBBB54]/10" },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-black border border-white/5 rounded-2xl flex items-center gap-4 group">
             <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}><item.icon size={24} /></div>
             <div>
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.label}</p>
               <h3 className="text-xl font-black text-white">{item.val}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-black border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH_COURSES..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-black border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 bg-white/5 text-gray-500 text-[10px] font-bold rounded uppercase tracking-widest">{course.category || "General"}</span>
                  <h3 className="text-xl font-black text-white group-hover:text-[#EBBB54] transition-colors uppercase tracking-tight">{course.title}</h3>
                </div>
                <button className="text-gray-600 hover:text-white p-2">
                  <MoreVertical size={18} />
                </button>
             </div>

             <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-700" />
                  <span className="text-[10px] font-bold text-gray-600 uppercase">Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  {course.isPublished ? (
                    <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-black uppercase tracking-widest">
                      <Globe size={14} /> LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] text-gray-700 font-black uppercase tracking-widest">
                      <Edit2 size={14} /> DRAFT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                   <button className="p-2.5 text-gray-600 hover:text-white bg-white/5 rounded-xl transition-all">
                      <Eye size={18} />
                   </button>
                   <Link href={`/admin/courses/${course._id}/edit`} className="p-2.5 text-gray-600 hover:text-[#EBBB54] bg-white/5 rounded-xl transition-all block">
                      <Edit2 size={18} />
                   </Link>
                   <button 
                    onClick={() => deleteCourse(course._id)}
                    className="p-2.5 text-gray-600 hover:text-red-500 bg-white/5 rounded-xl transition-all"
                   >
                      <Trash2 size={18} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
