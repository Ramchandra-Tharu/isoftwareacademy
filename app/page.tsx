"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  Play,
  CheckCircle2,
  Users,
  Star,
  ArrowRight,
  BookOpen,
  Code2,
  Terminal,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartLearning = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/get-started");
    }
  };

  const tracks = [
    {
      title: "Core DSA & CP",
      desc: "Master Algorithms, Data Structures and Competitive Programming from Scratch.",
      features: ["300+ Problems", "Live Mentorship", "Interview Ready"],
      gradient: "from-blue-600 to-indigo-700",
    },
    {
      title: "Full Stack Web Dev",
      desc: "Build professional grade projects with React, Next.js, Node.js and more.",
      features: ["8+ Projects", "Frontend + Backend", "Deployment"],
      gradient: "from-indigo-600 to-purple-700",
    },
    {
      title: "Interview Bootcamp",
      desc: "Intensive 4-week program covering frequently asked interview patterns.",
      features: ["Mock Interviews", "System Design", "OS & DBMS"],
      gradient: "from-purple-600 to-pink-700",
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-blue-100">
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
            <Link href="/courses" className="nav-link">Premium</Link>
            <Link href="#" className="nav-link">Mocks</Link>
            <Link href="#" className="nav-link">Results</Link>
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
            <Link href="/courses" className="text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Premium</Link>
            <Link href="#" className="text-lg font-bold">Mocks</Link>
            <Link href="#" className="text-lg font-bold">Results</Link>

          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Cracking Top <br />
                <span className="text-[#4270BD]">Software Jobs</span> <br />
                made Simple!
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                iSoftware Lab offers a world-class curriculum, live mentorship, and a gamified platform to help you master DSA, Development, and beyond.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={handleStartLearning}
                  className="bg-[#1A4B6B] text-white px-10 py-4 rounded-xl text-lg font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
                >
                  Start Learning <ChevronRight size={20} />
                </button>
                <button className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">
                  Join Now
                </button>
              </div>
              
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Student" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-slate-500">Joined by 20,000+ ambitious developers</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#4270BD]/5 blur-[100px] rounded-full -z-10" />
              <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070" 
                  alt="iSoftware Lab Platform" 
                  className="rounded-2xl w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl text-[#1A4B6B] cursor-pointer hover:scale-110 transition-transform">
                      <Play fill="currentColor" size={32} />
                   </div>
                </div>
              </div>

              {/* Floating Logos Collage */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 grid grid-cols-3 gap-4">
                 {['Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Apple'].map(company => (
                    <div key={company} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{company}</div>
                 ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tracks Section */}
        <section className="py-24 bg-slate-50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-[#4270BD] font-bold uppercase tracking-widest text-sm">Select Your Path</h2>
              <h3 className="text-4xl md:text-5xl font-bold">World-Class Learning Tracks</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {tracks.map((track, i) => (
                <div key={i} className="card-premium group overflow-hidden flex flex-col h-full">
                  <div className={`h-2 bg-gradient-to-r ${track.gradient}`} />
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <h4 className="text-2xl font-bold">{track.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{track.desc}</p>
                    </div>
                    <ul className="space-y-3 flex-1">
                      {track.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <CheckCircle2 className="text-green-500" size={16} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold group-hover:bg-[#1A4B6B] group-hover:text-white transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="py-32 px-6">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-4xl font-bold">Why Developers Love <span className="text-[#4270BD]">iSoftware Lab?</span></h2>
                    <p className="text-slate-500 leading-relaxed">We don't just teach code. We build careers with a structured approach that mirrors actual software engineering workflows.</p>
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { icon: <Users />, title: "Live Mentorship", desc: "Interact with seniors from top tech firms directly." },
                      { icon: <Star />, title: "Gamified Learning", desc: "Earn badges and compete on global leaderboards." },
                      { icon: <BookOpen />, title: "360° Curriculum", desc: "From basic syntax to advanced system design." },
                      { icon: <Terminal />, title: "Built-in IDE", desc: "Code, test, and debug without leaving the browser." }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                         <div className="text-[#4270BD]">{item.icon}</div>
                         <h5 className="font-bold">{item.title}</h5>
                         <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#1A4B6B] rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-20 opacity-10"><Star size={200} /></div>
                 <div className="relative z-10 space-y-8">
                    <h4 className="text-3xl font-bold leading-tight">Ready to join the elite?</h4>
                    <p className="text-blue-100/80">Get access to mock interviews, resume reviews, and referrals to top product-based companies.</p>
                    <button onClick={handleStartLearning} className="bg-white text-[#1A4B6B] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all">
                       Explore Premium
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Booklet Section */}
          <div className="bg-white rounded-3xl p-10 mb-24 grid md:grid-cols-2 gap-12 items-center text-[#0F172A]">
             <div className="space-y-6">
                <h3 className="text-3xl font-bold">Download our <span className="text-[#4270BD]">Interview Guide</span></h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                   {['HR Questions', 'Resume Tips', 'Salary Negotiation', 'Behavioral Prep'].map(t => (
                      <li key={t} className="flex items-center gap-2 text-sm font-bold">
                         <CheckCircle2 className="text-[#4270BD]" size={16} /> {t}
                      </li>
                   ))}
                </ul>
                <div className="flex gap-2">
                   <input type="email" placeholder="Enter your email" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4270BD]" />
                   <button className="bg-[#1A4B6B] text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap">Send Me</button>
                </div>
             </div>
             <div className="hidden md:block">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2070" className="rounded-2xl h-48 w-full object-cover" alt="Guide" />
             </div>
          </div>

          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <img src="/uploads/logo.png" alt="iSoftware Lab Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-white">iSoftware Lab</span>
              </div>
              <p className="text-sm leading-relaxed">The algorithm to become awesome at DSA & CP. Built by experts from MAANG companies.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.779h-2.955v-3.437h2.955v-2.538c0-2.926 1.787-4.52 4.398-4.52 1.251 0 2.327.093 2.639.135v3.061l-1.811.001c-1.42 0-1.696.675-1.696 1.666v2.195h3.389l-.441 3.437h-2.948v8.779h6.116c.733 0 1.326-.593 1.326-1.324v-21.351c0-.732-.593-1.325-1.326-1.325z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186c-.273-1.029-1.082-1.838-2.111-2.111-1.861-.501-9.387-.501-9.387-.501s-7.526 0-9.387.501c-1.029.273-1.838 1.082-2.111 2.111-.501 1.861-.501 5.814-.501 5.814s0 3.953.501 5.814c.273 1.029 1.082 1.838 2.111 2.111 1.861.501 9.387.501 9.387.501s7.526 0 9.387-.501c1.029-.273 1.838-1.082 2.111-2.111.501-1.861.501-5.814.501-5.814s0-3.953-.501-5.814zm-14.831 7.147v-4.666l6.064 2.333-6.064 2.333z"/></svg>
                </a>
                <MessageSquare className="hover:text-white cursor-pointer transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs">Company</h5>
              <ul className="space-y-4 text-sm font-semibold">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blogs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs">Programs</h5>
              <ul className="space-y-4 text-sm font-semibold">
                <li><Link href="#" className="hover:text-white transition-colors">Dev Track</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">DSA Course</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Mock Tests</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Workshops</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs">Contact</h5>
              <p className="text-sm font-semibold">support@algozenith.com</p>
              <p className="text-sm font-semibold">+91 98765 43210</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-12 text-center text-xs font-bold uppercase tracking-widest">
            © 2026 iSoftware Lab. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
