"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Menu, X, ChevronDown, CheckCircle2, ShieldCheck, 
  Search, Download, Award, Zap, Layout, BookOpen, User, 
  ArrowRight, Share2, Code2, Play
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [verifyId, setVerifyId] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");

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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId.trim()) return;

    setVerifyStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      // Dummy logic: if ID is longer than 6 chars, it's valid, else invalid
      if (verifyId.trim().length > 6) {
        setVerifyStatus("valid");
      } else {
        setVerifyStatus("invalid");
      }
    }, 1500);
  };

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
            <div className="relative group py-4">
              <button className="nav-link flex items-center gap-1">
                Courses <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 mt-[-8px]">
                <Link href="/courses?type=free" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Free Course</Link>
                <Link href="/courses" className="block px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1A4B6B]">Premium Course</Link>
              </div>
            </div>
            <Link href="/certificates" className="nav-link text-[#1A4B6B]">Certification</Link>
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
            <div className="flex flex-col gap-4">
              <span className="text-lg font-bold text-slate-400">Courses</span>
              <Link href="/courses?type=free" className="text-lg font-bold pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Free Course</Link>
              <Link href="/courses" className="text-lg font-bold pl-4 border-l-2 border-slate-100" onClick={() => setMobileMenuOpen(false)}>Premium Course</Link>
            </div>
            <Link href="/certificates" className="text-lg font-bold text-[#1A4B6B]" onClick={() => setMobileMenuOpen(false)}>Certification</Link>
            <Link href="#" className="text-lg font-bold">Mocks</Link>
            <Link href="#" className="text-lg font-bold">Results</Link>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6 bg-slate-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-40 opacity-5 hidden lg:block"><Award size={400} /></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-[#1A4B6B] font-bold text-sm">
                <CheckCircle2 size={16} /> Industry Recognized
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Earn Free <br />
                <span className="text-[#4270BD]">Verified</span> <br />
                Certificates
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                Boost your resume with industry-recognized certificates. Complete our comprehensive courses and prove your skills to top tech companies.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={handleStartLearning}
                  className="bg-[#1A4B6B] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#153a54] transition-all hover:-translate-y-1 shadow-lg shadow-blue-900/20"
                >
                  Start Learning for Free
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1A4B6B]/20 to-transparent rounded-3xl blur-3xl transform -rotate-6"></div>
              <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
                 {/* Mock Certificate Preview */}
                 <div className="border-8 border-double border-slate-200 p-8 text-center space-y-6">
                    <div className="flex justify-center mb-4">
                       <img src="/uploads/logo.png" alt="Logo" className="w-16 h-16 object-contain opacity-80" />
                    </div>
                    <h3 className="text-3xl font-serif text-slate-800 uppercase tracking-widest">Certificate of Completion</h3>
                    <p className="text-slate-500 italic">This is to certify that</p>
                    <h2 className="text-4xl font-bold text-[#1A4B6B]">John Doe</h2>
                    <p className="text-slate-500 italic">has successfully completed the course</p>
                    <h4 className="text-2xl font-bold text-slate-800">Advanced Data Structures & Algorithms</h4>
                    <div className="flex justify-between items-end mt-12 pt-8 border-t border-slate-200 text-sm font-bold text-slate-400">
                       <div>Date: <span className="text-slate-600">October 15, 2026</span></div>
                       <div>ID: <span className="text-slate-600">ISL-1029384</span></div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">How to get <span className="text-[#4270BD]">Certified?</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Just three simple steps stand between you and your professional certification.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
             {[
               { icon: <BookOpen className="text-[#4270BD]" size={32} />, title: "1. Enroll in a Course", desc: "Choose from our wide range of free and premium industry-aligned courses." },
               { icon: <Code2 className="text-[#4270BD]" size={32} />, title: "2. Complete Learning", desc: "Watch lectures, solve problems, and finish all required modules in the curriculum." },
               { icon: <Award className="text-[#4270BD]" size={32} />, title: "3. Get Certified", desc: "Pass the final assessment and automatically receive your verifiable certificate." }
             ].map((step, i) => (
               <div key={i} className="text-center space-y-6 p-8 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                     {step.icon}
                  </div>
                  <h4 className="text-2xl font-bold">{step.title}</h4>
                  <p className="text-slate-500">{step.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Verify Certificate Section */}
        <section className="py-32 px-6 bg-[#1A4B6B] text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')] opacity-10 mix-blend-overlay object-cover" />
           <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-12 space-y-4">
                 <ShieldCheck size={48} className="mx-auto text-blue-300" />
                 <h2 className="text-4xl font-bold">Verify a Certificate</h2>
                 <p className="text-blue-100 text-lg max-w-2xl mx-auto">Enter the unique Certificate ID to verify its authenticity and check the details of the credential.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-slate-800 max-w-2xl mx-auto">
                 <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                       <label htmlFor="verifyId" className="block text-sm font-bold text-slate-600">Certificate ID</label>
                       <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                          <input 
                             type="text" 
                             id="verifyId"
                             value={verifyId}
                             onChange={(e) => setVerifyId(e.target.value)}
                             placeholder="e.g. ISL-1234567"
                             className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 focus:border-[#4270BD] focus:outline-none transition-colors font-mono text-lg"
                             required
                          />
                       </div>
                    </div>
                    <button 
                       type="submit" 
                       disabled={verifyStatus === "loading"}
                       className="w-full bg-[#4270BD] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#325ca3] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                       {verifyStatus === "loading" ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : "Verify Now"}
                    </button>
                 </form>

                 {/* Verification Results */}
                 {verifyStatus === "valid" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex gap-4 items-start">
                       <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                       <div>
                          <h4 className="text-lg font-bold text-green-800">Certificate is Valid!</h4>
                          <p className="text-green-700 text-sm mt-1">This certificate was officially issued by iSoftware Lab.</p>
                          <div className="mt-4 space-y-2 text-sm text-green-900 bg-white/50 p-4 rounded-xl">
                             <div className="flex justify-between border-b border-green-200/50 pb-2">
                                <span className="font-semibold opacity-70">Recipient:</span>
                                <span className="font-bold">John Doe</span>
                             </div>
                             <div className="flex justify-between border-b border-green-200/50 pb-2">
                                <span className="font-semibold opacity-70">Course:</span>
                                <span className="font-bold text-right">Data Structures & Algo</span>
                             </div>
                             <div className="flex justify-between pt-1">
                                <span className="font-semibold opacity-70">Issue Date:</span>
                                <span className="font-bold">Oct 15, 2026</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {verifyStatus === "invalid" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex gap-4 items-start">
                       <X className="text-red-600 flex-shrink-0 mt-1" size={24} />
                       <div>
                          <h4 className="text-lg font-bold text-red-800">Certificate Not Found</h4>
                          <p className="text-red-700 text-sm mt-1">We couldn't find a certificate matching the ID "{verifyId}". Please check the ID and try again, ensuring there are no typos.</p>
                       </div>
                    </motion.div>
                 )}
              </div>
           </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-6">
           <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center">
                 <h2 className="text-4xl font-bold">Why get <span className="text-[#4270BD]">Certified?</span></h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { icon: <Award className="text-[#4270BD]" size={24} />, title: "100% Free", desc: "No hidden costs. Complete the free courses and earn your certificate without paying a dime." },
                   { icon: <Zap className="text-[#4270BD]" size={24} />, title: "Industry Relevant", desc: "Our curriculum is designed by engineers from top MAANG companies to ensure relevance." },
                   { icon: <Share2 className="text-[#4270BD]" size={24} />, title: "Easily Shareable", desc: "Add your certificate directly to your LinkedIn profile with one click." },
                   { icon: <Download className="text-[#4270BD]" size={24} />, title: "Instant Download", desc: "Download high-quality PDF versions of your certificates instantly upon completion." }
                 ].map((benefit, i) => (
                   <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow space-y-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                         {benefit.icon}
                      </div>
                      <h4 className="text-xl font-bold">{benefit.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 bg-slate-900 text-white text-center">
           <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to earn your first certificate?</h2>
              <p className="text-slate-400 text-lg">Join thousands of students who have upgraded their skills and landed jobs at top tech companies.</p>
              <button 
                 onClick={handleStartLearning}
                 className="bg-[#4270BD] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#325ca3] transition-all hover:-translate-y-1 inline-flex items-center gap-2"
              >
                 Get Started Now <ArrowRight size={20} />
              </button>
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
                <Link href="/courses" className="hover:text-[#4270BD] font-medium transition-colors">Premium Courses</Link>
                <Link href="/courses?type=free" className="hover:text-[#4270BD] font-medium transition-colors">Free Courses</Link>
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
