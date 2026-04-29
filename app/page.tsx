"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  PlayCircle,
  Clock,
  BookOpen,
  Code2,
  Layout,
  CheckCircle2,
  FileText,
  Award,
  Video,
  Terminal,
  Bot,
  Database,
  Lock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Globe
} from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [summarizerText, setSummarizerText] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) setCourses(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Navigation Bar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
               <Cpu size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-gray-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">Demo</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </div>

          <div className="hidden md:block">
            <Link replace href="/get-started" className="btn-primary flex items-center gap-2">
              Try Now <ArrowRight size={18} />
            </Link>
          </div>

          <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-8 text-sm font-black uppercase tracking-widest text-gray-500">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#courses" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)}>Demo</a>
            <Link replace href="/get-started" className="btn-primary w-full text-center">Login</Link>
          </div>
        </div>
      )}

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-48 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-50 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest animate-bounce">
                  <Sparkles size={14} /> New: AI Text Summarizer Integrated
               </div>
               <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] text-gray-900">
                  Master Code. <br /> 
                  <span className="text-blue-600">Scale Reality.</span>
               </h1>
               <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                  The ultimate platform for software engineers. Learn Full-Stack development through multimodal content, interactive code, and AI-powered insights.
               </p>
            </motion.div>

            {/* Input Box for Summarizer as requested */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto relative group">
               <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-3xl -z-10 group-focus-within:bg-blue-600/10 transition-colors" />
               <div className="bg-white border border-gray-200 rounded-[2rem] p-3 shadow-xl flex flex-col md:flex-row gap-3">
                  <input 
                    type="text" 
                    value={summarizerText}
                    onChange={(e) => setSummarizerText(e.target.value)}
                    placeholder="Paste technical text here to summarize..." 
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-medium focus:outline-none"
                  />
                  <button className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
                    Summarize Now <Zap size={18} />
                  </button>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-8 pt-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">JAVA</div>
               <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">REACT</div>
               <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">FLUTTER</div>
               <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">NODE.JS</div>
            </motion.div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
             <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">01. CORE_FEATURES</h2>
             <h3 className="text-4xl md:text-5xl font-black tracking-tight">Engineering-First Learning.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: <BookOpen className="text-blue-600" />, title: "Structured Tracks", desc: "Follow meticulously crafted roadmaps from Java basics to advanced microservices." },
               { icon: <Terminal className="text-blue-600" />, title: "Code Sandboxes", desc: "Execute and test technical snippets directly in your browser with zero setup." },
               { icon: <Layout className="text-blue-600" />, title: "Visual Diagrams", desc: "High-resolution system architectures and data flow visualizations for better retention." },
               { icon: <Bot className="text-blue-600" />, title: "AI Assistant", desc: "Get instant help with complex code errors or architectural doubts 24/7." },
               { icon: <ShieldCheck className="text-blue-600" />, title: "Secure Auth", desc: "Enterprise-grade security with Google OAuth and JWT-based session management." },
               { icon: <Award className="text-blue-600" />, title: "Verified Credentials", desc: "Earn blockchain-verifiable PDF certificates upon successful course completion." }
             ].map((f, i) => (
               <div key={i} className="card-premium p-10 space-y-6 group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                     {f.icon}
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter">{f.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 4. Demo Section (Input -> Output) */}
        <section id="demo" className="py-32 bg-gray-50 px-6">
           <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">02. SYSTEM_DEMO</h2>
                 <h3 className="text-5xl font-black tracking-tighter leading-none">From Complexity to <br/> <span className="text-blue-600">Clarity.</span></h3>
                 <p className="text-gray-500 font-medium leading-relaxed">Our render engine converts raw technical data into intuitive learning modules. Experience the difference between reading and understanding.</p>
                 <ul className="space-y-4">
                    {["Markdown to UI Conversion", "Interactive Code Highlighting", "Real-time Architecture Rendering"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 className="text-blue-600" size={18} /> {item}
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-white p-4 rounded-[2.5rem] border border-gray-200 shadow-2xl relative">
                 <div className="bg-gray-900 rounded-[2rem] overflow-hidden aspect-video relative flex flex-col">
                    <div className="flex gap-2 p-4 border-b border-white/5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 grid grid-cols-2">
                       <div className="p-6 border-r border-white/5 font-mono text-[10px] text-blue-300">
                          <span className="text-gray-500">// RAW_INPUT</span><br/>
                          {"{"}<br/>
                          {"  "}"type": "code",<br/>
                          {"  "}"lang": "java",<br/>
                          {"  "}"content": "print('hello')"<br/>
                          {"}"}
                       </div>
                       <div className="p-6 bg-white/5 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                             <Terminal size={24} />
                          </div>
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">RENDERED_OUTPUT</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. Courses Section */}
        <section id="courses" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
             <div className="space-y-4">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">03. COURSE_CATALOG</h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Build Your <br/> <span className="text-blue-600">Knowledge Stack.</span></h3>
             </div>
             <Link href="/courses" className="text-sm font-black uppercase tracking-widest text-blue-600 hover:gap-4 transition-all flex items-center gap-2">View Full Catalog <ArrowRight size={16}/></Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coursesLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-[450px] bg-gray-100 rounded-[2.5rem] animate-pulse" />)
            ) : (
              courses.slice(0, 3).map(course => (
                <div key={course._id} className="card-premium overflow-hidden group flex flex-col">
                   <div className="h-64 bg-gray-50 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                           <Code2 size={80} />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                         {course.category}
                      </div>
                   </div>
                   <div className="p-10 flex-1 flex flex-col space-y-4">
                      <h4 className="text-2xl font-black tracking-tighter uppercase">{course.title}</h4>
                      <p className="text-gray-500 text-sm font-medium line-clamp-2">{course.description}</p>
                      <div className="pt-6 mt-auto border-t border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <Clock size={14} /> {course.duration || "Self-paced"}
                         </div>
                         <Link href={`/courses/${course.slug || course._id}`} className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                            <PlayCircle size={24} />
                         </Link>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="py-32 px-6">
           <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-20 opacity-10 text-white pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Globe size={400} />
              </div>
              <div className="relative z-10 space-y-10">
                 <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">Ready to start <br/> your <span className="text-blue-600">evolution?</span></h2>
                 <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">Join 5,000+ engineers mastering the future of software development on iSoftware Lab Academy.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/get-started" className="btn-primary px-12 py-5 text-lg">Start Learning For Free</Link>
                    <button className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-xl text-lg font-bold hover:bg-white/10 transition-all">Contact Sales</button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 space-y-6">
               <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Cpu size={22} />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
               </Link>
               <p className="text-gray-500 text-sm font-medium leading-relaxed">Bridging the gap between theoretical mastery and enterprise-scale software engineering.</p>
            </div>
            {["Platform", "Community", "Legal"].map((col, i) => (
              <div key={i} className="space-y-6">
                 <h5 className="text-xs font-black uppercase tracking-widest text-gray-900">{col}</h5>
                 <ul className="space-y-4 text-sm font-bold text-gray-500">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Architecture</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto border-t border-gray-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <p>© 2026 iSoftware Lab Academy. Ver 2.0.0-SaaS</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
               <a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a>
               <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
