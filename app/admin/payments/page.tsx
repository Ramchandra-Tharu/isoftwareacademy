"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Loader2,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showManualEnroll, setShowManualEnroll] = useState(false);
  
  // Manual Enroll State
  const [enrollData, setEnrollData] = useState({ userId: "", itemId: "", itemType: "course" });
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolling(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollData)
      });
      if (res.ok) {
        alert("User enrolled successfully!");
        setShowManualEnroll(false);
        setEnrollData({ userId: "", itemId: "", itemType: "course" });
      } else {
        const err = await res.json();
        alert(err.error || "Enrollment failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setEnrolling(false);
    }
  };

  const stats = [
    { label: "Total Revenue", value: `₹${payments.reduce((acc, p) => p.status === 'success' ? acc + p.amount : acc, 0).toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { label: "Success Rate", value: `${Math.round((payments.filter(p => p.status === 'success').length / (payments.length || 1)) * 100)}%`, icon: TrendingUp, color: "text-[#EBBB54]" },
    { label: "Active Enrollments", value: payments.filter(p => p.status === 'success').length.toString(), icon: Users, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-10 pb-20 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#EBBB54] text-black text-[10px] font-black rounded uppercase tracking-widest animate-pulse">Financial_Hub</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                TRANSACTION_<span className="text-[#EBBB54]">LEDGER</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             System: <span className="text-white">Razorpay-Gateway</span> | Integrity: <span className="text-white">Verified</span>
           </p>
        </div>
        
        <button 
          onClick={() => setShowManualEnroll(true)}
          className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <UserPlus size={16} /> Manual_Enrollment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-black border border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:border-white/10 transition-all">
             <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.value}</h3>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-black border border-white/5 rounded-2xl">
         <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-white/5">
            <Search size={16} className="text-gray-600" />
            <input placeholder="SEARCH_BY_ORDER_ID_OR_USER..." className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white focus:outline-none w-full" />
         </div>
         <div className="flex items-center gap-3 px-4">
            <Filter size={16} className="text-gray-600" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white focus:outline-none cursor-pointer"
            >
              <option value="all">ALL_TRANSACTIONS</option>
              <option value="success">SUCCESS_ONLY</option>
              <option value="pending">PENDING_QUEUE</option>
              <option value="failed">FAILED_LOGS</option>
            </select>
         </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-black border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
           <thead className="bg-white/5 border-b border-white/10">
              <tr>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Transaction_ID</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">User_Entity</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Target_Asset</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Date_Stamp</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-[#EBBB54] mx-auto mb-4" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Querying_Ledger...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-600 italic text-sm">No transactions found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                       <p className="text-[10px] font-black text-white uppercase truncate max-w-[120px]">{p.razorpayOrderId}</p>
                       <p className="text-[8px] text-gray-700 font-bold uppercase mt-1">ID: {p._id.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-[10px] font-black text-white uppercase">{p.userId?.name || "Deleted User"}</p>
                       <p className="text-[8px] text-gray-600 font-bold lowercase">{p.userId?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          {p.courseId?.title || p.programId?.title || "Manual_Asset"}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-sm font-black text-white tracking-tighter">₹{p.amount}</p>
                    </td>
                    <td className="px-6 py-5">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                         p.status === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                         p.status === "pending" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                         "bg-red-500/10 border-red-500/20 text-red-500"
                       )}>
                          {p.status === "success" ? <CheckCircle size={10} /> : p.status === "pending" ? <Clock size={10} /> : <XCircle size={10} />}
                          {p.status}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-[10px] text-gray-600 font-bold uppercase">
                       {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
           </tbody>
        </table>
      </div>

      {/* Manual Enrollment Modal */}
      {showManualEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <UserPlus size={100} />
              </div>

              <div className="space-y-2 relative z-10">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Manual_Enroll</h3>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Bypass_Payment_Gateway</p>
              </div>

              <form onSubmit={handleManualEnroll} className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">User_Object_ID</label>
                    <input 
                      required
                      value={enrollData.userId} 
                      onChange={(e) => setEnrollData({...enrollData, userId: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                      placeholder="ENTER_MONGODB_ID..." 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item_Object_ID</label>
                    <input 
                      required
                      value={enrollData.itemId} 
                      onChange={(e) => setEnrollData({...enrollData, itemId: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                      placeholder="ENTER_COURSE_OR_PROGRAM_ID..." 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item_Category</label>
                    <select 
                      value={enrollData.itemType}
                      onChange={(e) => setEnrollData({...enrollData, itemType: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30 cursor-pointer"
                    >
                       <option value="course">COURSE_ASSET</option>
                       <option value="program">PROGRAM_ASSET</option>
                    </select>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowManualEnroll(false)}
                      className="flex-1 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit" 
                      disabled={enrolling}
                      className="flex-1 py-4 bg-[#EBBB54] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {enrolling ? <Loader2 className="animate-spin mx-auto" size={18} /> : "AUTHORIZE_ENROLL"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
