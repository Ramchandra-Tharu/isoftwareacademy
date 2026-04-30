import React from "react";
import dbConnect from "@/utils/db";
import Certificate from "@/models/Certificate";
import { Award, ShieldCheck, Printer, ArrowLeft, Cpu, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await dbConnect();
  
  const certificate = await Certificate.findOne({ certificateId: id })
    .populate("userId", "name email")
    .populate("courseId", "title");

  if (!certificate) {
    notFound();
  }

  const studentName = certificate.metadata?.studentName || certificate.userId?.name;
  const courseTitle = certificate.metadata?.courseTitle || certificate.courseId?.title;
  const issueDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Navbar / Controls */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-12 print:hidden bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-600/5">
        <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-blue-600 transition-all group text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return_To_Base
        </Link>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
               <Cpu size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">iSoftware_<span className="text-blue-600">Academy</span></span>
        </div>
        <button 
          className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20 text-[10px] uppercase tracking-widest"
        >
          <Printer size={18} />
          Dispatch_PDF
          <script dangerouslySetInnerHTML={{ __html: `document.currentScript.parentElement.onclick = () => window.print();` }} />
        </button>
      </div>

      {/* 2. Verification Badge */}
      <div className="mb-12 print:hidden inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm animate-in fade-in slide-in-from-top-4">
         <ShieldCheck size={18} /> Credentials_Verified_Secure
      </div>

      {/* 3. The Certificate Canvas */}
      <div className="w-full max-w-5xl bg-white text-gray-900 p-16 md:p-32 rounded-[4rem] shadow-2xl relative overflow-hidden print:shadow-none print:p-0 print:m-0 print:rounded-none border border-gray-100 mb-20">
        
        {/* Decorative Modern Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

        <div className="absolute inset-8 border border-gray-100 rounded-[3rem] print:border-2 pointer-events-none"></div>
        <div className="absolute inset-10 border-2 border-blue-600/10 rounded-[2.5rem] print:border-4 pointer-events-none"></div>

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none rotate-12">
          <Award size={800} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-16">
          
          {/* Header */}
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
               <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                  <Award size={40} />
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Credential_<span className="text-blue-600">Verification</span>
            </h1>
            <p className="text-[10px] font-black tracking-[0.6em] text-gray-400 uppercase">
              // ISOFTWARE_LAB_ACADEMY_SYSTEMS
            </p>
          </div>

          <div className="w-32 h-1 bg-blue-600/20 rounded-full"></div>

          {/* Recipient */}
          <div className="space-y-8">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">This electronic credential verifies that</p>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter capitalize text-gray-900 leading-none">
              {studentName}
            </h2>
          </div>

          {/* Body */}
          <div className="space-y-6 max-w-2xl">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
               has successfully completed all required modules and technical assessments for the professional track of
            </p>
            <h3 className="text-3xl font-black text-blue-600 uppercase tracking-tight leading-none">
              {courseTitle}
            </h3>
          </div>

          {/* Footer Grid */}
          <div className="w-full grid grid-cols-3 gap-12 pt-20 items-end">
            
            {/* Left Signature */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full border-b border-gray-100 pb-4 flex items-center justify-center">
                <span className="font-serif text-3xl italic text-gray-400">iSoftware_Academy</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Executive Director</p>
            </div>

            {/* Center Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full border-2 border-blue-600/10 flex flex-col items-center justify-center bg-gray-50 shadow-inner relative group">
                <div className="absolute inset-2 border-2 border-dashed border-blue-600/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <ShieldCheck size={48} className="text-blue-600 relative z-10" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-900 relative z-10 mt-2">Verified</span>
              </div>
            </div>

            {/* Right Date */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full border-b border-gray-100 pb-4 flex items-center justify-center">
                <span className="font-black text-xl text-gray-900 tracking-tighter">{issueDate}</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Initialization Date</p>
            </div>

          </div>

          {/* Verification Code */}
          <div className="pt-20 text-center space-y-4">
            <div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl inline-block">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Registry_ID: <span className="text-gray-900">{certificate.certificateId}</span>
               </p>
            </div>
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em]">
               System_Authenticity_Confirmed_By_iSoftware_Lab
            </p>
          </div>

        </div>
      </div>
      
      {/* Global CSS for printing layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      ` }} />
    </div>
  );
}
