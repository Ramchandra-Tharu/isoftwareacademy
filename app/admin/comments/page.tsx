"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Trash2, 
  MessageSquare, 
  User, 
  Clock, 
  ExternalLink, 
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
  ChevronUp
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
  
  // Filters & State
  const [statusFilter, setStatusFilter] = useState("pending");
  const [courseFilter, setCourseFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletedView, setIsDeletedView] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);

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

      if (commentsRes.ok) {
        const data = await commentsRes.json();
        setComments(data);
      }
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInitialData();
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRestore = async (id: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false, deletedAt: null })
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
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
      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, isPinned: !currentPinned } : c));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async (action: string, status?: string) => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action, status })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleThread = (id: string) => {
    setExpandedThreads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 pb-20 font-mono">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#EBBB54] text-black text-[10px] font-black rounded uppercase tracking-widest animate-pulse">Active</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                COMMS_<span className="text-[#EBBB54]">MODERATOR</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             Interface: <span className="text-white">v2.0-Alpha</span> | Layer: <span className="text-white">Social-Moderation</span>
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => { setIsDeletedView(!isDeletedView); setStatusFilter("all"); }}
             className={cn(
               "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border",
               isDeletedView ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20" : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
             )}
           >
             {isDeletedView ? "EXIT_DELETED_MODE" : "VIEW_RECYCLE_BIN"}
           </button>
           <div className="h-8 w-px bg-white/10 mx-2"></div>
           <div className="bg-black border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#EBBB54] animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{comments.length} RECORDS_FOUND</span>
           </div>
        </div>
      </div>

      {/* 2. Control Bar (Filters & Search) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 bg-black border border-white/5 rounded-3xl">
         <div className="lg:col-span-3 flex items-center gap-2">
            <Filter size={14} className="text-gray-600 ml-2" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-transparent text-[10px] font-black text-white uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="all">ALL_STATUS</option>
              <option value="pending">PENDING_APPROVAL</option>
              <option value="approved">LIVE_APPROVED</option>
              <option value="rejected">REJECTED_SPAM</option>
            </select>
         </div>

         <div className="lg:col-span-3 flex items-center gap-2 border-l border-white/5 pl-4">
            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="flex-1 bg-transparent text-[10px] font-black text-white uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="">ALL_COURSES</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
         </div>

         <form onSubmit={handleSearch} className="lg:col-span-6 relative group border-l border-white/5 pl-4">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#EBBB54] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="QUERY_DB_FOR_KEYWORDS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] uppercase focus:outline-none focus:border-[#EBBB54]/30 transition-all placeholder:text-gray-700" 
            />
         </form>
      </div>

      {/* 3. Bulk Actions Toolbar (Floating if selection exists) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-6 z-50 bg-[#EBBB54] text-black p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-[#EBBB54]/30 animate-in slide-in-from-top-4">
           <div className="flex items-center gap-4">
              <span className="font-black text-xs uppercase tracking-tighter">{selectedIds.length} ASSETS_SELECTED</span>
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-black/10 rounded"><XCircle size={16} /></button>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={() => handleBulkAction("status", "approved")} className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">APPROVE_ALL</button>
              <button onClick={() => handleBulkAction("status", "rejected")} className="px-4 py-2 bg-black/10 border border-black/20 text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">REJECT_ALL</button>
              <button onClick={() => handleBulkAction("delete")} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">DELETE_PERM</button>
           </div>
        </div>
      )}

      {/* 4. Comments Grid */}
      <div className="grid grid-cols-1 gap-6">
         {loading ? (
           <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-[#EBBB54]" size={48} />
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">Syncing_Database...</p>
           </div>
         ) : comments.length === 0 ? (
           <div className="bg-black border border-white/5 rounded-3xl p-20 text-center space-y-4">
              <ShieldAlert className="mx-auto text-gray-800" size={60} />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">No_Matching_Records_Found</p>
           </div>
         ) : (
           comments.map((comment) => (
            <div key={comment._id} className={cn(
              "group relative bg-black border rounded-3xl p-8 transition-all hover:bg-white/[0.01]",
              selectedIds.includes(comment._id) ? "border-[#EBBB54]" : "border-white/5 hover:border-white/20"
            )}>
               <div className="flex items-start justify-between gap-6">
                  {/* Selection Checkbox */}
                  <div className="pt-1">
                     <button 
                       onClick={() => toggleSelect(comment._id)}
                       className={cn(
                         "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                         selectedIds.includes(comment._id) ? "bg-[#EBBB54] border-[#EBBB54] text-black" : "border-white/10 hover:border-white/30"
                       )}
                     >
                       {selectedIds.includes(comment._id) && <CheckCircle size={14} />}
                     </button>
                  </div>

                  <div className="flex-1 space-y-6">
                     {/* Header: User & Meta */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EBBB54] font-black text-xl">
                                 {comment.userId?.name?.charAt(0) || "?"}
                              </div>
                              {comment.isSpam && (
                                <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 border-2 border-black" title="Spam Detected">
                                   <AlertCircle size={10} className="text-white" />
                                </div>
                              )}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="text-sm font-black text-white uppercase tracking-tight">{comment.userId?.name || "Unknown User"}</h4>
                                 <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 uppercase">{comment.userId?.role || "student"}</span>
                                 {comment.rating && (
                                   <div className="flex items-center gap-1 ml-2">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={cn(i < comment.rating ? "text-[#EBBB54] fill-[#EBBB54]" : "text-gray-800")} />
                                      ))}
                                   </div>
                                 )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[10px] text-gray-600 font-bold flex items-center gap-1 uppercase tracking-widest">
                                    <Clock size={12} /> {new Date(comment.createdAt).toLocaleString()}
                                 </span>
                                 <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <MessageSquare size={12} /> {comment.lessonId?.title || "Direct Comment"}
                                 </span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           {comment.isPinned && <Pin size={14} className="text-[#EBBB54] animate-bounce" />}
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                             comment.status === "pending" ? "bg-orange-600/10 border-orange-600/20 text-orange-500" :
                             comment.status === "approved" ? "bg-green-600/10 border-green-600/20 text-green-500" :
                             "bg-red-600/10 border-red-600/20 text-red-500"
                           )}>
                             {comment.status}
                           </span>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-white/5 rounded-full"></div>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium italic pl-2 border-l-2 border-[#EBBB54]/10">
                           "{comment.content}"
                        </p>
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default"><RefreshCcw size={12} /> LIKES: {comment.likes || 0}</span>
                              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default"><CornerDownRight size={12} /> DISLIKES: {comment.dislikes || 0}</span>
                              {comment.reports?.length > 0 && (
                                <span className="flex items-center gap-1.5 text-red-600 animate-pulse"><AlertCircle size={12} /> REPORTS: {comment.reports.length}</span>
                              )}
                           </div>
                        </div>

                        <div className="flex items-center gap-2">
                           {isDeletedView ? (
                             <button 
                               onClick={() => handleRestore(comment._id)}
                               disabled={processing === comment._id}
                               className="px-4 py-2 bg-[#EBBB54]/10 hover:bg-[#EBBB54]/20 text-[#EBBB54] text-[10px] font-black rounded-xl uppercase tracking-widest transition-all border border-[#EBBB54]/20 flex items-center gap-2"
                             >
                               {processing === comment._id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
                               RESTORE_ASSET
                             </button>
                           ) : (
                             <>
                               {comment.status !== "approved" && (
                                 <button 
                                   onClick={() => handleStatusUpdate(comment._id, "approved")}
                                   disabled={processing === comment._id}
                                   className="px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-500 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all border border-green-600/20 flex items-center gap-2"
                                 >
                                   {processing === comment._id && comment.status === "approved" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                   APPROVE
                                 </button>
                               )}
                               {comment.status !== "rejected" && (
                                 <button 
                                   onClick={() => handleStatusUpdate(comment._id, "rejected")}
                                   disabled={processing === comment._id}
                                   className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all border border-red-600/20 flex items-center gap-2"
                                 >
                                   {processing === comment._id && comment.status === "rejected" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                   REJECT
                                 </button>
                               )}
                               <button 
                                 onClick={() => handleTogglePin(comment._id, comment.isPinned)}
                                 className={cn(
                                   "p-2 rounded-xl transition-all border",
                                   comment.isPinned ? "bg-[#EBBB54] text-black border-[#EBBB54]" : "bg-white/5 text-gray-500 border-white/10 hover:text-white"
                                 )}
                                 title={comment.isPinned ? "Unpin Comment" : "Pin Comment"}
                               >
                                 <Pin size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDelete(comment._id)}
                                 disabled={processing === comment._id}
                                 className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-600/20"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </>
                           )}
                           <button className="p-2 text-gray-700 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
           ))
         )}
      </div>
    </div>
  );
}
