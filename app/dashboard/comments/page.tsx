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
  Zap
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function CommunityDiscussionsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch all comments (simplified for dashboard)
        const res = await fetch("/api/comments?lessonId=general"); 
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
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
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-bold font-serif text-white mb-2">Community Feed</h1>
           <p className="text-gray-400">Join the discussion, ask doubts, and help fellow students.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search discussions..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#EBBB54]/50 transition-all"
              />
           </div>
           <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
              <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        {/* Sidebar Topics */}
        <div className="hidden xl:block space-y-6">
           <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Popular Topics</h3>
              <nav className="space-y-1">
                 {[
                   { name: "General Help", count: 124, icon: MessageSquare },
                   { name: "Next.js 15 Issues", count: 86, icon: Hash },
                   { name: "Deployment Guides", count: 42, icon: Star },
                   { name: "Showcase", count: 215, icon: Zap }
                 ].map((topic) => (
                   <button key={topic.name} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                      <span className="flex items-center gap-3 text-sm font-medium">
                         <topic.icon size={16} className="text-[#EBBB54]" /> {topic.name}
                      </span>
                      <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-lg group-hover:bg-[#EBBB54] group-hover:text-black transition-colors">{topic.count}</span>
                   </button>
                 ))}
              </nav>
           </div>
        </div>

        {/* Discussion Feed */}
        <div className="xl:col-span-3 space-y-8">
           {/* Post Input */}
           <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 focus-within:border-[#EBBB54]/30 transition-all">
              <div className="flex gap-4">
                 {session?.user?.image ? (
                   <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                     <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                   </div>
                 ) : (
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#EBBB54] border border-white/10 text-lg font-bold">
                      {session?.user?.name?.charAt(0) || "U"}
                   </div>
                 )}
                 <div className="flex-1 space-y-4">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Start a discussion or ask a doubt..."
                      className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 resize-none min-h-[80px] text-sm"
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <div className="flex items-center gap-2">
                          <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors"><Hash size={18} /></button>
                          <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors"><Star size={18} /></button>
                       </div>
                       <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-[#EBBB54] text-black font-bold rounded-xl hover:scale-105 transition-all text-sm">
                          Post Message <Send size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </form>

           {/* Feed */}
           <div className="space-y-6">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
                   <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
                   <p>Connecting to community...</p>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                   <div key={comment._id} className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 space-y-6 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            {comment.userId?.image ? (
                               <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                                 <img src={comment.userId.image} alt={comment.userId.name || "User"} className="w-full h-full object-cover" />
                               </div>
                            ) : (
                               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#EBBB54] border border-white/10 text-lg font-bold">
                                  {comment.userId?.name?.charAt(0) || "U"}
                               </div>
                            )}
                            <div>
                               <h4 className="font-bold text-white flex items-center gap-2">
                                  {comment.userId?.name || "Anonymous Student"}
                                  {comment.userId?.role === "admin" && (
                                    <span className="px-2 py-0.5 bg-[#EBBB54] text-black text-[8px] font-black uppercase rounded-full">Lecturer</span>
                                  )}
                               </h4>
                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                         </div>
                         <button className="text-gray-600 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                      </div>

                      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                         {comment.content}
                      </div>

                      <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                         <button className="flex items-center gap-2 text-gray-500 hover:text-[#EBBB54] transition-colors text-xs font-bold">
                            <ThumbsUp size={16} /> {comment.likes || 0} Likes
                         </button>
                         <button className="flex items-center gap-2 text-gray-500 hover:text-[#EBBB54] transition-colors text-xs font-bold">
                            <Reply size={16} /> Reply
                         </button>
                         <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-xs font-bold ml-auto">
                            <Flag size={16} /> Report
                         </button>
                      </div>
                   </div>
                ))
              ) : (
                <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 gap-4">
                   <MessageSquare size={40} className="opacity-10" />
                   <p>No discussions yet. Be the first to start one!</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
