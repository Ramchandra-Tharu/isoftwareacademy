"use client";

import React, { useEffect, useState } from "react";
import { 
  Award, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Search,
  Filter,
  Trophy,
  Star,
  Zap,
  Loader2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useSession } from "next-auth/react";

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper because of constant issues
  const TROPHY = Trophy;
  const AWARD = Award;
  const STAR = Star;
  const ZAP = Zap;

  const certStats = [
    { title: "Total Earned", value: 3, icon: TROPHY, description: "professional certs", trend: "+1 this month", trendType: "positive" },
    { title: "Skill Badges", value: 12, icon: AWARD, description: "earned from quizzes", trend: "Level 4", trendType: "positive" },
    { title: "Course Rank", value: "Top 2%", icon: STAR, description: "global standing", trend: "Expert", trendType: "positive" },
    { title: "Learning Points", value: "4,250", icon: ZAP, description: "total XP earned", trend: "+450", trendType: "positive" },
  ] as const;

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/certificates?userId=${session.user.id}`);
        const data = await res.json();
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
       fetchCertificates();
    } else {
       setLoading(false);
    }
  }, [session?.user?.id]);

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-bold font-serif text-white mb-2">My Certifications</h1>
           <p className="text-gray-400">Official documentation of your skills and achievements.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search certificates..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#EBBB54]/50 transition-all"
              />
           </div>
           <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {certStats.map((stat, i) => (
           <StatsCard key={i} {...stat} />
         ))}
      </div>

      {/* Certificates Grid */}
      <div className="space-y-6">
         <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-[#EBBB54]" /> Verified Achievements
         </h3>

         {loading ? (
           <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
              <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
              <p>Authenticating certificates...</p>
           </div>
         ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div key={cert._id} className="group bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#EBBB54]/30 hover:bg-[#222222] transition-all duration-500 relative overflow-hidden flex flex-col space-y-6">
                 {/* Decorative background logo */}
                 <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Award size={150} />
                 </div>

                 <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBBB54]/10 flex items-center justify-center text-[#EBBB54] border border-[#EBBB54]/20">
                       <Award size={24} />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Issued on</p>
                       <p className="text-sm font-bold text-white">{new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                 </div>

                 <div className="space-y-1 relative z-10">
                    <h4 className="text-lg font-bold text-white group-hover:text-[#EBBB54] transition-colors leading-tight">
                       {cert.metadata?.courseTitle || cert.courseId?.title || "Course Certificate"}
                    </h4>
                    <p className="text-xs text-gray-500 italic">Certificate ID: {cert.certificateId}</p>
                 </div>

                 <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                          <ShieldCheck size={12} />
                       </div>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/10">
                          <ExternalLink size={16} />
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-[#EBBB54] text-black rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg">
                          <Download size={14} /> Download
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
         ) : (
           <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-gray-600 gap-4">
              <Award size={48} className="opacity-10" />
              <div className="text-center">
                 <p className="font-bold text-lg text-gray-500">No Certificates Yet</p>
                 <p className="text-sm">Complete a course or pass an assessment to earn your first certification.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
