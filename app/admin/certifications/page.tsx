"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  Award, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  MoreVertical,
  Calendar,
  Layers,
  Users
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockCertifications = [
  { id: 1, user: "Sarah Johnson", course: "Advanced React Patterns", date: "Jan 12, 2024", id_code: "CERT-RX-1240", status: "Verified" },
  { id: 2, user: "Michael Chen", course: "UI/UX Masterclass", date: "Feb 05, 2024", id_code: "CERT-UX-850", status: "Verified" },
  { id: 3, user: "Elena Rodriguez", course: "Node.js Architecture", date: "Mar 15, 2024", id_code: "CERT-NJ-420", status: "Pending" },
  { id: 4, user: "David Wilson", course: "Fullstack Masterclass", date: "Mar 22, 2024", id_code: "CERT-FS-210", status: "Verified" },
];

export default function CertificationsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Certifications</h1>
          <p className="text-gray-400 mt-1">Track and manage certificates issued to students.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">
          <Download size={18} />
          <span>Download Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <Award className="text-[#EBBB54]" size={24} />
            <p className="text-2xl font-bold">1,240</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Issued</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <ShieldCheck className="text-green-400" size={24} />
            <p className="text-2xl font-bold">1,180</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Verified</p>
         </div>
         <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <Calendar className="text-blue-400" size={24} />
            <p className="text-2xl font-bold">85</p>
            <p className="text-xs text-gray-500 uppercase font-bold">This Month</p>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="relative flex-1 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
               <input type="text" placeholder="Search by name or certificate ID..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#EBBB54]/50" />
            </div>
            <button className="p-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:text-white transition-all">
               <Filter size={18} />
            </button>
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
                  {mockCertifications.map((cert) => (
                     <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#EBBB54]/10 flex items-center justify-center text-[#EBBB54] text-xs font-bold">
                                 {cert.user.charAt(0)}
                              </div>
                              <span className="text-sm font-semibold text-white group-hover:text-[#EBBB54] transition-colors">{cert.user}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{cert.course}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{cert.date}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{cert.id_code}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all" title="Verified status">
                                 <ShieldCheck size={18} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-[#EBBB54] hover:bg-white/10 rounded-lg transition-all" title="Download certificate">
                                 <Download size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
