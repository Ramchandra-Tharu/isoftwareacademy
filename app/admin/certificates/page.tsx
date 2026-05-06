"use client";

import React from "react";
import { 
  Award, 
  Settings, 
  CheckCircle, 
  Search, 
  Download,
  Eye,
  FileBadge
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CertificatesPage() {
  const certificates = [
    { id: "CERT-001", user: "Alex Johnson", assessment: "Frontend Engineering Core", issueDate: "Oct 24, 2026", status: "Verified" },
    { id: "CERT-002", user: "Sarah Smith", assessment: "Backend Architecture", issueDate: "Oct 22, 2026", status: "Verified" },
    { id: "CERT-003", user: "Michael Chen", assessment: "Database Design Principles", issueDate: "Oct 20, 2026", status: "Pending Verification" },
    { id: "CERT-004", user: "Emily Davis", assessment: "Cloud Deployment Practices", issueDate: "Oct 18, 2026", status: "Verified" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Certificate_Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Automatic generation, verification, and template customization.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn-secondary flex items-center gap-2 text-xs bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              <Settings size={16} /> Templates
           </button>
           <button className="btn-primary flex items-center gap-2 text-xs bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
              <FileBadge size={16} /> Issue Certificate
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <div className="card-premium p-6 border-l-4 border-l-blue-500">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Issued</h3>
            <p className="text-3xl font-black tracking-tighter text-gray-900">1,245</p>
         </div>
         <div className="card-premium p-6 border-l-4 border-l-emerald-500">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Verified Authenticity</h3>
            <p className="text-3xl font-black tracking-tighter text-gray-900">1,180</p>
         </div>
         <div className="card-premium p-6 border-l-4 border-l-amber-500">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Generation</h3>
            <p className="text-3xl font-black tracking-tighter text-gray-900">12</p>
         </div>
      </div>

      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <h4 className="text-xl font-black tracking-tight uppercase">Recent_Issuances</h4>
            <div className="flex gap-4 items-center">
               <div className="relative group w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm" placeholder="Search by ID or Candidate..." />
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">ID</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Candidate</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Issue Date</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="group hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <span className="text-xs font-black text-gray-900">{cert.id}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-sm font-bold text-gray-700">{cert.user}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-500">{cert.assessment}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cert.issueDate}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             {cert.status === "Verified" ? <CheckCircle size={14} className="text-emerald-500" /> : <Award size={14} className="text-amber-500" />}
                             <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                cert.status === "Verified" ? "text-emerald-600" : "text-amber-600"
                             )}>{cert.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Eye size={16} />
                             </button>
                             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Download size={16} />
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
