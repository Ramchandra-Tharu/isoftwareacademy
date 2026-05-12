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
  const [search, setSearch] = useState("");

  const certCount = certificates.length;
  const latestDate = certCount > 0 
    ? new Date(Math.max(...certificates.map(c => new Date(c.issueDate).getTime())))
    : null;

  const certStats = [
    { title: "Total Earned", value: certCount, icon: Trophy, description: "Verified credentials" },
    { title: "Skill Status", value: certCount > 0 ? "Level Up" : "Awaiting", icon: Star, description: "Competency mark" },
    { title: "Latest Award", value: latestDate ? latestDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "None", icon: Award, description: "Most recent unlock" },
    { title: "Academic Sync", value: "100%", icon: ShieldCheck, description: "Zero integrity gaps" },
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

  const filteredCertificates = certificates.filter(cert => 
    (cert.metadata?.courseTitle || "").toLowerCase().includes(search.toLowerCase()) ||
    (cert.certificateId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Credentials_Library</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Authenticated documentation of system mastery and course clearance.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search IDs..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600 transition-all shadow-sm placeholder:text-gray-300"
              />
           </div>
           <button className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
              <Filter size={16} />
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
         <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
               <div className="w-1 h-5 bg-emerald-500 rounded-full"></div> Validated Artifacts
            </h3>
         </div>

         {loading ? (
           <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[10px] font-black tracking-widest uppercase">Parsing Signature Nodes...</p>
           </div>
         ) : filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <div key={cert._id} className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 relative overflow-hidden flex flex-col space-y-6">
                 {/* Decorative background logo */}
                 <div className="absolute -top-6 -right-6 p-4 opacity-[0.02] text-gray-900 pointer-events-none group-hover:opacity-5 transition-opacity">
                    <Award size={180} />
                 </div>

                 <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                       <Award size={22} />
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Timestamp</p>
                       <p className="text-xs font-bold text-gray-900">{new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                 </div>

                 <div className="space-y-2 relative z-10">
                    <h4 className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                       {cert.metadata?.courseTitle || cert.courseId?.title || "Course Certificate"}
                    </h4>
                    <p className="text-[9px] font-mono text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">ID: {cert.certificateId}</p>
                 </div>

                 <div className="pt-5 mt-auto border-t border-gray-50 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5">
                       <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                          <ShieldCheck size={11} />
                       </div>
                       <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Live Integrity</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/certificates/${cert.certificateId}`);
                            alert("Verification link copied to clipboard!");
                          }}
                          className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg transition-colors border border-gray-100 bg-white"
                          title="Share Link"
                       >
                          <ExternalLink size={14} />
                       </button>
                       <button 
                          onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-gray-900/10"
                       >
                          <Download size={12} /> Retrieve
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
         ) : (
           <div className="h-64 bg-white border border-gray-100 rounded-3xl border-dashed flex flex-col items-center justify-center text-gray-400 gap-4 shadow-sm">
              <Award size={48} className="opacity-10 text-gray-900" />
              <div className="text-center space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest text-gray-900">Zero Credentials Detected</p>
                 <p className="text-[10px] text-gray-500">Complete course tracks or execute valid assessments to earn artifacts.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
