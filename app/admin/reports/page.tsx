"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Filter, 
  FileSpreadsheet,
  File,
  Calendar,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const reports = [
    { id: "REP-101", name: "Global Candidate Performance Q3", type: "Performance", format: "Excel", date: "Oct 25, 2026", size: "1.2 MB" },
    { id: "REP-102", name: "Assessment Pass/Fail Rates", type: "Analytics", format: "PDF", date: "Oct 24, 2026", size: "845 KB" },
    { id: "REP-103", name: "Question Difficulty Item Analysis", type: "Item Analysis", format: "Excel", date: "Oct 20, 2026", size: "2.4 MB" },
    { id: "REP-104", name: "Certificate Issuance Ledger", type: "Compliance", format: "PDF", date: "Oct 15, 2026", size: "1.8 MB" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Data_Reports</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Export detailed insights on candidates, assessments, and system usage.</p>
        </div>
      </div>

      {/* Report Generator */}
      <div className="card-premium p-10 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
         <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
            <Filter size={16} className="text-blue-600" /> Custom Report Generator
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Report Type</label>
               <select className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm">
                  <option>Assessment Performance</option>
                  <option>Candidate Activity</option>
                  <option>Item Analysis (Questions)</option>
                  <option>System Usage Logs</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date Range</label>
               <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Last 30 Days" className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Target Assessment</label>
               <select className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-100 shadow-sm">
                  <option>All Assessments</option>
                  <option>Frontend Engineering Core</option>
                  <option>Backend Architecture</option>
                  <option>Database Design Principles</option>
               </select>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
               <div className="flex gap-2">
                  <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-xs bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
                     <FileSpreadsheet size={16} /> Excel
                  </button>
                  <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-xs bg-gray-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md shadow-gray-900/20">
                     <File size={16} /> PDF
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Generated Reports */}
      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <h4 className="text-xl font-black tracking-tight uppercase">Report_Archive</h4>
            <div className="flex gap-4 items-center">
               <div className="relative group w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-100 transition-all shadow-sm" placeholder="Search archives..." />
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Report Name</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Generated On</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Format & Size</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Download</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {reports.map((report) => (
                    <tr key={report.id} className="group hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0",
                                report.format === "Excel" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                             )}>
                                {report.format === "Excel" ? <FileSpreadsheet size={18} /> : <File size={18} />}
                             </div>
                             <div>
                                <span className="text-sm font-bold text-gray-900 block">{report.name}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{report.id}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-600">{report.type}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{report.date}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className={cn(
                                "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md",
                                report.format === "Excel" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                             )}>{report.format}</span>
                             <span className="text-[10px] font-bold text-gray-400">{report.size}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                             <Download size={16} />
                          </button>
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
