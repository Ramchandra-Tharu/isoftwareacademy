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
  Calendar,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPaymentsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"transactions" | "coupons">("transactions");
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showManualEnroll, setShowManualEnroll] = useState(false);
  const [enrollData, setEnrollData] = useState({ userId: "", itemId: "", itemType: "course" });
  const [enrolling, setEnrolling] = useState(false);

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
        alert("Enrolled!");
        setShowManualEnroll(false);
        fetchPayments();
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCouponId ? "PATCH" : "POST";
    const body = editingCouponId ? { id: editingCouponId, ...couponFormData } : couponFormData;
    const res = await fetch("/api/admin/coupons", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setShowCouponModal(false);
      fetchCoupons();
    }
  };

  const stats = [
    { label: "Total Revenue", value: `₹${payments.reduce((acc, p) => p.status === 'success' ? acc + p.amount : acc, 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Success Rate", value: `${Math.round((payments.filter(p => p.status === 'success').length / (payments.length || 1)) * 100)}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Enrollments", value: payments.filter(p => p.status === 'success').length.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Financial_Operations</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Manage transactions, manual enrollments, and promotional offers.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {activeSubTab === "coupons" && (
              <button 
                onClick={() => { setEditingCouponId(null); setShowCouponModal(true); }}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> New Coupon
              </button>
           )}
           <button 
             onClick={() => setShowManualEnroll(true)}
             className="px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
           >
             <UserPlus size={16} /> Manual Enroll
           </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
         <button 
           onClick={() => setActiveSubTab("transactions")}
           className={cn(
             "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeSubTab === "transactions" ? "bg-white text-gray-900 shadow-xl shadow-gray-900/5" : "text-gray-400 hover:text-gray-600"
           )}
         >
           <CreditCard size={14} /> Transactions
         </button>
         <button 
           onClick={() => setActiveSubTab("coupons")}
           className={cn(
             "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
             activeSubTab === "coupons" ? "bg-white text-gray-900 shadow-xl shadow-gray-900/5" : "text-gray-400 hover:text-gray-600"
           )}
         >
           <Ticket size={14} /> Promotional Offers
         </button>
      </div>

      {activeSubTab === "transactions" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="card-premium p-8 flex items-center justify-between group">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black tracking-tighter text-gray-900">{stat.value}</h3>
                 </div>
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                    <stat.icon size={24} />
                 </div>
              </div>
            ))}
          </div>

          <div className="card-premium p-4 flex flex-col md:flex-row items-center gap-4">
             <div className="flex-1 flex items-center gap-3 px-6 py-2 border-r border-gray-50">
                <Search size={16} className="text-gray-300" />
                <input placeholder="SEARCH_BY_ORDER_OR_USER..." className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-900 focus:outline-none w-full" />
             </div>
             <div className="flex items-center gap-3 px-6">
                <Filter size={16} className="text-gray-300" />
                <select 
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">ALL_TRANSACTIONS</option>
                  <option value="success">SUCCESS_ONLY</option>
                  <option value="pending">PENDING_QUEUE</option>
                  <option value="failed">FAILED_LOGS</option>
                </select>
             </div>
          </div>

          <div className="card-premium overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Entity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loadingPayments ? (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-[10px]">Loading Ledger...</td></tr>
                  ) : payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <p className="text-sm font-black text-gray-900 uppercase truncate max-w-[120px]">{p.razorpayOrderId}</p>
                         <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">ID: {p._id.slice(-6)}</p>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-bold text-gray-900">{p.userId?.name || "User"}</p>
                         <p className="text-[10px] text-gray-400 font-medium lowercase">{p.userId?.email}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-tighter">
                         {p.courseId?.title || p.programId?.title || "Manual"}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <p className="text-base font-black text-gray-900 tracking-tighter">₹{p.amount}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className={cn(
                           "mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest w-fit",
                           p.status === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                           p.status === "pending" ? "bg-amber-50 border-amber-100 text-amber-600" :
                           "bg-red-50 border-red-100 text-red-600"
                         )}>
                            {p.status}
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loadingCoupons ? (
              <div className="col-span-full py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-[10px]">Syncing Offers...</div>
           ) : coupons.map((coupon) => (
             <div key={coupon._id} className="card-premium p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                   <Ticket size={150} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-1">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{coupon.code}</h3>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                         {coupon.discountType === 'percentage' ? `${coupon.value}% Discount` : `₹${coupon.value} Flat OFF`}
                      </p>
                   </div>
                   <div className={cn(
                     "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                     coupon.isActive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
                   )}>
                      {coupon.isActive ? "Active" : "Disabled"}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-50 relative z-10">
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Usage</p>
                      <p className="text-sm font-black text-gray-900">{coupon.usageCount} / {coupon.usageLimit}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Expiry</p>
                      <p className="text-sm font-black text-gray-900">{new Date(coupon.expiresAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="flex gap-3 pt-4 relative z-10">
                   <button 
                     onClick={() => { setEditingCouponId(coupon._id); setCouponFormData({...coupon, expiresAt: coupon.expiresAt.split('T')[0]}); setShowCouponModal(true); }}
                     className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                   >
                      Modify
                   </button>
                   <button className="p-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={16} /></button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Manual Enrollment Modal */}
      {showManualEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 relative">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manual_Enroll</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Provision access bypass protocol</p>
              </div>
              <form onSubmit={handleManualEnroll} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Object ID</label>
                    <input required value={enrollData.userId} onChange={(e) => setEnrollData({...enrollData, userId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 focus:bg-white transition-all" placeholder="ID_0x00..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Object ID</label>
                    <input required value={enrollData.itemId} onChange={(e) => setEnrollData({...enrollData, itemId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 focus:bg-white transition-all" placeholder="ID_0x00..." />
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowManualEnroll(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                    <button type="submit" disabled={enrolling} className="flex-1 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20">Authorize</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
