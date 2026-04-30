"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  ChevronRight
} from "lucide-react";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/settings");
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchSettings();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });
      if (res.ok) {
        await update({ name: formData.name });
        setMessage({ type: "success", text: "Identity parameters updated." });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accessing Security Core...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-12 pb-20 font-sans">
      <div>
         <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Account_Configuration</h1>
         <p className="text-gray-500 font-medium mt-1">Manage your identity, security protocols, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
           {[
             { label: "Profile", icon: User },
             { label: "Security", icon: Shield },
             { label: "Notifications", icon: Bell },
           ].map((tab) => (
             <button
               key={tab.label}
               onClick={() => setActiveTab(tab.label)}
               className={cn(
                 "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === tab.label 
                   ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                   : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
               )}
             >
               <div className="flex items-center gap-3">
                  <tab.icon size={16} />
                  {tab.label}
               </div>
               {activeTab === tab.label && <ChevronRight size={14} />}
             </button>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
           <form onSubmit={handleSubmit} className="card-premium p-10 space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Identity_Settings</h3>
                 <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                       {session?.user?.image || (session?.user as any)?.picture || (session?.user as any)?.imageUrl ? (
                         <img src={session?.user?.image || (session?.user as any)?.picture || (session?.user as any)?.imageUrl} className="w-full h-full object-cover" />
                       ) : (
                         <User size={32} className="text-gray-200" />
                       )}
                    </div>
                    <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem] text-white">
                       <Camera size={20} />
                    </div>
                 </div>
              </div>
              
              {message && (
                <div className={cn(
                  "p-5 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border",
                  message.type === "success" 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-red-50 text-red-600 border-red-100"
                )}>
                   {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                   {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                    <div className="relative group">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-100 focus:bg-white transition-all shadow-sm shadow-gray-900/5"
                         placeholder="IDENT_NAME"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Interface</label>
                    <div className="relative opacity-60 cursor-not-allowed">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input 
                         type="email" 
                         value={formData.email}
                         disabled
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-400 cursor-not-allowed"
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex justify-end">
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                 >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Commit Changes
                 </button>
              </div>
           </form>

           {/* Security Hub */}
           <div className="card-premium p-10 space-y-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Security_Operations</h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                       <Shield size={22} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Two-Factor Authentication</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Provision additional layer of security</p>
                    </div>
                 </div>
                 <button className="px-6 py-3 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-xl hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                    Configure
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
