"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Award, 
  Download, 
  ShieldCheck, 
  Filter, 
  Calendar,
  Trash2,
  Loader2,
  ExternalLink,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CertificationsPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/certificates");
      if (res.ok) setCertificates(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCertificates();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCerts = certificates.filter(cert => {
    const term = search.toLowerCase();
    const studentName = cert.metadata?.studentName || cert.userId?.name || "";
    return studentName.toLowerCase().includes(term) || cert.certificateId.toLowerCase().includes(term);
  });

  const stats = [
    { label: "Total Issued", val: certificates.length, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Blockchain Verified", val: certificates.length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Issued This Month", val: certificates.filter(c => new Date(c.issueDate).getMonth() === new Date().getMonth()).length, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verifying Credential Chain...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Credential_Registry</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Audit and manage verifiable certificates issued to students.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={14} /> Verification Engine Online
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="card-premium p-8 flex items-center gap-6 group">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg, item.color)}>
                <item.icon size={24} />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{item.val}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="FILTER_BY_NAME_OR_CODE..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-blue-100 focus:bg-white transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
           <Filter size={16} /> Registry_Filters
        </button>
      </div>

      {/* Certificate Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Recipient</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset_Unit</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Issued_At</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Registry_Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCerts.map((cert) => {
                const studentName = cert.metadata?.studentName || cert.userId?.name || "Unknown";
                const courseTitle = cert.metadata?.courseTitle || cert.courseId?.title || "Asset";
                return (
                  <tr key={cert._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-sm">
                          {studentName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{studentName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-lg border border-gray-100">{courseTitle}</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 font-mono text-[10px] text-gray-400 uppercase tracking-tighter">
                       {cert.certificateId}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
                             <ExternalLink size={16} />
                          </button>
                          <button onClick={() => handleRevoke(cert._id)} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCerts.length === 0 && (
           <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No registry entries found.</div>
        )}
      </div>
    </div>
  );
}
