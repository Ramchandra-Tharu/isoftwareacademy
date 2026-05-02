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
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
               <Cpu size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">Oracle Cloud <span className="font-light">Infrastructure</span></span>
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
        <section className="relative pt-48 pb-32 px-6 overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-blue-50/50 blur-[140px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-5xl mx-auto text-left space-y-16">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-12">
               <h1 className="text-7xl md:text-8xl font-light tracking-tight text-black leading-none">
                  Oracle Cloud <br /> 
                  Infrastructure
               </h1>
               <div className="space-y-8 max-w-3xl">
                  <p className="text-2xl md:text-3xl text-gray-800 font-normal leading-tight">
                    Oracle offers the highest-performing cloud services at the lowest cost. That's why so many of the world's biggest technology companies use OCI.
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-black">OCI Tech Customers</h3>
                    <p className="text-lg text-gray-700 tracking-wide">
                      AMD, ByteDance, Meta, NVIDIA, OpenAI, Temu, TikTok, Uber, xAI
                    </p>
                  </div>

                  <p className="text-xl text-gray-700 leading-relaxed">
                    The demand for cloud infrastructure for AI training and inferencing greatly exceeds supply. In response to this shortage, Oracle is building AI cloud capacity as quickly as we can.
                  </p>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="flex gap-4"
            >
               <button className="btn-primary">
                 Start Training Now
               </button>
               <button className="btn-secondary">
                 View Cloud Portfolio
               </button>
            </motion.div>
          </div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-40 grayscale"
            >
               <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted By Leads At:</div>
               <div className="flex gap-10">
                  <span className="font-black tracking-tighter text-xl">META</span>
                  <span className="font-black tracking-tighter text-xl">GOOGLE</span>
                  <span className="font-black tracking-tighter text-xl">STRIPE</span>
               </div>
            </motion.div>
         </section>

        {/* 2.5 Platform Overview Section */}
        <section className="py-24 bg-white px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               whileInView={{ opacity: 1, x: 0 }} 
               viewport={{ once: true }}
               className="space-y-10"
             >
                <div className="space-y-6">
                   <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Section_01. PLATFORM_OVERVIEW</h2>
                   <h3 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                      Architecture Your <br/> <span className="text-blue-600">Future Success.</span>
                   </h3>
                   <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                      iSoftware Academy is more than just a course platform. It is a comprehensive ecosystem designed to bridge the gap between theoretical mastery and enterprise-scale software engineering.
                   </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                   {[
                      { title: "Specialized Programs", desc: "Cohesive learning paths designed for career transitions.", icon: Layout },
                      { title: "Expert Courses", desc: "Meticulously crafted modules by industry veterans.", icon: BookOpen },
                      { title: "Verified Credentials", desc: "Blockchain-backed certifications for your resume.", icon: Award },
                      { title: "Structured Learning", desc: "Zero-fluff curriculum focused on practical output.", icon: ShieldCheck }
                   ].map((item, i) => (
                      <div key={i} className="space-y-3">
                         <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <item.icon size={20} />
                         </div>
                         <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">{item.title}</h4>
                         <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                   <Link href="/get-started" className="btn-primary px-10 py-4 text-xs tracking-widest uppercase">
                      Get Started Free
                   </Link>
                   <Link href="#courses" className="px-10 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Explore Courses
                   </Link>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               whileInView={{ opacity: 1, scale: 1 }} 
               viewport={{ once: true }}
               className="relative"
             >
                <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
                <div className="card-premium p-4 bg-white/50 backdrop-blur-xl border-white overflow-hidden shadow-2xl">
                   <img 
                     src="/platform_overview_visual_1777487506937.png" 
                     alt="Platform Ecosystem Visual" 
                     className="w-full h-auto rounded-[2rem] hover:scale-105 transition-transform duration-700"
                   />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 flex items-center gap-4 animate-bounce duration-[3000ms]">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Sparkles size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Nodes</p>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">5,000+ Enrolled</p>
                   </div>
                </div>
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

              <div className="bg-white p-4 rounded-[2.5rem] border border-gray-200 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                 <div className="bg-gray-50 rounded-[2rem] overflow-hidden aspect-video relative flex flex-col border border-gray-200">
                    <div className="flex gap-2 p-4 border-b border-gray-200 bg-white">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                       <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 grid grid-cols-2">
                       <div className="p-6 border-r border-gray-200 font-mono text-[10px] text-blue-600/70">
                          <span className="text-gray-400">// RAW_INPUT_NODE</span><br/>
                          {"{"}<br/>
                          {"  "}"type": "code",<br/>
                          {"  "}"lang": "java",<br/>
                          {"  "}"content": "System.out.println('Success')"<br/>
                          {"}"}
                       </div>
                       <div className="p-6 bg-white flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                             <Terminal size={24} />
                          </div>
                          <span className="text-[9px] text-gray-900 font-black uppercase tracking-widest">RENDERED_OUTPUT</span>
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
              courses.slice(0, 6).map(course => (
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

        {/* 6. About Section */}
        <section id="about" className="py-32 bg-gray-50 px-6 overflow-hidden">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }}
                className="order-2 lg:order-1 relative"
              >
                 <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
                 <div className="card-premium p-4 bg-white/50 backdrop-blur-xl border-white overflow-hidden shadow-2xl">
                    <img 
                      src="/about_us_visual_1777487568577.png" 
                      alt="About iSoftware Lab" 
                      className="w-full h-auto rounded-[2rem] hover:scale-105 transition-transform duration-700"
                    />
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                className="order-1 lg:order-2 space-y-8"
              >
                 <div className="space-y-4">
                    <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Section_04. ABOUT_US</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                       The Mission Behind <br/> <span className="text-blue-600">The Lab.</span>
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                       Founded by a collective of senior engineers from top-tier tech firms, iSoftware Academy was born from a simple observation: the gap between academic theory and production-grade engineering is too wide.
                    </p>
                 </div>
                 
                 <div className="space-y-6">
                    {[
                      { title: "Industry Led", desc: "Every module is vetted by active software architects." },
                      { title: "Practical Output", desc: "We focus on building real-world deployment-ready assets." },
                      { title: "Global Community", desc: "Join thousands of developers across 40+ countries." }
                    ].map((point, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                            <CheckCircle2 size={14} />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{point.title}</h4>
                            <p className="text-xs text-gray-400 font-medium">{point.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        </section>

        {/* 7. Contact Section */}
        <section id="contact" className="py-32 px-6">
           <div className="max-w-4xl mx-auto text-center space-y-16">
              <div className="space-y-4">
                 <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Section_05. CONTACT_INIT</h2>
                 <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                    Have an Inquiry? <br/> <span className="text-blue-600">Sync With Us.</span>
                 </h3>
              </div>

              <div className="card-premium p-10 md:p-16 text-left space-y-8 shadow-2xl shadow-blue-600/5">
                 <form className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Identification</label>
                       <input type="text" placeholder="FULL_NAME" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:border-blue-100 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Communication_Email</label>
                       <input type="email" placeholder="EMAIL_INTERFACE" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:border-blue-100 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Message_Protocol</label>
                       <textarea placeholder="HOW_CAN_WE_ASSIST_YOUR_EVOLUTION?" rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:border-blue-100 transition-all resize-none" />
                    </div>
                    <div className="md:col-span-2">
                       <button className="w-full btn-primary py-5 text-[10px] uppercase tracking-[0.2em]">Dispatch_Message</button>
                    </div>
                 </form>

                 <div className="pt-8 border-t border-gray-50 grid sm:grid-cols-3 gap-8">
                    {[
                      { icon: Globe, label: "Global Presence", val: "40+ Nodes" },
                      { icon: MessageSquare, label: "Response Time", val: "< 24 Hours" },
                      { icon: ShieldCheck, label: "Data Protection", val: "GDPR Compliant" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <item.icon size={16} />
                         </div>
                         <div>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">{item.label}</p>
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{item.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 8. Final CTA */}
        <section className="py-32 px-6">
           <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden group shadow-2xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 p-20 opacity-10 text-white pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Globe size={400} />
              </div>
              <div className="relative z-10 space-y-10">
                 <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">Ready to start <br/> your <span className="text-blue-100">evolution?</span></h2>
                 <p className="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto font-medium">Join 5,000+ engineers mastering the future of software development on iSoftware Lab Academy.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/get-started" className="bg-white text-blue-600 px-12 py-5 text-lg font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/10 uppercase tracking-widest">Start Learning For Free</Link>
                    <Link href="#contact" className="px-12 py-5 bg-blue-700/50 border border-blue-400/30 text-white rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all uppercase tracking-widest">Contact Sales</Link>
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
