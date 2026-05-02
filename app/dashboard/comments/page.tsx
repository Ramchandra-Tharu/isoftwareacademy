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
        // Add to local state temporarily
        setComments([data, ...comments]);
        setNewComment("");
        
        // Remove from local state after 2 seconds as requested
        setTimeout(() => {
          setComments(prev => prev.filter(c => c._id !== data._id));
        }, 2000);
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
      <div className="space-y-4">
        <h1 className="text-5xl font-light tracking-tight text-black leading-none uppercase">Community_Sync</h1>
        <p className="text-sm text-gray-500 font-normal">Connect with the academic collective and exchange operational protocols.</p>
      </div>

      <div className="bg-blue-600 rounded-[2rem] p-8 text-center space-y-6 shadow-xl shadow-blue-600/10 border border-blue-500/20 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50"></div>
         <div className="relative z-10 flex flex-col items-center">
            <button className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-xl hover:bg-white/20 transition-all">
               Explore Guidelines
            </button>
         </div>
      </div>

        {/* Feed Column */}
        <div className="xl:col-span-12 space-y-12">
           {/* Message Input - Styled to match image */}
           <div className="card-premium p-10 bg-white border border-blue-50/50 shadow-2xl shadow-blue-600/5 relative group">
              <form onSubmit={handleSubmit} className="flex gap-8">
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold shadow-inner shrink-0">
                    {session?.user?.name?.charAt(0) || "S"}
                 </div>
                 
                 <div className="flex-1 space-y-10">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="INITIALIZE_DISCUSSION_PROTOCOL..."
                      className="w-full bg-transparent border-none text-gray-800 placeholder:text-gray-300 focus:ring-0 resize-none min-h-[120px] text-lg font-normal leading-relaxed"
                    />
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <button type="button" className="text-gray-300 hover:text-blue-600 transition-all hover:scale-110">
                             <Hash size={24} strokeWidth={1.5} />
                          </button>
                          <button type="button" className="text-gray-300 hover:text-blue-600 transition-all hover:scale-110">
                             <Star size={24} strokeWidth={1.5} />
                          </button>
                       </div>
                       
                       <button 
                         type="submit" 
                         className="flex items-center gap-4 px-12 py-5 bg-[#1a56db] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/30"
                       >
                          Dispatch Message <Send size={18} />
                       </button>
                    </div>
                 </div>
              </form>
           </div>

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
                               <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1 flex items-center gap-2">
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
  );
}
