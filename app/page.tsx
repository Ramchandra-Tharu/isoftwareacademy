"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  PlayCircle,
  Clock,
  BookOpen,
  Code,
  Layout,
  CheckCircle2,
  FileText,
  Award,
  Video,
  Terminal,
  Bot,
  Database,
  Lock,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Reusable Animation Variants
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#EBBB54] selection:text-black overflow-hidden font-sans">
      {/* 1. Navigation Bar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5 py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#EBBB54]">
              iSoftware
            </span>
            <span className="font-serif text-xl font-bold">Academy</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#C2C2C2]">
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#community" className="hover:text-white transition-colors">Community</a>
          </div>

          <div className="hidden md:block">
            <Link replace href="/get-started" className="bg-[#EBBB54] text-black px-6 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform duration-200 inline-block font-sans">
              Login
            </Link>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0c0c0c] pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium text-[#C2C2C2]">
            <a href="#courses" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <Link replace href="/get-started" className="bg-[#EBBB54] text-black px-6 py-3 rounded-full font-medium w-full mt-4 text-center">
              Login
            </Link>
          </div>
        </div>
      )}

      <main>
        {/* 2. Hero Section */}
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[#EBBB54]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Bridge the Gap <br />
              <span className="text-[#EBBB54]">Between Theory and Practice</span>
            </h1>
            <p className="text-lg md:text-xl text-[#C2C2C2] max-w-3xl mx-auto mb-10 leading-relaxed">
              A comprehensive online learning platform offering Java, Full Stack, and Flutter. Master new technologies through text, interactive code blocks, and visual diagrams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link replace href="/get-started" className="w-full sm:w-auto bg-[#EBBB54] text-black px-8 py-4 rounded-full font-medium text-lg hover:scale-105 hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(235,187,84,0.3)] text-center flex items-center justify-center">
                Start Learning Today
              </Link>
              <button className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-200">
                View Architecture
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-4 text-sm text-[#C2C2C2]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0c0c0c] bg-[#262626] flex items-center justify-center text-xs">
                    U{i}
                  </div>
                ))}
              </div>
              <p>Google OAuth <span className="text-white font-medium">Secure Integration</span></p>
            </div>
          </motion.div>
        </section>

        {/* 3. Hero Visual (Code & Diagram Simulation) */}
        <section className="px-6 max-w-6xl mx-auto pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full rounded-2xl bg-[#262626]/40 backdrop-blur-md border border-white/10 p-2 md:p-4 shadow-2xl relative overflow-hidden"
          >
            {/* Window Controls */}
            <div className="flex gap-2 mb-4 px-4 pt-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Code Half */}
              <div className="bg-[#0c0c0c] rounded-xl p-6 font-mono text-sm leading-relaxed overflow-hidden">
                <span className="text-gray-500">// Technical Code Blocks</span><br />
                <span className="text-purple-400">public class</span> <span className="text-blue-300">HelloWorld</span> {"{"}<br />
                {"    "}<span className="text-purple-400">public static void</span> <span className="text-blue-200">main</span>(String[] args) {"{"}<br />
                {"        "}System.out.<span className="text-blue-200">println</span>(<span className="text-[#EBBB54]">"Hello, World!"</span>);<br />
                {"    "}{"}"}<br />
                {"}"}
              </div>
              {/* Architecture/Text Half */}
              <div className="bg-[#1f1f1f] rounded-xl p-6 flex flex-col justify-center items-center text-center">
                <Database className="w-12 h-12 text-[#EBBB54] mb-4" />
                <h3 className="font-serif text-xl mb-2">Multimodal Learning</h3>
                <p className="text-[#C2C2C2] text-sm">
                  Systematic progression through conceptual text, technical executable code blocks, and high-resolution system architectures.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Logo Cloud */}
        <section className="border-y border-white/5 bg-[#0c0c0c] py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold text-white tracking-widest">JAVA</span>
            <span className="text-xl font-bold text-white tracking-widest">SPRING BOOT</span>
            <span className="text-xl font-bold text-white tracking-widest">REACT</span>
            <span className="text-xl font-bold text-white tracking-widest">NODE.JS</span>
            <span className="text-xl font-bold text-white tracking-widest">FLUTTER</span>
            <span className="text-xl font-bold text-white tracking-widest">MONGODB</span>
          </div>
        </section>

        {/* 5. Explore Our Courses (Dynamic) */}
        <section id="courses" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Master New Technologies</h2>
            <p className="text-[#C2C2C2] max-w-2xl mx-auto">Our diverse curriculum spans three primary domains designed to build robust engineering skills.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {coursesLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <motion.div key={course._id} variants={fadeIn} className="bg-[#262626]/30 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="h-48 bg-[#1f1f1f] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#262626]/80 to-transparent z-10" />
                    {course.thumbnail ? (
                       <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                       <Code className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute top-4 left-4 z-20 bg-[#EBBB54] text-black text-xs font-bold px-3 py-1 rounded-full">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold mb-2">{course.title}</h3>
                    <p className="text-[#C2C2C2] text-sm mb-6 flex items-center gap-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="h-px bg-white/10 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-4 h-4 text-[#EBBB54]" /> {course.duration || "Self-paced"}
                      </div>
                      <Link href={`/courses/${course.slug || course._id}`} className="text-white hover:text-[#EBBB54] transition-colors"><PlayCircle className="w-6 h-6" /></Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                No active courses available at this time.
              </div>
            )}
          </motion.div>
        </section>

        {/* 6. Results-Driven Approach (3 vertical cards) */}
        <section className="bg-[#141414] py-24 px-6 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4">Course Content Format</h2>
              <p className="text-[#C2C2C2] max-w-2xl mx-auto">Each module is structured optimally to maximize retention via multimodal learning.</p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {[
                { icon: <FileText className="w-8 h-8 text-[#EBBB54]" />, title: "Conceptual Text", desc: "Plain-language explanations of complex engineering topics, making abstract ideas intuitive." },
                { icon: <Terminal className="w-8 h-8 text-[#EBBB54]" />, title: "Technical Code Blocks", desc: "Integrated executable-style snippets representing backend logic and frontend structure." },
                { icon: <Layout className="w-8 h-8 text-[#EBBB54]" />, title: "Visual Aids", desc: "High-resolution diagrams, flowcharts, and system architectures to illustrate data flows." }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeIn} className="bg-[#262626]/40 border border-white/5 p-10 rounded-2xl text-center flex flex-col items-center hover:bg-[#262626]/60 transition-colors duration-300">
                  <div className="w-20 h-20 rounded-full bg-[#1c1c1c] flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
                  <p className="text-[#C2C2C2] leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 7. System Modules (Replaces Scrolling Mentors) */}
        <section id="architecture" className="py-24 px-6 overflow-hidden max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-4">Platform Architecture</h2>
              <p className="text-[#C2C2C2] max-w-xl">Deep dive into the specialized services that power the iSoftware Lab Academy ecosystem.</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {[
              { name: "Auth Service", role: "Google Sign-In & Security", icon: <Lock /> },
              { name: "Course Engine", role: "Content & Assets Management", icon: <Database /> },
              { name: "Render Engine", role: "MD, Code & Image Logic", icon: <Code /> },
              { name: "Evaluate Engine", role: "Scoring & Persistence", icon: <CheckCircle2 /> },
              { name: "Cert Engine", role: "PDF Credential Generation", icon: <Award /> }
            ].map((module, idx) => (
              <div key={idx} className="shrink-0 w-64 snap-start group">
                <div className="w-full aspect-square rounded-full border-4 border-[#262626] bg-[#1a1a1a] mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#EBBB54]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-24 h-24 rounded-full bg-[#0c0c0c] border border-white/10 flex items-center justify-center text-[#EBBB54]">
                    {module.icon}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-center">{module.name}</h3>
                <p className="text-[#C2C2C2] text-sm text-center">{module.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Bento Grid (Workflows) */}
        <section className="py-24 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4">Structured Workflows</h2>
              <p className="text-[#C2C2C2] max-w-2xl mx-auto">A transparent look at how users interact with our systems from onboarding to certification.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 auto-rows-[250px]">
              {/* Card 1 */}
              <div className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-[#262626]/30 rounded-3xl border border-white/5 p-8 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#EBBB54]/10 rounded-full blur-[80px]" />
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Frictionless Onboarding</h3>
                  <p className="text-[#C2C2C2]">Students log in via Google OAuth. Profile data instantly provisions your dashboard and connects to user DB.</p>
                </div>
                <div className="bg-[#1f1f1f] rounded-xl p-4 border border-white/10 mt-6 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold">G</div>
                   <div className="flex-1">
                     <div className="h-2 w-1/2 bg-white/20 rounded mb-2" />
                     <div className="h-2 w-3/4 bg-white/10 rounded" />
                   </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] rounded-3xl border border-white/5 p-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold mb-2">Module Consumption</h3>
                  <p className="text-[#C2C2C2] text-sm max-w-xs">Fetching text, code, and diagrams seamlessly from Course DB and Asset Storage.</p>
                </div>
                <BookOpen className="w-12 h-12 text-[#EBBB54]/50" />
              </div>

              {/* Card 3 */}
              <div className="col-span-1 rounded-3xl border border-[#EBBB54]/20 bg-[#EBBB54]/5 p-8 flex flex-col justify-center items-center text-center">
                <CheckCircle2 className="w-10 h-10 text-[#EBBB54] mb-3" />
                <h3 className="font-serif font-bold mb-1">Validation</h3>
                <p className="text-[#C2C2C2] text-xs">Automated MCQ evaluations tracked to user profile.</p>
              </div>

              {/* Card 4 */}
              <div className="col-span-1 rounded-3xl border border-white/5 bg-[#262626]/30 p-8 flex flex-col justify-center items-center text-center">
                <Award className="w-10 h-10 text-white mb-3" />
                <h3 className="font-serif font-bold mb-1">Achievement</h3>
                <p className="text-[#C2C2C2] text-xs">Dynamic generation of verifiable PDF certificates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Statistics */}
        <section className="py-20 border-y border-white/5 bg-[#141414]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
             <div>
                <h4 className="text-5xl font-bold text-[#EBBB54] mb-2 font-serif">5+</h4>
                <p className="text-[#C2C2C2] uppercase tracking-wider text-xs font-bold">Core Microservices</p>
             </div>
             <div>
                <h4 className="text-5xl font-bold text-white mb-2 font-serif">4</h4>
                <p className="text-[#C2C2C2] uppercase tracking-wider text-xs font-bold">Database Nodes</p>
             </div>
             <div>
                <h4 className="text-5xl font-bold text-white mb-2 font-serif">100%</h4>
                <p className="text-[#C2C2C2] uppercase tracking-wider text-xs font-bold">Practical Code</p>
             </div>
             <div>
                <h4 className="text-5xl font-bold text-white mb-2 font-serif">1</h4>
                <p className="text-[#C2C2C2] uppercase tracking-wider text-xs font-bold">Tap Google Auth</p>
             </div>
          </div>
        </section>

        {/* 10. Testimonial / Assessment Grid */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Assessment & Engagement</h2>
            <p className="text-[#C2C2C2] max-w-2xl mx-auto">Evaluating knowledge and building networks through our integrated features.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#262626]/20 p-8 rounded-2xl border border-white/5 relative">
              <div className="text-[#EBBB54] mb-4"><CheckCircle2 className="w-8 h-8"/></div>
              <p className="text-lg italic mb-6">"Automated Multiple Choice Questions mapped directly to course difficulty, offering a retry mechanism that ensures absolute mastery of core concepts."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1f1f1f] rounded-full flex items-center justify-center">E</div>
                <div>
                  <h5 className="font-bold">Evaluation Engine</h5>
                  <p className="text-xs text-[#C2C2C2]">Quiz System</p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626]/20 p-8 rounded-2xl border border-white/5 relative">
              <div className="text-[#EBBB54] mb-4"><Award className="w-8 h-8"/></div>
              <p className="text-lg italic mb-6">"Immediate generation of a digital certificate upon success, fetching student name and course title seamlessly from the secure database."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1f1f1f] rounded-full flex items-center justify-center">C</div>
                <div>
                  <h5 className="font-bold">Certification Engine</h5>
                  <p className="text-xs text-[#C2C2C2]">Validation Protocol</p>
                </div>
              </div>
            </div>

            <div className="bg-[#262626]/20 p-8 rounded-2xl border border-white/5 relative">
              <div className="text-[#EBBB54] mb-4"><MessageSquare className="w-8 h-8"/></div>
              <p className="text-lg italic mb-6">"A dedicated community space for feedback, doubt clearance, and peer networking integrated directly within specific course modules."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1f1f1f] rounded-full flex items-center justify-center">S</div>
                <div>
                  <h5 className="font-bold">Interactive Service</h5>
                  <p className="text-xs text-[#C2C2C2]">Community Engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Blog / Future Enhancements */}
        <section className="py-24 px-6 max-w-7xl mx-auto bg-[#0A0A0A] rounded-[40px] mb-24 border border-white/5">
           <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Future Enhancements</h2>
            <p className="text-[#C2C2C2] max-w-2xl mx-auto">Our roadmap for scaling modern technical education to the next level.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-8">
             <div className="group cursor-pointer">
               <div className="h-40 bg-[#1a1a1a] rounded-xl mb-4 overflow-hidden border border-white/10 flex items-center justify-center relative">
                 <Video className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-300" />
               </div>
               <h4 className="text-lg font-bold font-serif mb-2">Hosted Video Integration</h4>
               <p className="text-[#C2C2C2] text-sm">Targeting hybrid learning models by adding hosted video lectures natively.</p>
             </div>
             
             <div className="group cursor-pointer">
               <div className="h-40 bg-[#1a1a1a] rounded-xl mb-4 overflow-hidden border border-white/10 flex items-center justify-center relative">
                 <Code className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-300" />
               </div>
               <h4 className="text-lg font-bold font-serif mb-2">Live Sandboxed IDE</h4>
               <p className="text-[#C2C2C2] text-sm">Implementing a direct browser-based coding environment for immediate testing.</p>
             </div>

             <div className="group cursor-pointer">
               <div className="h-40 bg-[#1a1a1a] rounded-xl mb-4 overflow-hidden border border-white/10 flex items-center justify-center relative">
                 <Bot className="w-12 h-12 text-white/30 group-hover:scale-110 transition-transform duration-300" />
               </div>
               <h4 className="text-lg font-bold font-serif mb-2">AI Tutoring Assistant</h4>
               <p className="text-[#C2C2C2] text-sm">Integrating LLM-based assistants for consistent 24/7 technical doubt solving.</p>
             </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="py-32 px-6 bg-[#EBBB54] text-black text-center selection:bg-black selection:text-[#EBBB54]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-black">
              Start Learning By Doing
            </h2>
            <p className="text-black/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              iSoftware Lab Academy is engineered to be a scalable, intuitive, and effective solution representing real-world software engineering challenges.
            </p>
            <Link replace href="/get-started" className="inline-block bg-[#0c0c0c] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#1a1a1a] transition-all hover:-translate-y-1 shadow-2xl">
              Enroll in Platform Today
            </Link>
          </div>
        </section>
      </main>

      {/* 13. Footer */}
      <footer className="bg-[#0c0c0c] pt-20 pb-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
              <span className="font-serif text-xl font-bold text-[#EBBB54]">
                iSoftware
              </span>
              <span className="font-serif text-xl font-bold">Academy</span>
            </div>
            <p className="text-[#C2C2C2] text-sm leading-relaxed mb-6">
              Preparing students for real-world development through theoretical mastery and robust practical application.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">Tracks</h4>
            <ul className="flex flex-col gap-4 text-[#C2C2C2] text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Java Programming</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Full Stack Bootcamps</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Flutter Mobile App</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Database Engineering</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold mb-6 text-lg">System</h4>
            <ul className="flex flex-col gap-4 text-[#C2C2C2] text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Architecture Overview</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certification Logic</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Evaluation Engine</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Google OAuth Specs</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-serif font-bold mb-6 text-lg">Resources</h4>
            <ul className="flex flex-col gap-4 text-[#C2C2C2] text-sm">
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Student Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#C2C2C2]">
          <p>© 2026 iSoftware Lab Academy. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">X</span>
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">in</span>
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">GH</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
