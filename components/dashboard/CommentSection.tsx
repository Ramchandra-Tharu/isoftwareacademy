"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  CheckCircle, 
  ThumbsUp, 
  ThumbsDown, 
  CornerDownRight, 
  Star,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";

interface CommentSectionProps {
  courseId: string;
  lessonId: string;
}

export default function CommentSection({ courseId, lessonId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?lessonId=${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        // Simple nesting: separate top-level and replies
        const topLevel = data.filter((c: any) => !c.parentId);
        const replies = data.filter((c: any) => c.parentId);
        
        const nested = topLevel.map((parent: any) => ({
          ...parent,
          replies: replies.filter((r: any) => r.parentId === parent._id)
        }));
        
        setComments(nested);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setStatusMsg({ type: "error", text: "Please login to post a comment." });
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          courseId,
          lessonId,
          content,
          parentId: replyTo,
          rating: rating > 0 ? rating : undefined
        })
      });

      if (res.ok) {
        setContent("");
        setRating(0);
        setReplyTo(null);
        setStatusMsg({ type: "success", text: "Comment submitted! It will appear after approval." });
        // Don't immediately add to list since it's pending
      } else {
        const error = await res.json();
        setStatusMsg({ type: "error", text: error.error || "Failed to post comment." });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "An error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: any, isReply = false) => (
    <div key={comment._id} className={`flex gap-4 p-5 bg-[#1a1a1a] rounded-2xl border border-white/5 transition-all hover:border-white/10 ${isReply ? "ml-12 bg-[#161616]" : ""}`}>
      <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-[#EBBB54] font-bold border border-white/10 overflow-hidden">
        {comment.userId?.image ? <img src={comment.userId.image} alt={comment.userId.name} /> : (comment.userId?.name?.charAt(0) || "?")}
      </div>
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white">{comment.userId?.name}</p>
            {comment.userId?.role === "admin" && <span className="text-[8px] bg-[#EBBB54] text-black px-1 rounded font-black uppercase">Staff</span>}
            {comment.rating && (
               <div className="flex items-center gap-0.5 ml-2">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={10} className={i < comment.rating ? "text-[#EBBB54] fill-[#EBBB54]" : "text-gray-700"} />
                 ))}
               </div>
            )}
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-4 pt-2">
          {!isReply && (
            <button 
              onClick={() => { setReplyTo(comment._id); setContent(`@${comment.userId?.name} `); }}
              className="text-[10px] text-gray-500 hover:text-[#EBBB54] uppercase font-bold tracking-widest flex items-center gap-1"
            >
              <CornerDownRight size={12} /> Reply
            </button>
          )}
          <button className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest flex items-center gap-1">
            <ThumbsUp size={12} /> {comment.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-serif text-white flex items-center gap-3">
          <MessageCircle className="text-[#EBBB54]" size={24} /> Discussion Thread
        </h3>
        <span className="text-xs text-gray-500 font-mono">{comments.length} Approved Comments</span>
      </div>

      {/* Post Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
        {replyTo && (
          <div className="flex items-center justify-between bg-[#EBBB54]/10 px-4 py-2 rounded-xl border border-[#EBBB54]/20">
            <span className="text-[10px] font-black text-[#EBBB54] uppercase tracking-widest">Replying to thread...</span>
            <button type="button" onClick={() => { setReplyTo(null); setContent(""); }} className="text-gray-500 hover:text-white text-xs">Cancel</button>
          </div>
        )}
        
        {!replyTo && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  type="button" 
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-125"
                >
                  <Star size={18} className={s <= rating ? "text-[#EBBB54] fill-[#EBBB54]" : "text-gray-800"} />
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea 
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Write your reply..." : "Ask a question or share your thoughts..."}
          className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-300 resize-none min-h-[100px] placeholder:text-gray-700"
        />
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
           {statusMsg && (
             <div className={cn(
               "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
               statusMsg.type === "success" ? "text-green-500" : "text-red-500"
             )}>
                {statusMsg.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {statusMsg.text}
             </div>
           )}
           <div className="flex-1"></div>
           <button 
             disabled={submitting}
             type="submit" 
             className="flex items-center gap-2 px-8 py-3 bg-[#EBBB54] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-[#EBBB54]/10"
           >
             {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
             <span className="text-[10px] uppercase tracking-widest">Post_Message</span>
           </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-[#EBBB54]" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-600 italic text-sm">
            No approved comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="space-y-4">
              {renderComment(comment)}
              {comment.replies && comment.replies.map((reply: any) => renderComment(reply, true))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
