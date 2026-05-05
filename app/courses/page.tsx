"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  ChevronDown, 
  Star, 
  Users, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  BookOpen,
  Clock,
  Signal
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function CoursesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") as string);
    }
  }, [searchParams]);

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

  const handleStartLearning = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/get-started");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const isFree = !course.price || course.price === 0;
    if (activeTab === "free") return isFree;
    if (activeTab === "premium") return !isFree;
    return true; // "all"
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F172A] font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-white py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-tight text-[#1A4B6B]">iSoftware Lab</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link">Home</Link>
            <div className="relative group py-4">
              <button className="nav-link flex items-center gap-1 text-[#1A4B6B]">
                Courses <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 mt-[-8px]">
                <Link href="/courses" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">All Courses</Link>
                <Link href="/courses?tab=free" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Free Courses</Link>
                <Link href="/courses?tab=premium" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Premium Courses</Link>
              </div>
            </div>
            <Link href="/certificates" className="nav-link">Certification</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleStartLearning}
              className="bg-[#1A4B6B] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#153a54] transition-all"
            >
              Start Learning
            </button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <div className="flex flex-col gap-4">
              <span className="text-lg font-bold text-slate-400">Courses</span>
              <Link href="/courses" className="text-lg font-bold pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>All Courses</Link>
              <Link href="/courses?tab=free" className="text-lg font-bold pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Free Courses</Link>
              <Link href="/courses?tab=premium" className="text-lg font-bold pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Premium Courses</Link>
            </div>
            <Link href="/certificates" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Certification</Link>
          </div>
        </div>
      )}

      <main className="pb-32">
        {/* Header */}
        <section className="bg-white py-16 border-b border-slate-100">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Explore Our Courses</h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Master new skills, advance your career, and build real-world projects with our comprehensive curriculums.</p>
           </div>
        </section>

        {/* Filters & Grid */}
        <section className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
           {/* Tab Filters */}
           <div className="flex flex-wrap justify-center gap-4">
              <button 
                 onClick={() => setActiveTab("all")}
                 className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === "all" ? "bg-[#1A4B6B] text-white" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
              >
                 All Courses
              </button>
              <button 
                 onClick={() => setActiveTab("free")}
                 className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === "free" ? "bg-[#1A4B6B] text-white" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
              >
                 Free Courses
              </button>
              <button 
                 onClick={() => setActiveTab("premium")}
                 className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === "premium" ? "bg-[#1A4B6B] text-white" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
              >
                 Premium Courses
              </button>
           </div>

           {/* Grid */}
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                 [1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-white border border-slate-100 rounded-3xl animate-pulse shadow-sm" />)
              ) : filteredCourses.length === 0 ? (
                 <div className="col-span-full py-20 text-center">
                    <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-600">No courses found</h3>
                    <p className="text-slate-500">We don't have any courses matching this category right now.</p>
                 </div>
              ) : (
                 filteredCourses.map((course, index) => {
                    const isFree = !course.price || course.price === 0;
                    return (
                       <motion.div 
                          key={course._id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                       >
                          {/* Thumbnail */}
                          <div className="relative h-56 overflow-hidden">
                             <img 
                                src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"} 
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                             />
                             {/* Badge */}
                             <div className="absolute top-4 left-4">
                                {isFree ? (
                                   <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Free</span>
                                ) : (
                                   <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                      <Star size={12} className="fill-white" /> Premium
                                   </span>
                                )}
                             </div>
                          </div>

                          {/* Content */}
                          <div className="p-8 flex-1 flex flex-col justify-between">
                             <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#4270BD] transition-colors leading-snug">{course.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{course.description}</p>
                             </div>

                             <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                                {/* Details Row */}
                                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                                   <div className="flex items-center gap-1.5">
                                      <Clock size={16} className="text-[#4270BD]" />
                                      {course.duration || "4 Weeks"}
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <Signal size={16} className="text-[#4270BD]" />
                                      {course.difficulty || "Beginner"}
                                   </div>
                                </div>

                                {/* CTA */}
                                <Link 
                                   href={status === "authenticated" ? `/dashboard/courses/${course.slug || course._id}` : "/get-started"}
                                   className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                      isFree 
                                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                                      : "bg-[#1A4B6B] text-white hover:bg-[#153a54]"
                                   }`}
                                >
                                   {isFree ? "Start Learning" : "Enroll Now"} <ArrowRight size={18} />
                                </Link>
                             </div>
                          </div>
                       </motion.div>
                    );
                 })
              )}
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-[#1A4B6B]">iSoftware Lab</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">The algorithm to become awesome at DSA & CP. Built by experts from MAANG companies.</p>
            </div>
            
            <div className="col-span-1 space-y-6">
              <h4 className="font-bold text-[#1A4B6B]">Platform</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-500">
                <Link href="/" className="hover:text-[#4270BD] font-medium transition-colors">Home</Link>
                <Link href="/courses?tab=premium" className="hover:text-[#4270BD] font-medium transition-colors">Premium Courses</Link>
                <Link href="/courses?tab=free" className="hover:text-[#4270BD] font-medium transition-colors">Free Courses</Link>
              </div>
            </div>

            <div className="col-span-1 space-y-6">
              <h4 className="font-bold text-[#1A4B6B]">Resources</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-500">
                <Link href="/certificates" className="hover:text-[#4270BD] font-medium transition-colors">Certifications</Link>
                <Link href="#" className="hover:text-[#4270BD] font-medium transition-colors">Mock Interviews</Link>
                <Link href="#" className="hover:text-[#4270BD] font-medium transition-colors">Student Results</Link>
              </div>
            </div>

            <div className="col-span-1 space-y-6">
              <h4 className="font-bold text-[#1A4B6B]">Contact</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-500">
                <a href="#" className="hover:text-[#4270BD] font-medium transition-colors">support@isoftwarelab.com</a>
                <div className="pt-4 flex gap-4">
                  <a href="#" className="hover:text-[#4270BD] text-slate-400 transition-colors">
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#4270BD] text-slate-400 transition-colors">
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186c-.273-1.029-1.082-1.838-2.111-2.111-1.861-.501-9.387-.501-9.387-.501s-7.526 0-9.387.501c-1.029.273-1.838 1.082-2.111 2.111-.501 1.861-.501 5.814-.501 5.814s0 3.953.501 5.814c.273 1.029 1.082 1.838 2.111 2.111 1.861.501 9.387.501 9.387.501s7.526 0 9.387-.501c1.029-.273 1.838-1.082 2.111-2.111.501-1.861.501-5.814.501-5.814s0-3.953-.501-5.814zm-14.831 7.147v-4.666l6.064 2.333-6.064 2.333z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            © 2026 iSoftware Lab. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#1A4B6B] border-t-transparent rounded-full animate-spin"></div></div>}>
      <CoursesContent />
    </Suspense>
  );
}
