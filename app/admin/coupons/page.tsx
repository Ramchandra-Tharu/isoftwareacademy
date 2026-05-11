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
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <h1 className="text-4xl font-light tracking-tight text-gray-900">
                Coupon System
              </h1>
           </div>
           <p className="text-gray-500 text-sm font-medium">
             Manage promotional codes and active discount campaigns.
           </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/10"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
             <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
             <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Syncing Coupons Database...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-500 font-medium text-sm bg-gray-50/50 space-y-1">
            <p className="text-gray-900 font-bold text-base">No coupons configured</p>
            <p>Get started by creating a new promotional code above.</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white border border-gray-100 rounded-2xl p-8 space-y-6 group hover:border-blue-100 hover:shadow-md transition-all relative overflow-hidden">
               
               <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-0.5">
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none">{coupon.code}</h3>
                     <p className="text-base font-extrabold text-emerald-600 pt-1">
                        {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                     </p>
                  </div>
                  <div className={cn(
                    "px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                    coupon.isActive ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
                  )}>
                     {coupon.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                     {coupon.isActive ? "Active" : "Disabled"}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  <div className="space-y-0.5">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Usage</p>
                     <p className="text-sm font-bold text-gray-800">{coupon.usageCount} / {coupon.usageLimit}</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expiry</p>
                     <p className="text-sm font-bold text-gray-800">{new Date(coupon.expiresAt).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="flex gap-2 pt-2 relative z-10">
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
                    className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-2"
                  >
                     <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon._id)}
                    className="px-4 py-2.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all border border-gray-200 hover:border-red-100 shadow-sm flex items-center justify-center"
                  >
                     <Trash2 size={15} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                 <h3 className="text-xl font-bold text-gray-900 leading-none">{editingId ? "Modify Coupon" : "Create New Coupon"}</h3>
                 <p className="text-xs text-gray-500 font-medium mt-1">Define the discount rule and activation status.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Coupon Code</label>
                    <input 
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all" 
                      placeholder="e.g. SUMMER25" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-700">Discount Type</label>
                       <select 
                         value={formData.discountType}
                         onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-200 transition-all cursor-pointer"
                       >
                          <option value="percentage">Percent (%)</option>
                          <option value="fixed">Fixed (₹)</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-700">Value</label>
                       <input 
                         type="number"
                         required
                         value={formData.value}
                         onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-200 transition-all" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-700">Usage Limit</label>
                       <input 
                         type="number"
                         required
                         value={formData.usageLimit}
                         onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-200 transition-all" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-700">Expiry Date</label>
                       <input 
                         type="date"
                         required
                         value={formData.expiresAt}
                         onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-200 transition-all" 
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pt-1">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">Coupon is currently active</label>
                 </div>

                 <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-all border border-gray-200"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      Save Coupon
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
