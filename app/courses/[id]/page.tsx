"use client";

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Star,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CheckoutButton from "@/components/dashboard/CheckoutButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PublicCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        if (session) {
           const enrollRes = await fetch(`/api/enrollments/check?itemId=${data._id}`);
           if (enrollRes.ok) {
              const enrollData = await enrollRes.json();
              setIsEnrolled(enrollData.isEnrolled);
           }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    setCouponError("");
    try {
       const res = await fetch("/api/coupons/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode, amount: course.price })
       });
       const data = await res.json();
       if (res.ok) {
          setCouponData(data);
       } else {
          setCouponError(data.error);
       }
    } catch (err) {
       setCouponError("Failed to apply coupon");
    } finally {
       setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 font-sans">Syncing_Catalog_Data...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center uppercase font-black tracking-widest text-xs">Registry_Entry_Not_Found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900 font-sans pb-32">
      {/* Navigation Header */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
             <Star size={18} fill="currentColor" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
        </Link>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all flex items-center gap-2">
           <ArrowRight size={14} className="rotate-180" /> Back_To_Grid
        </Link>
      </nav>

      {/* 1. Hero Header */}
      <section className="relative pt-24 pb-20 px-8 overflow-hidden bg-white border-b border-gray-100">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm flex items-center gap-2">
                     <Sparkles size={14} /> {course.category} Certification
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Star size={16} className="text-amber-400 fill-amber-400" />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4.9 Mastery Rating</span>
                  </div>
               </div>
               
               <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900 uppercase">
                  {course.title}
               </h1>
               
               <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                  {course.description}
               </p>

               <div className="flex flex-wrap items-center gap-10 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-gray-100 shadow-sm" />)}
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="text-gray-900 font-black">1.2k+</span> Active Deployments
                     </p>
                  </div>
                  <div className="h-10 w-px bg-gray-100" />
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Zap size={18} className="text-blue-600" /> Multi-Modal Content
                  </div>
               </div>
            </div>

            {/* Sticky Pricing Card */}
            <div className="lg:sticky lg:top-32 h-fit bg-white border border-gray-100 rounded-[3rem] p-12 space-y-10 shadow-2xl shadow-blue-600/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <Award size={200} />
               </div>
               
               <div className="space-y-2 relative z-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment_Protocol</p>
                  <div className="flex items-end gap-3">
                     <h2 className="text-6xl font-black tracking-tighter text-gray-900">₹{couponData ? couponData.finalAmount : course.price}</h2>
                     <span className="text-xl text-gray-300 line-through mb-2 font-black tracking-tighter">₹{course.price * 2}</span>
                     <span className="mb-3 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">50% DISCOUNT</span>
                  </div>
                  {couponData && (
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-4 animate-pulse bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">
                      Voucher Applied: -₹{couponData.discount}
                    </p>
                  )}
               </div>

               {/* Coupon Input */}
               {!isEnrolled && session && !couponData && (
                 <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl p-1.5 focus-within:border-blue-100 focus-within:bg-white transition-all shadow-inner relative z-10">
                    <input 
                      type="text" 
                      placeholder="ENTER_VOUCHER_CODE" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest px-5 py-3 flex-1 outline-none text-gray-900 placeholder:text-gray-300"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={applying}
                      className="px-6 py-3 bg-white border border-gray-200 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                    >
                       {applying ? "..." : "Validate"}
                    </button>
                 </div>
               )}
               {couponError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center animate-shake">{couponError}</p>}

               <div className="space-y-4 relative z-10">
                  {isEnrolled ? (
                    <Link href={`/dashboard/courses/${course.slug || course._id}`} className="w-full flex items-center justify-center gap-4 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:scale-[1.02] transition-all shadow-2xl shadow-blue-600/20 uppercase text-[10px] tracking-[0.2em]">
                       <PlayCircle size={22} /> Resume_Module_Engagement
                    </Link>
                  ) : session ? (
                    <CheckoutButton 
                      itemId={course._id} 
                      itemType="course" 
                      price={couponData ? couponData.finalAmount : course.price} 
                      title={course.title}
                      couponId={couponData?.couponId}
                    />
                  ) : (
                    <Link href="/get-started" className="w-full flex items-center justify-center gap-4 py-5 bg-gray-900 text-white font-black rounded-[1.5rem] hover:scale-[1.02] transition-all shadow-2xl shadow-gray-900/10 uppercase text-[10px] tracking-[0.2em]">
                       <Lock size={22} /> Initialize_Access
                    </Link>
                  )}
                  <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Encrypted_Transaction_Verified</p>
               </div>

               <div className="space-y-6 pt-10 border-t border-gray-50 relative z-10">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Resource_Bundle:</p>
                  <ul className="grid grid-cols-1 gap-4">
                     {[
                        { label: "Multimodal Learning Hub", icon: BookOpen },
                        { label: "Source Code Registry", icon: CheckCircle2 },
                        { label: "Blockchain Verified ID", icon: Award },
                        { label: "Global Dev Community", icon: Users }
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <item.icon size={18} className="text-blue-600" /> {item.label}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 2. Course Highlights */}
      <section className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-8 py-20">
         {[
            { label: "Total Runtime", val: course.duration || "24h Content", icon: Clock },
            { label: "Modular Units", val: `${course.lessons?.length || 12} Lessons`, icon: BookOpen },
            { label: "Difficulty Scale", val: "Level 1-10", icon: Zap },
            { label: "Access Protocol", val: "Infinite Duration", icon: ShieldCheck }
         ].map((stat, i) => (
            <div key={i} className="flex items-center gap-5 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:border-blue-100 transition-all group">
               <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <stat.icon size={22} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{stat.val}</p>
               </div>
            </div>
         ))}
      </section>

      {/* 3. Curriculum Section */}
      <section className="max-w-4xl mx-auto px-8 py-24 bg-white rounded-[4rem] border border-gray-100 shadow-xl shadow-blue-600/5 mb-32">
         <div className="text-center space-y-4 mb-20">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Section_02. CURRICULUM_GRID</h2>
            <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Academic Modules.</h3>
         </div>
         <div className="space-y-6">
            {course.lessons?.length > 0 ? (
               course.lessons.map((lesson: any, i: number) => (
                  <div key={i} className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem] flex items-center justify-between hover:bg-white hover:border-blue-100 transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-600/5">
                     <div className="flex items-center gap-8">
                        <span className="text-4xl font-black text-gray-100 group-hover:text-blue-600/10 transition-colors tracking-tighter">0{i+1}</span>
                        <div>
                           <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none mb-2">{lesson.title}</h4>
                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                              <Clock size={12} /> {lesson.duration || "45m"} // TECHNICAL_UNIT
                           </p>
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-200 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shadow-sm">
                        <ChevronRight size={22} />
                     </div>
                  </div>
               ))
            ) : (
               <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Curriculum_Registry_Locked</p>
               </div>
            )}
         </div>
      </section>
    </div>
  );
}
