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
  ArrowUpRight,
  Ticket,
  Plus,
  Trash2,
  Edit3,
  Calendar
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPaymentsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"transactions" | "coupons">("transactions");
  
  // Transactions State
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showManualEnroll, setShowManualEnroll] = useState(false);
  const [enrollData, setEnrollData] = useState({ userId: "", itemId: "", itemType: "course" });
  const [enrolling, setEnrolling] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discountType: "percentage",
    value: 10,
    minPurchase: 0,
    expiresAt: "",
    usageLimit: 100,
    isActive: true
  });

  useEffect(() => {
    if (activeSubTab === "transactions") fetchPayments();
    else if (activeSubTab === "coupons") fetchCoupons();
  }, [activeSubTab, paymentFilter]);

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${paymentFilter}`);
      if (res.ok) setPayments(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
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

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCouponId ? "PATCH" : "POST";
    const body = editingCouponId ? { id: editingCouponId, ...couponFormData } : couponFormData;
    try {
      const res = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowCouponModal(false);
        setEditingCouponId(null);
        setCouponFormData({
          code: "",
          discountType: "percentage",
          value: 10,
          minPurchase: 0,
          expiresAt: "",
          usageLimit: 100,
          isActive: true
        });
        fetchCoupons();
      } else {
        const err = await res.json();
        alert(err.error || "Operation failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleCouponDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch (err) {
      alert("Delete failed");
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
                PAYMENTS_&_<span className="text-[#EBBB54]">OFFERS</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             Manage transactions and promotional logic in a unified interface
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           {activeSubTab === "coupons" && (
              <button 
                onClick={() => { setEditingCouponId(null); setShowCouponModal(true); }}
                className="px-6 py-3 bg-[#EBBB54] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#EBBB54]/10"
              >
                <Plus size={16} /> New_Coupon
              </button>
           )}
           <button 
             onClick={() => setShowManualEnroll(true)}
             className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
           >
             <UserPlus size={16} /> Manual_Enroll
           </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
         <button 
           onClick={() => setActiveSubTab("transactions")}
           className={cn(
             "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeSubTab === "transactions" ? "bg-[#EBBB54] text-black" : "text-gray-500 hover:text-white"
           )}
         >
           <CreditCard size={14} /> Transactions
         </button>
         <button 
           onClick={() => setActiveSubTab("coupons")}
           className={cn(
             "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeSubTab === "coupons" ? "bg-[#EBBB54] text-black" : "text-gray-500 hover:text-white"
           )}
         >
           <Ticket size={14} /> Promotional_Coupons
         </button>
      </div>

      {activeSubTab === "transactions" ? (
        <>
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
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
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
                  {loadingPayments ? (
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
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {loadingCoupons ? (
             <div className="col-span-full py-20 text-center">
                <Loader2 className="animate-spin text-[#EBBB54] mx-auto mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Syncing_Coupons...</p>
             </div>
           ) : coupons.length === 0 ? (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-gray-700 italic font-bold uppercase tracking-widest text-xs">No active promotion protocols.</div>
           ) : (
             coupons.map((coupon) => (
               <div key={coupon._id} className="bg-black border border-white/5 rounded-[2.5rem] p-8 space-y-6 group hover:border-[#EBBB54]/30 transition-all relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                     <Ticket size={120} />
                  </div>
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{coupon.code}</h3>
                        <p className="text-[10px] text-[#EBBB54] font-black uppercase tracking-widest">
                           {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </p>
                     </div>
                     <div className={cn(
                       "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
                       coupon.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                     )}>
                        {coupon.isActive ? "Active" : "Disabled"}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                     <div className="space-y-1">
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Usage</p>
                        <p className="text-xs font-bold text-white">{coupon.usageCount} / {coupon.usageLimit}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Expiry</p>
                        <p className="text-xs font-bold text-white">{new Date(coupon.expiresAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <button 
                       onClick={() => {
                         setEditingCouponId(coupon._id);
                         setCouponFormData({
                           code: coupon.code,
                           discountType: coupon.discountType,
                           value: coupon.value,
                           minPurchase: coupon.minPurchase,
                           expiresAt: coupon.expiresAt.split('T')[0],
                           usageLimit: coupon.usageLimit,
                           isActive: coupon.isActive
                         });
                         setShowCouponModal(true);
                       }}
                       className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                     >
                        EDIT
                     </button>
                     <button 
                       onClick={() => handleCouponDelete(coupon._id)}
                       className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl transition-all"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      )}

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
                    <input required value={enrollData.userId} onChange={(e) => setEnrollData({...enrollData, userId: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" placeholder="ENTER_MONGODB_ID..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item_Object_ID</label>
                    <input required value={enrollData.itemId} onChange={(e) => setEnrollData({...enrollData, itemId: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" placeholder="ENTER_COURSE_OR_PROGRAM_ID..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item_Category</label>
                    <select value={enrollData.itemType} onChange={(e) => setEnrollData({...enrollData, itemType: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30 cursor-pointer">
                       <option value="course">COURSE_ASSET</option>
                       <option value="program">PROGRAM_ASSET</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowManualEnroll(false)} className="flex-1 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">CANCEL</button>
                    <button type="submit" disabled={enrolling} className="flex-1 py-4 bg-[#EBBB54] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all disabled:opacity-50">{enrolling ? <Loader2 className="animate-spin mx-auto" size={18} /> : "AUTHORIZE_ENROLL"}</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{editingCouponId ? "Modify_Coupon" : "Create_Coupon"}</h3>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Define discount parameters</p>
              </div>
              <form onSubmit={handleCouponSubmit} className="space-y-5 relative z-10">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coupon_Code</label>
                    <input required value={couponFormData.code} onChange={(e) => setCouponFormData({...couponFormData, code: e.target.value.toUpperCase()})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" placeholder="e.g. FLAT50" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</label>
                       <select value={couponFormData.discountType} onChange={(e) => setCouponFormData({...couponFormData, discountType: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30">
                          <option value="percentage">PERCENT (%)</option>
                          <option value="fixed">FIXED (₹)</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value</label>
                       <input type="number" required value={couponFormData.value} onChange={(e) => setCouponFormData({...couponFormData, value: Number(e.target.value)})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Usage_Limit</label>
                       <input type="number" required value={couponFormData.usageLimit} onChange={(e) => setCouponFormData({...couponFormData, usageLimit: Number(e.target.value)})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expiry_Date</label>
                       <input type="date" required value={couponFormData.expiresAt} onChange={(e) => setCouponFormData({...couponFormData, expiresAt: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-[10px] font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowCouponModal(false)} className="flex-1 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">CANCEL</button>
                    <button type="submit" className="flex-1 py-4 bg-[#EBBB54] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">SAVE_PROTOCOL</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
