"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Type,
  Link as LinkIcon,
  User,
  Clock,
  BookOpen,
  BarChart
} from "lucide-react";
import Link from "next/link";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    instructorName: "",
    category: "",
    thumbnail: "",
    totalLessons: 0,
    duration: "",
    difficulty: "Beginner",
    isPublished: false,
    price: 0,
  });

  useEffect(() => {
    if (!courseId) return;
    
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            description: data.description || "",
            instructorName: data.instructorName || "",
            category: data.category || "",
            thumbnail: data.thumbnail || "",
            totalLessons: data.totalLessons || 0,
            duration: data.duration || "",
            difficulty: data.difficulty || "Beginner",
            isPublished: data.isPublished || false,
            price: data.price || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch course details", err);
      } finally {
        setFetching(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

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
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/admin/courses"), 1500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 border border-gray-100">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">UPDATE_<span className="text-blue-600">ASSET</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Modifying unique educational unit in course_db</p>
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
                <Type size={12} /> Course_Title
              </label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="E.G. SYSTEMS_ARCHITECTURE_101"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
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
                <User size={12} /> Lead_Instructor
              </label>
              <input 
                required
                type="text" 
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                placeholder="E.G. DR. ROOT_ADMIN"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Section 2: Technical Metadata */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] border-l-2 border-blue-600 pl-3">02. TECHNICAL_META</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <Clock size={12} /> Duration
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="E.G. 12_HOURS"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <BookOpen size={12} /> Lesson_Count
                </label>
                <input 
                  required
                  type="number" 
                  value={formData.totalLessons}
                  onChange={(e) => setFormData({ ...formData, totalLessons: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <BarChart size={12} /> Difficulty
                </label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all appearance-none"
                >
                  <option value="Beginner">BEGINNER</option>
                  <option value="Intermediate">INTERMEDIATE</option>
                  <option value="Advanced">ADVANCED</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all appearance-none"
                >
                  <option value="">SELECT</option>
                  <option value="Full Stack">FULL_STACK</option>
                  <option value="Mobile Dev">MOBILE_DEV</option>
                  <option value="Backend">BACKEND</option>
                  <option value="Data Science">DATA_SCIENCE</option>
                  <option value="UI/UX Design">UI_UX_DESIGN</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   Price (INR)
                </label>
                <input 
                  required
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-600/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-8 pt-8 border-t border-gray-100">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Content_Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="DETAILED_SYLLABUS_AND_LEARNING_OUTCOMES..."
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
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                    id="publish"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="sr-only peer"
                  />
                  <label htmlFor="publish" className="absolute inset-0 cursor-pointer bg-gray-200 rounded-full transition-colors peer-checked:bg-blue-600"></label>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </div>
                <label htmlFor="publish" className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer">
                  LIVE_STATUS
                </label>
             </div>

             <div className="h-6 w-px bg-gray-100"></div>

             <div className="flex items-center gap-4">
               {status === "success" && (
                 <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                   <CheckCircle size={14} /> ASSET_UPDATED
                 </div>
               )}
               {status === "error" && (
                 <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                   <AlertCircle size={14} /> UPDATE_FAILED
                 </div>
               )}
             </div>
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>UPDATE_DEPLOYMENT</span>
          </button>
        </div>
      </form>
    </div>
  );
}
