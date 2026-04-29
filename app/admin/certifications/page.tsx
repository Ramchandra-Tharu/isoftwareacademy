"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Award, 
  Download, 
  ShieldCheck, 
  Filter, 
  Calendar,
  Trash2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockCertifications = []; // Will be replaced by live data

export default function CertificationsPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCertificates();
      } else {
        alert("Failed to revoke certificate");
      }
    } catch (err) {
      alert("Error revoking certificate");
    }
  };

  const filteredCerts = certificates.filter(cert => {
    const term = search.toLowerCase();
    const studentName = cert.metadata?.studentName || cert.userId?.name || "";
    return studentName.toLowerCase().includes(term) || cert.certificateId.toLowerCase().includes(term);
  });

  const totalIssued = certificates.length;
  const thisMonth = certificates.filter(c => {
    const certDate = new Date(c.issueDate);
    const now = new Date();
    return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Certifications</h1>
          <p className="text-gray-400 mt-1">Track and manage certificates issued to students.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <Award className="text-[#EBBB54]" size={24} />
            <p className="text-2xl font-bold">{totalIssued}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Issued</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <ShieldCheck className="text-green-400" size={24} />
            <p className="text-2xl font-bold">{totalIssued}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Verified</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <Calendar className="text-blue-400" size={24} />
            <p className="text-2xl font-bold">{thisMonth}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">This Month</p>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="relative flex-1 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name or certificate ID..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#EBBB54]/50 text-white" 
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Date</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Code</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : filteredCerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No certificates found.</td>
                    </tr>
                  ) : filteredCerts.map((cert) => {
                     const studentName = cert.metadata?.studentName || cert.userId?.name || "Unknown";
                     const courseTitle = cert.metadata?.courseTitle || cert.courseId?.title || "Course";
                     return (
                     <tr key={cert._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#EBBB54]/10 flex items-center justify-center text-[#EBBB54] text-xs font-bold">
                                 {studentName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-white group-hover:text-[#EBBB54] transition-colors">{studentName}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{courseTitle}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(cert.issueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{cert.certificateId}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => window.open(`/certificates/${cert.certificateId}`, '_blank')} className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all" title="View Certificate">
                                 <ShieldCheck size={18} />
                              </button>
                              <button onClick={() => handleRevoke(cert._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Revoke Certificate">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
