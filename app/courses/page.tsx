"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  ChevronRight, 
  Star, 
  Users, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Layout,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) setCourses(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans">
      {/* Navigation */}
      <nav className="bg-white py-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-tight text-[#1A4B6B]">iSoftware Lab</span>
          </Link>
          <Link href="/get-started" className="bg-[#1A4B6B] text-white px-6 py-2.5 rounded-lg text-sm font-bold">
            {status === "authenticated" ? "Go to Dashboard" : "Start Learning"}
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-40 opacity-10"><ShieldCheck size={400} /></div>
           <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Premium is not for <br /> the <span className="text-[#4270BD]">faint hearted!</span></h1>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">Access our most intensive, result-oriented programs designed to help you land offers at top product-based companies.</p>
           </div>
        </section>

        {/* Programs Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-12">
              {loading ? (
                [1,2].map(i => <div key={i} className="h-[400px] bg-slate-100 rounded-3xl animate-pulse" />)
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="card-premium flex flex-col md:flex-row overflow-hidden group">
                     <div className="md:w-2/5 relative h-64 md:h-auto">
                        <img 
                          src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                           <span className="bg-[#4270BD] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Premium Track</span>
                        </div>
                     </div>
                     <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                           <h3 className="text-2xl font-bold group-hover:text-[#1A4B6B] transition-colors">{course.title}</h3>
                           <p className="text-slate-500 text-sm line-clamp-3">{course.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                           <div className="flex items-center gap-1"><BookOpen size={14} className="text-[#4270BD]"/> {course.lessons?.length || 0} Lessons</div>
                           <div className="flex items-center gap-1"><Users size={14} className="text-[#4270BD]"/> 500+ Enrolled</div>
                           <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400"/> 4.9/5.0</div>
                        </div>

                        <Link 
                          href={status === "authenticated" ? `/dashboard/courses/${course.slug || course._id}` : "/get-started"}
                          className="w-full bg-[#1A4B6B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#153a54] transition-all"
                        >
                          Enroll Now <ArrowRight size={18} />
                        </Link>
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-slate-50 px-6">
           <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
              {[
                { icon: <Award className="text-[#4270BD]" size={32} />, title: "Verified Certificates", desc: "Get certificates recognized by top tech firms across the globe." },
                { icon: <Zap className="text-[#4270BD]" size={32} />, title: "Lifetime Access", desc: "Pay once and access the content and community forever." },
                { icon: <Layout className="text-[#4270BD]" size={32} />, title: "Structured Roadmap", desc: "Zero fluff content focused on interview patterns and practical dev." }
              ].map((b, i) => (
                <div key={i} className="text-center space-y-4">
                   <div className="flex justify-center">{b.icon}</div>
                   <h4 className="text-xl font-bold">{b.title}</h4>
                   <p className="text-slate-500 text-sm">{b.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 px-6 border-t border-slate-800">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-8 h-8 object-contain" />
               <span className="text-lg font-bold text-white">iSoftware Lab</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">© 2026 iSoftware Lab. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );
}
