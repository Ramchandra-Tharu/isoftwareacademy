"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Trash2, 
  MessageSquare, 
  Search, 
  Filter,
  AlertCircle,
  MoreVertical,
  Star,
  Pin,
  RefreshCcw,
  ShieldAlert,
  Loader2,
  XCircle,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  User,
  Clock
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [courseFilter, setCourseFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletedView, setIsDeletedView] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [statusFilter, courseFilter, isDeletedView]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [commentsRes, coursesRes] = await Promise.all([
        fetch(`/api/admin/comments?status=${statusFilter}&courseId=${courseFilter}&isDeleted=${isDeletedView}&search=${searchQuery}`),
        fetch("/api/courses")
      ]);
      if (commentsRes.ok) setComments(await commentsRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) setComments(comments.filter(c => c._id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setProcessing(id);
    try {
      await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      setComments(comments.filter(c => c._id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentPinned })
      });
      if (res.ok) setComments(comments.map(c => c._id === id ? { ...c, isPinned: !currentPinned } : c));
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Moderation_Hub</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Review community interactions and maintain content quality.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => { setIsDeletedView(!isDeletedView); setStatusFilter("all"); }}
             className={cn(
               "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border",
               isDeletedView ? "bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/20" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
             )}
           >
             {isDeletedView ? "Exit Trash" : "View Deleted"}
           </button>
           <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              {comments.length} Records Found
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="card-premium p-4 flex flex-col lg:flex-row items-center gap-4">
         <div className="flex items-center gap-2 px-4 border-r border-gray-100 min-w-[180px]">
            <Filter size={14} className="text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black text-gray-900 uppercase tracking-widest focus:outline-none cursor-pointer w-full"
            >
              <option value="pending">PENDING_REVIEW</option>
              <option value="approved">LIVE_APPROVED</option>
              <option value="rejected">REJECTED_SPAM</option>
              <option value="all">ALL_STATUS</option>
            </select>
         </div>

         <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH_BY_KEYWORDS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-3 pl-12 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none"
            />
         </div>
      </div>

      {/* Comments List */}
      <div className="grid grid-cols-1 gap-6">
         {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
               <Loader2 className="animate-spin text-blue-600" size={40} />
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Accessing Social Layer...</p>
            </div>
         ) : comments.length === 0 ? (
            <div className="card-premium p-20 text-center space-y-4">
               <ShieldAlert className="mx-auto text-gray-100" size={60} />
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">No interactions found for this segment.</p>
            </div>
         ) : (
            comments.map((comment) => (
             <div key={comment._id} className="card-premium p-10 space-y-8 group hover:border-blue-100 transition-colors">
                <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 font-black text-xl group-hover:scale-110 transition-transform shadow-sm">
                         {comment.userId?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{comment.userId?.name || "User"}</h4>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black text-gray-400 uppercase">{comment.userId?.role || "student"}</span>
                            {comment.rating && (
                              <div className="flex items-center gap-0.5 ml-2">
                                 {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={10} className={cn(i < comment.rating ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                                 ))}
                              </div>
                            )}
                         </div>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                               <Clock size={12} /> {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 truncate max-w-[200px]">
                               <MessageSquare size={12} /> {comment.lessonId?.title || "Module Level"}
                            </span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {comment.isPinned && <Pin size={16} className="text-blue-600" />}
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        comment.status === "pending" ? "bg-amber-50 border-amber-100 text-amber-600" :
                        comment.status === "approved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                        "bg-red-50 border-red-100 text-red-600"
                      )}>
                        {comment.status}
                      </span>
                   </div>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 italic text-gray-600 text-sm leading-relaxed font-medium">
                   "{comment.content}"
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                   <div className="flex items-center gap-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      <span>Likes: {comment.likes || 0}</span>
                      <span>Reports: {comment.reports?.length || 0}</span>
                   </div>

                   <div className="flex items-center gap-2">
                      {!isDeletedView ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(comment._id, "approved")}
                            disabled={processing === comment._id}
                            className="px-5 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(comment._id, "rejected")}
                            disabled={processing === comment._id}
                            className="px-5 py-2.5 bg-red-50 text-red-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                          <button 
                            onClick={() => handleTogglePin(comment._id, comment.isPinned)}
                            className={cn(
                              "p-2.5 rounded-xl border transition-all shadow-sm",
                              comment.isPinned ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-400 border-gray-100 hover:text-blue-600"
                            )}
                          >
                            <Pin size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(comment._id)}
                            className="p-2.5 bg-white text-gray-400 hover:text-red-600 border border-gray-100 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                         <button className="px-5 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                            <RefreshCcw size={14} /> Restore_Asset
                         </button>
                      )}
                      <button className="p-2.5 text-gray-200 hover:text-gray-900 transition-colors"><MoreVertical size={20} /></button>
                   </div>
                </div>
             </div>
            ))
         )}
      </div>
    </div>
  );
}
