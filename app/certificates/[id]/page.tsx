import React from "react";
import dbConnect from "@/utils/db";
import Certificate from "@/models/Certificate";
import { Award, ShieldCheck, Printer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      {/* Controls (Hidden on Print) */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print:hidden">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
          &larr; Back to Academy
        </Link>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-[#EBBB54] text-black font-bold rounded-xl hover:scale-105 transition-transform"
        >
          <Printer size={18} />
          <span>Print / Save PDF</span>
          <script dangerouslySetInnerHTML={{ __html: `document.currentScript.parentElement.onclick = () => window.print();` }} />
        </button>
      </div>

      {/* The Certificate Canvas */}
      <div className="w-full max-w-5xl bg-white text-black p-12 md:p-24 rounded-[3rem] shadow-2xl relative overflow-hidden print:shadow-none print:p-0 print:m-0 print:rounded-none">
        
        {/* Decorative Borders */}
        <div className="absolute inset-4 border-4 border-[#EBBB54] rounded-[2.5rem] opacity-50 print:border-8"></div>
        <div className="absolute inset-6 border border-gray-300 rounded-[2rem] print:border-2"></div>
        <div className="absolute inset-8 border border-gray-200 rounded-[1.5rem] print:border"></div>

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award size={600} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#EBBB54] tracking-tight uppercase">
              Certificate of Achievement
            </h1>
            <p className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase">
              ISOFTWARE ACADEMY
            </p>
          </div>

          <div className="w-24 h-1 bg-[#EBBB54]/30 rounded-full"></div>

          {/* Recipient */}
          <div className="space-y-6">
            <p className="text-gray-500 italic font-serif text-xl">This is to proudly certify that</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight capitalize text-gray-900 border-b-2 border-dashed border-gray-300 pb-4 inline-block px-12">
              {studentName}
            </h2>
          </div>

          {/* Body */}
          <div className="space-y-4 max-w-2xl">
            <p className="text-gray-500 italic font-serif text-xl">has successfully completed the comprehensive curriculum and assessments for</p>
            <h3 className="text-3xl font-bold text-[#EBBB54] leading-tight">
              {courseTitle}
            </h3>
            {certificate.metadata?.grade && (
              <p className="text-gray-600 font-bold mt-2">
                Passed with a grade of: <span className="text-[#EBBB54]">{certificate.metadata.grade}</span>
              </p>
            )}
          </div>

          {/* Footer Grid */}
          <div className="w-full grid grid-cols-3 gap-8 pt-16 items-end mt-12">
            
            {/* Left Signature */}
            <div className="flex flex-col items-center">
              <div className="w-full h-12 flex items-end justify-center border-b border-black pb-2">
                <span className="font-serif text-2xl" style={{ fontFamily: 'cursive' }}>iSoftware Admin</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Academy Director</p>
            </div>

            {/* Center Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-[#EBBB54] flex flex-col items-center justify-center bg-[#EBBB54]/10 shadow-inner relative">
                <ShieldCheck size={40} className="text-[#EBBB54] mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Verified</span>
                
                {/* Ribbon tails */}
                <div className="absolute -bottom-6 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-[#EBBB54]"></div>
              </div>
            </div>

            {/* Right Date */}
            <div className="flex flex-col items-center">
              <div className="w-full h-12 flex items-end justify-center border-b border-black pb-2">
                <span className="font-bold text-lg text-gray-800">{issueDate}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Date of Issue</p>
            </div>

          </div>

          {/* Verification Code */}
          <div className="pt-12 text-center text-xs font-mono text-gray-400">
            <p>Verification Code: <span className="text-black font-bold">{certificate.certificateId}</span></p>
            <p className="mt-1">Verify at: <span className="text-[#EBBB54]">https://isoftwareacademy.com/certificates/{certificate.certificateId}</span></p>
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
