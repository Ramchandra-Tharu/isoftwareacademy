"use client";

import React, { useState, useEffect } from "react";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Calendar, 
  Percent, 
  DollarSign, 
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    value: 10,
    minPurchase: 0,
    expiresAt: "",
    usageLimit: 100,
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, ...formData } : formData;

    try {
      const res = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-10 pb-20 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#EBBB54] text-black text-[10px] font-black rounded uppercase tracking-widest animate-pulse">Marketing_Engine</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                COUPON_<span className="text-[#EBBB54]">SYSTEM</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             Manage promotional codes and discount protocols
           </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-6 py-3 bg-[#EBBB54] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[#EBBB54]/20"
        >
          <Plus size={16} /> Create_New_Coupon
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
             <Loader2 className="animate-spin text-[#EBBB54] mx-auto mb-4" size={32} />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Syncing_Coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-gray-700 italic">No coupons configured.</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="bg-black border border-white/5 rounded-[2rem] p-8 space-y-6 group hover:border-[#EBBB54]/30 transition-all relative overflow-hidden">
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
                     {coupon.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
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
                      setEditingId(coupon._id);
                      setFormData({
                        code: coupon.code,
                        discountType: coupon.discountType,
                        value: coupon.value,
                        minPurchase: coupon.minPurchase,
                        expiresAt: coupon.expiresAt.split('T')[0],
                        usageLimit: coupon.usageLimit,
                        isActive: coupon.isActive
                      });
                      setShowModal(true);
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                     <Edit3 size={14} /> EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon._id)}
                    className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl transition-all"
                  >
                     <Trash2 size={14} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{editingId ? "Modify_Coupon" : "Create_Coupon"}</h3>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Define discount parameters</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coupon_Code</label>
                    <input 
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                      placeholder="e.g. FLAT50" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</label>
                       <select 
                         value={formData.discountType}
                         onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30 cursor-pointer"
                       >
                          <option value="percentage">PERCENT (%)</option>
                          <option value="fixed">FIXED (₹)</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Value</label>
                       <input 
                         type="number"
                         required
                         value={formData.value}
                         onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Usage_Limit</label>
                       <input 
                         type="number"
                         required
                         value={formData.usageLimit}
                         onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-sm font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expiry_Date</label>
                       <input 
                         type="date"
                         required
                         value={formData.expiresAt}
                         onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 text-[10px] font-bold text-white focus:outline-none focus:border-[#EBBB54]/30" 
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#EBBB54]"
                    />
                    <label htmlFor="isActive" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">Coupon_is_Active</label>
                 </div>

                 <div className="flex gap-4 pt-6 border-t border-white/5">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-4 bg-[#EBBB54] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#EBBB54]/10"
                    >
                      EXECUTE_SAVE
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
