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
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
        const topLevel = data.filter((c: any) => !c.parentId);
        const replies = data.filter((c: any) => c.parentId);
        const nested = topLevel.map((parent: any) => ({
          ...parent,
          replies: replies.filter((r: any) => r.parentId === parent._id)
        }));
        setComments(nested);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setStatusMsg({ type: "error", text: "AUTHENTICATION_REQUIRED" });
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
        const data = await res.json();
        
        // Add to local state temporarily to confirm submission
        if (data.parentId) {
          setComments(prev => prev.map(p => 
            p._id === data.parentId ? { ...p, replies: [...(p.replies || []), data] } : p
          ));
        } else {
          setComments(prev => [{ ...data, replies: [] }, ...prev]);
        }

        setContent("");
        setRating(0);
        setReplyTo(null);
        setStatusMsg({ type: "success", text: "DISPATCH_SUCCESS: AWAITING_MODERATION" });

        // Remove from local state after 2 seconds as requested
        setTimeout(() => {
          if (data.parentId) {
            setComments(prev => prev.map(p => 
              p._id === data.parentId ? { ...p, replies: p.replies.filter((r: any) => r._id !== data._id) } : p
            ));
          } else {
            setComments(prev => prev.filter(c => c._id !== data._id));
          }
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: any, isReply = false) => (
    <div key={comment._id} className={cn(
      "flex gap-6 p-8 bg-white border rounded-[2rem] transition-all hover:border-blue-100 shadow-sm",
      isReply ? "ml-12 border-gray-50 bg-gray-50/30" : "border-gray-100"
    )}>
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-blue-600 font-black text-lg border border-gray-100 overflow-hidden shadow-sm">
        {comment.userId?.image ? <img src={comment.userId.image} alt={comment.userId.name} /> : (comment.userId?.name?.charAt(0) || "?")}
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{comment.userId?.name}</p>
            {comment.userId?.role === "admin" && (
               <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] rounded font-black uppercase tracking-widest">Instructor</span>
            )}
            {comment.rating && (
               <div className="flex items-center gap-0.5 ml-2">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={10} className={cn(i < comment.rating ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                 ))}
               </div>
            )}
          </div>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
             <Clock size={12} /> {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed font-medium">"{comment.content}"</p>
        <div className="flex items-center gap-6 pt-2">
          {!isReply && (
            <button 
              onClick={() => { setReplyTo(comment._id); setContent(`@${comment.userId?.name} `); }}
              className="text-[9px] text-gray-400 hover:text-blue-600 uppercase font-black tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <CornerDownRight size={14} /> Reply_Thread
            </button>
          )}
          <button className="text-[9px] text-gray-400 hover:text-blue-600 uppercase font-black tracking-widest flex items-center gap-1.5 transition-colors">
            <ThumbsUp size={14} /> {comment.likes || 0} Helpful
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
          <MessageCircle className="text-blue-600" size={24} /> Discussion_Hub
        </h3>
        <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
           {comments.length} Verified Segments
        </div>
      </div>

      {/* Post Comment Form */}
      <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6 bg-gray-50/50">
        {replyTo && (
          <div className="flex items-center justify-between bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Routing reply to thread...</span>
            <button type="button" onClick={() => { setReplyTo(null); setContent(""); }} className="text-gray-400 hover:text-red-500 text-[10px] font-black uppercase">Cancel</button>
          </div>
        )}
        
        {!replyTo && (
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate Unit:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  type="button" 
                  onClick={() => setRating(s)}
                  className="transition-all hover:scale-125"
                >
                  <Star size={20} className={cn(
                    "transition-colors",
                    s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                  )} />
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea 
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Compose reply protocol..." : "Submit inquiry or share academic insight..."}
          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 resize-none min-h-[120px] placeholder:text-gray-300"
        />
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
           {statusMsg && (
             <div className={cn(
               "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
               statusMsg.type === "success" ? "text-emerald-500" : "text-red-500"
             )}>
                {statusMsg.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {statusMsg.text}
             </div>
           )}
           <div className="flex-1"></div>
           <button 
             disabled={submitting}
             type="submit" 
             className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20"
           >
             {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
             Dispatch_Message
           </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-[3rem] text-gray-300 italic text-[10px] font-black uppercase tracking-widest">
            Discussion registry empty. Initialize first entry.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="space-y-6">
              {renderComment(comment)}
              {comment.replies && comment.replies.map((reply: any) => renderComment(reply, true))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
