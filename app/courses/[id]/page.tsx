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
  Lock
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CheckoutButton from "@/components/dashboard/CheckoutButton";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PublicCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Coupon State
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
      <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#EBBB54]" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Initializing_Secure_Gateway...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center uppercase font-black tracking-widest">Course Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#EBBB54] selection:text-black font-sans pb-20">
      {/* 1. Hero Header */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-[#EBBB54]/5 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#EBBB54]">
                  <span className="w-2 h-2 rounded-full bg-[#EBBB54] animate-pulse"></span> {course.category} Track
               </div>
               
               <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                  {course.title}
               </h1>
               
               <p className="text-lg text-[#C2C2C2] leading-relaxed max-w-xl">
                  {course.description}
               </p>

               <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                     </div>
                     <span className="text-xs font-bold text-gray-400"><span className="text-white">1.2k+</span> Enrolled</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-1.5">
                     <Star size={14} className="text-[#EBBB54] fill-[#EBBB54]" />
                     <span className="text-xs font-bold">4.9 (850 Reviews)</span>
                  </div>
               </div>
            </div>

            {/* Sticky Pricing Card */}
            <div className="lg:sticky lg:top-32 h-fit bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl shadow-black">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mastery Package</p>
                  <div className="flex items-end gap-3">
                     <h2 className="text-5xl font-black tracking-tighter">₹{couponData ? couponData.finalAmount : course.price}</h2>
                     <span className="text-lg text-gray-600 line-through mb-1.5 font-bold">₹{course.price * 2}</span>
                     <span className="mb-2 px-2 py-0.5 bg-green-500 text-black text-[10px] font-black rounded uppercase">50% OFF</span>
                  </div>
                  {couponData && (
                    <p className="text-xs font-black text-green-500 uppercase tracking-widest mt-2 animate-pulse">
                      Coupon Applied: -₹{couponData.discount}
                    </p>
                  )}
               </div>

               {/* Coupon Input */}
               {!isEnrolled && session && !couponData && (
                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 pr-1 focus-within:border-[#EBBB54]/30 transition-all">
                    <input 
                      type="text" 
                      placeholder="ENTER_COUPON" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest px-4 py-2 flex-1 outline-none"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={applying}
                      className="px-4 py-2 bg-white/10 hover:bg-[#EBBB54] hover:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                       {applying ? "..." : "APPLY"}
                    </button>
                 </div>
               )}
               {couponError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center">{couponError}</p>}

               <div className="space-y-4">
                  {isEnrolled ? (
                    <Link href={`/dashboard/courses/${course.slug || course._id}`} className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition-all shadow-xl shadow-green-600/10 uppercase text-xs tracking-widest">
                       <PlayCircle size={20} /> Resume_Learning
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
                    <Link href="/get-started" className="w-full flex items-center justify-center gap-3 py-4 bg-[#EBBB54] text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#EBBB54]/20 uppercase text-xs tracking-widest">
                       <Lock size={20} /> Login_to_Enroll
                    </Link>
                  )}
                  <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">Secure 256-bit Encrypted Transaction</p>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Includes:</p>
                  <ul className="space-y-3">
                     {[
                        { icon: Video, label: "Full Course Access" },
                        { icon: BookOpen, label: "Digital Documentation" },
                        { icon: Award, label: "Verifiable Certificate" },
                        { icon: Users, label: "Community Access" }
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                           <CheckCircle2 size={16} className="text-[#EBBB54]" /> {item.label}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 2. Course Highlights */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 py-10">
         {[
            { label: "Duration", val: course.duration || "24h Content", icon: Clock },
            { label: "Lessons", val: `${course.lessons?.length || 12} Modules`, icon: BookOpen },
            { label: "Skill Level", val: "Beginner-Pro", icon: Award },
            { label: "Status", val: "Lifetime Access", icon: ShieldCheck }
         ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EBBB54] group-hover:scale-110 transition-transform">
                  <stat.icon size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-sm font-bold text-white">{stat.val}</p>
               </div>
            </div>
         ))}
      </section>

      {/* 3. Curriculum Section */}
      <section className="max-w-4xl mx-auto px-6 py-24">
         <h2 className="text-3xl font-serif font-bold mb-10 text-center">Course Curriculum</h2>
         <div className="space-y-4">
            {course.lessons?.length > 0 ? (
               course.lessons.map((lesson: any, i: number) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-all group">
                     <div className="flex items-center gap-6">
                        <span className="text-xl font-serif font-bold text-gray-800 group-hover:text-[#EBBB54]/30 transition-colors">0{i+1}</span>
                        <div>
                           <h4 className="font-bold text-white group-hover:text-[#EBBB54] transition-colors">{lesson.title}</h4>
                           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Technical Module</p>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-gray-800 group-hover:text-white transition-all" />
                  </div>
               ))
            ) : (
               <div className="text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-gray-600 italic">Curriculum details coming soon.</div>
            )}
         </div>
      </section>
    </div>
  );
}

function Video(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}
