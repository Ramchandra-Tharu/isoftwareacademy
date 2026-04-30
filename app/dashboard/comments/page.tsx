"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  ThumbsUp, 
  Reply, 
  Flag,
  Send,
  User,
  Hash,
  Star,
  Loader2,
  Zap,
  Sparkles,
  Target
} from "lucide-react";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CommunityDiscussionsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comments?lessonId=general"); 
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user?.id) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          courseId: "general", 
          lessonId: "general", 
          content: newComment,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments([data, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Community Frequency...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Community_Sync</h1>
           <p className="text-gray-500 font-medium mt-1">Engage with peer protocols and exchange academic insights.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH_THREADS..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-blue-100 shadow-sm shadow-gray-900/5"
              />
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
              <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Sidebar Topics */}
        <div className="xl:col-span-3 space-y-8">
           <div className="card-premium p-8 space-y-8">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Popular_Topics</h3>
              <nav className="space-y-2">
                 {[
                   { name: "General Hub", count: 124, icon: MessageSquare },
                   { name: "Technical Issues", count: 86, icon: Hash },
                   { name: "Deployments", count: 42, icon: Zap },
                   { name: "Showcase", count: 215, icon: Sparkles }
                 ].map((topic) => (
                   <button key={topic.name} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all group">
                      <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                         <topic.icon size={16} className="text-blue-600" /> {topic.name}
                      </span>
                      <span className="text-[9px] font-black bg-gray-50 px-2 py-0.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">{topic.count}</span>
                   </button>
                 ))}
              </nav>
           </div>

           <div className="card-premium p-8 bg-blue-600 text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Zap size={100}/></div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80">Sync_Incentive</p>
              <p className="text-sm font-bold leading-tight">Help peers and earn +50 XP for every approved solution.</p>
              <button className="w-full py-3 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-xl shadow-blue-600/20">
                 Explore Guidelines
              </button>
           </div>
        </div>

        {/* Discussion Feed */}
        <div className="xl:col-span-9 space-y-10">
           {/* Post Input */}
           <form onSubmit={handleSubmit} className="card-premium p-8 focus-within:border-blue-100 bg-gray-50/50 transition-all">
              <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 text-lg font-black shadow-sm shrink-0">
                    {session?.user?.name?.charAt(0) || "U"}
                 </div>
                 <div className="flex-1 space-y-6">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="INITIALIZE_DISCUSSION_PROTOCOL..."
                      className="w-full bg-transparent border-none text-gray-700 placeholder:text-gray-300 focus:ring-0 resize-none min-h-[100px] text-sm font-medium"
                    />
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                       <div className="flex items-center gap-2">
                          <button type="button" className="p-2 text-gray-300 hover:text-blue-600 transition-colors"><Hash size={20} /></button>
                          <button type="button" className="p-2 text-gray-300 hover:text-blue-600 transition-colors"><Star size={20} /></button>
                       </div>
                       <button type="submit" className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                          Dispatch Message <Send size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           </form>

           {/* Feed */}
           <div className="space-y-8">
              {comments.length > 0 ? (
                comments.map((comment) => (
                   <div key={comment._id} className="card-premium p-10 space-y-8 hover:border-blue-100 transition-all group">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 text-xl font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm overflow-hidden">
                               {comment.userId?.image ? <img src={comment.userId.image} /> : (comment.userId?.name?.charAt(0) || "U")}
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                  {comment.userId?.name || "Anonymous Learner"}
                                  {comment.userId?.role === "admin" && (
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-lg shadow-sm">Staff_Core</span>
                                  )}
                               </h4>
                               <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1 flex items-center gap-2">
                                  <MessageSquare size={12} /> {new Date(comment.createdAt).toLocaleString()}
                               </p>
                            </div>
                         </div>
                         <button className="text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={20} /></button>
                      </div>

                      <div className="text-gray-600 text-sm font-medium leading-relaxed whitespace-pre-wrap px-2 border-l-2 border-gray-50 italic">
                         "{comment.content}"
                      </div>

                      <div className="flex items-center gap-10 pt-6 border-t border-gray-50">
                         <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={16} /> {comment.likes || 0} Helpful
                         </button>
                         <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
                            <Reply size={16} /> Reply_Thread
                         </button>
                         <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors ml-auto">
                            <Flag size={16} /> Report
                         </button>
                      </div>
                   </div>
                ))
              ) : (
                <div className="h-80 card-premium border-dashed flex flex-col items-center justify-center text-gray-400 gap-6">
                   <MessageSquare size={60} className="opacity-10" />
                   <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest">Network Silent</p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">No community transmissions detected in this frequency.</p>
                   </div>
                   <button onClick={() => {}} className="btn-primary text-xs">Start Transmission</button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
