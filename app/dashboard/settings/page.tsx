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
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        console.error("Failed to fetch settings:", error);
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
        await update({ name: formData.name }); // Update client-side session
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
        <p className="text-gray-500 font-medium">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10 pb-10">
      <div>
         <h1 className="text-4xl font-bold font-serif text-white mb-2">Account Settings</h1>
         <p className="text-gray-400">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Tabs (Sidebar style inside page) */}
        <div className="lg:col-span-1 space-y-2">
           {[
             { label: "Profile Info", icon: User, active: true },
             { label: "Security", icon: Shield, active: false },
             { label: "Notifications", icon: Bell, active: false },
           ].map((tab) => (
             <button
               key={tab.label}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                 tab.active 
                   ? "bg-[#EBBB54] text-black shadow-lg" 
                   : "text-gray-400 hover:bg-white/5 hover:text-white"
               }`}
             >
               <tab.icon size={18} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
              <h3 className="text-xl font-bold text-white">Profile Information</h3>
              
              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                  message.type === "success" 
                    ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                   {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                   {message.text}
                </div>
              )}

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#EBBB54]/20 focus:border-[#EBBB54]/50 transition-all"
                         placeholder="Enter your full name"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative opacity-60">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                       <input 
                         type="email" 
                         value={formData.email}
                         disabled
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                         placeholder="your@email.com"
                       />
                    </div>
                    <p className="text-[10px] text-gray-600 px-2">Email address cannot be changed for OAuth accounts.</p>
                 </div>
              </div>

              <div className="pt-4 flex justify-end">
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="flex items-center gap-2 px-8 py-3.5 bg-[#EBBB54] text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving..." : "Save Changes"}
                 </button>
              </div>
           </form>

           {/* Passive Security Area */}
           <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Security</h3>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EBBB54]/10 flex items-center justify-center text-[#EBBB54]">
                       <Shield size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                       <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/10">
                    Enable
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
