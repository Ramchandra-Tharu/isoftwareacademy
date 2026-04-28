"use client";

import React from "react";
import { 
  CheckCircle, 
  Trash2, 
  MessageSquare, 
  User, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockComments = [
  { id: 1, user: "Sarah Johnson", content: "Great lesson! Can you explain more about React.useMemo vs React.memo?", lesson: "Advanced React Patterns", date: "2 hours ago", status: "Pending" },
  { id: 2, user: "Michael Chen", content: "Is there any alternative to CSS Grid for this layout?", lesson: "UI/UX Masterclass", date: "4 hours ago", status: "Approved" },
  { id: 3, user: "Elena Rodriguez", content: "The code snippet on line 12 seems to have a typo.", lesson: "Node.js Architecture", date: "Yesterday", status: "Pending" },
  { id: 4, user: "David Wilson", content: "I love the way you explained the event loop. Very clear!", lesson: "Fullstack Masterclass", date: "2 days ago", status: "Approved" },
];

export default function CommentsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Comment Moderation</h1>
          <p className="text-gray-400 mt-1">Approve or delete user comments on lessons.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl transition-all border border-green-500/20">
              <CheckCircle size={18} />
              <span>Approve All</span>
           </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
         <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
            <input type="text" placeholder="Search comments..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#EBBB54]/50" />
         </div>
         <select className="bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#EBBB54]/50">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
         </select>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
         {mockComments.map((comment) => (
            <div key={comment.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-6 group hover:border-white/20 transition-all">
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <User size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-white">{comment.user}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} /> {comment.date}
                           </span>
                           <span className={cn(
                              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md border",
                              comment.status === "Pending" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-green-500/10 border-green-500/20 text-green-400"
                           )}>
                              {comment.status}
                           </span>
                        </div>
                     </div>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-all">
                     <ExternalLink size={16} title="Go to lesson" />
                  </button>
               </div>

               <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{comment.content}"</p>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                     <MessageSquare size={14} /> Lesson: <span className="font-semibold text-gray-400">{comment.lesson}</span>
                  </span>
                  <div className="flex items-center gap-3">
                     {comment.status === "Pending" && (
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/20 transition-all">
                           <CheckCircle size={14} />
                           Approve
                        </button>
                     )}
                     <button className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-all">
                        <Trash2 size={14} />
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
