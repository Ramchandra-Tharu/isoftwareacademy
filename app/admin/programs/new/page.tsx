"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Type,
  Link as LinkIcon,
  Clock,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    duration: "",
    thumbnail: "",
    courses: [] as string[]
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setAvailableCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const toggleCourseSelection = (courseId: string) => {
    setFormData((prev) => {
      const isSelected = prev.courses.includes(courseId);
      if (isSelected) {
        return { ...prev, courses: prev.courses.filter(id => id !== courseId) };
      } else {
        return { ...prev, courses: [...prev.courses, courseId] };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        setFormData({ ...formData, thumbnail: json.url });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Image upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-role": "admin"
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/admin/programs"), 1500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/programs" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 border border-gray-100">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">DEPLOY_<span className="text-blue-600">PROGRAM</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Create a structured learning path</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-premium p-10 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Save size={120} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1: Core Identity */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] border-l-2 border-blue-600 pl-3">01. CORE_IDENTITY</h2>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Type size={12} /> Program_Title
              </label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="E.G. FULL STACK DEVELOPER TRACK"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <LinkIcon size={12} /> Access_Slug
              </label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all font-mono text-blue-600/70"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Clock size={12} /> Estimated_Duration
              </label>
              <input 
                required
                type="text" 
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="E.G. 6_MONTHS"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Section 2: Course Selection */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] border-l-2 border-blue-600 pl-3">02. COURSE_SELECTION</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {availableCourses.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 border border-dashed border-gray-200 rounded-xl">No courses available. Create some courses first.</div>
              ) : (
                availableCourses.map((course) => (
                  <div 
                    key={course._id} 
                    onClick={() => toggleCourseSelection(course._id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${formData.courses.includes(course._id) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-100 bg-gray-50'}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.courses.includes(course._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {formData.courses.includes(course._id) && <CheckCircle size={14} className="text-black" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{course.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{course.duration} • {course.difficulty}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-8 pt-8 border-t border-gray-100">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Program_Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="DETAILED_OVERVIEW_OF_THE_PROGRAM..."
              className="w-full bg-gray-50 border border-gray-100 rounded-[24px] py-5 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Visual_Asset_Upload</label>
            <div className="flex gap-4 items-center">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600/10 file:text-blue-600 hover:file:bg-blue-600/20"
              />
              {uploading && <Loader2 className="animate-spin text-blue-600" size={20} />}
              {formData.thumbnail && !uploading && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                  <img src={formData.thumbnail} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            {status === "success" && (
              <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <CheckCircle size={14} /> PROGRAM_DEPLOYED
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} /> DEPLOY_FAILED
              </div>
            )}
          </div>
          
          <button 
            disabled={loading || formData.courses.length === 0}
            type="submit"
            className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>EXECUTE_DEPLOYMENT</span>
          </button>
        </div>
      </form>
    </div>
  );
}
