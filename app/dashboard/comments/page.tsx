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
        // Permanently keep the local state updated
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
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Connecting to network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Community Hub</h1>
        <p className="text-sm text-gray-500 font-medium">Connect with other learners, share insights, and discuss concepts.</p>
      </div>

        {/* Feed Column */}
        <div className="xl:col-span-12 space-y-10">
           {/* Message Input */}
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-600/5 relative group">
              <form onSubmit={handleSubmit} className="flex gap-6">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold shadow-sm shrink-0">
                    {session?.user?.name?.charAt(0) || "U"}
                 </div>
                 
                 <div className="flex-1 space-y-6">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share an idea or ask a question to the community..."
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
                         className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                       >
                          Post Comment <Send size={16} />
                       </button>
                    </div>
                 </div>
              </form>
           </div>

           {/* Feed */}
           <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                   <div key={comment._id} className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 group flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 text-lg font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors overflow-hidden">
                               {comment.userId?.image ? <img src={comment.userId.image} /> : (comment.userId?.name?.charAt(0) || "U")}
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                  {comment.userId?.name || "Learner"}
                                  {comment.userId?.role === "admin" && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black uppercase rounded">ADMIN</span>
                                  )}
                               </h4>
                               <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                  <MessageSquare size={10} /> {new Date(comment.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                         </div>
                         <button className="text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={18} /></button>
                      </div>

                      <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                         {comment.content}
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                         <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={14} /> {comment.likes || 0} Helpful
                         </button>
                         <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-blue-600 transition-colors">
                            <Reply size={14} /> Reply
                         </button>
                         <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-red-500 transition-colors ml-auto">
                            <Flag size={14} /> Report
                         </button>
                      </div>
                   </div>
                ))
              ) : (
                <div className="h-64 bg-white border border-gray-100 rounded-3xl border-dashed flex flex-col items-center justify-center text-gray-400 gap-4 shadow-sm">
                   <MessageSquare size={48} className="opacity-10" />
                   <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-900">No Discussions Yet</p>
                      <p className="text-[10px] text-gray-500 mt-1">Be the first to share a question or resource with the community.</p>
                   </div>
                   <button onClick={() => document.querySelector('textarea')?.focus()} className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-md">Start Topic</button>
                </div>
              )}
           </div>
        </div>
    </div>
  );
}
