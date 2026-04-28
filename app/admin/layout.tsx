import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden font-mono">
      {/* Sidebar - Fixed width on desktop, hidden/collapsible on mobile */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-600 via-[#EBBB54] to-red-600"></div>
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="max-w-full mx-auto space-y-10 animate-in zoom-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
