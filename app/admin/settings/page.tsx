"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  Palette, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Layout,
  Mail,
  Lock,
  Cpu,
  Eye,
  Type
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = "general" | "security" | "notifications" | "appearance";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#EBBB54]" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Querying_System_Configs...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-10 pb-20 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black rounded uppercase tracking-widest border border-white/10">Admin</span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                SYSTEM_<span className="text-[#EBBB54]">SETTINGS</span>
              </h1>
           </div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
             Target: <span className="text-white">Global-Config</span> | Access: <span className="text-white">Full-Privilege</span>
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           {status === "success" && (
             <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <CheckCircle size={14} /> CONFIG_SYNCED
             </div>
           )}
           {status === "error" && (
             <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} /> SYNC_FAILED
             </div>
           )}
           <button 
             onClick={handleSubmit}
             disabled={saving}
             className="px-8 py-3 bg-[#EBBB54] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#EBBB54]/10 flex items-center gap-2 uppercase text-xs tracking-widest disabled:opacity-50"
           >
             {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
             <span>SAVE_CHANGES</span>
           </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all uppercase text-[10px] font-black tracking-widest border",
                 activeTab === tab.id 
                   ? "bg-[#EBBB54] text-black border-[#EBBB54] shadow-lg shadow-[#EBBB54]/20" 
                   : "bg-black border-white/5 text-gray-500 hover:border-white/10 hover:text-white"
               )}
             >
               <tab.icon size={16} />
               <span>{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9 bg-black border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Cpu size={200} />
           </div>

           <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              {activeTab === "general" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                      <Globe className="text-[#EBBB54]" /> Site_Identity
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Type size={12} /> Website_Name</label>
                         <input name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Layout size={12} /> Website_Logo_URL</label>
                         <input name="siteLogo" value={formData.siteLogo} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Public_Contact_Email</label>
                         <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">HQ_Address</label>
                         <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all" />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                      <Shield className="text-[#EBBB54]" /> System_Hardening
                   </h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> Password_Min_Length</label>
                         <input type="number" name="passwordMinLength" value={formData.passwordMinLength} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all" />
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                         <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Complex_Passwords</p>
                            <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-wider">Require special characters</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("requireSpecialChars")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.requireSpecialChars ? "bg-[#EBBB54]" : "bg-white/10"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              formData.requireSpecialChars ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                         <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Two-Factor_Auth</p>
                            <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-wider">Extra layer of protection</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("twoFactorAuth")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.twoFactorAuth ? "bg-[#EBBB54]" : "bg-white/10"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              formData.twoFactorAuth ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-red-600/5 border border-red-600/10 rounded-2xl">
                         <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Maintenance_Mode</p>
                            <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-wider">Take system offline</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("maintenanceMode")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.maintenanceMode ? "bg-red-600" : "bg-white/10"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              formData.maintenanceMode ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                      <Bell className="text-[#EBBB54]" /> Signal_Protocols
                   </h3>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-xs font-black text-white uppercase tracking-widest">Email_Alerts</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Send system updates via SMTP</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("enableEmailAlerts")} className={cn(
                           "w-14 h-7 rounded-full relative transition-all duration-300",
                           formData.enableEmailAlerts ? "bg-[#EBBB54]" : "bg-white/10"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                              formData.enableEmailAlerts ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-xs font-black text-white uppercase tracking-widest">In-App_Broadcasts</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Show popups in student dashboard</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("enableInAppNotifications")} className={cn(
                           "w-14 h-7 rounded-full relative transition-all duration-300",
                           formData.enableInAppNotifications ? "bg-[#EBBB54]" : "bg-white/10"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                              formData.enableInAppNotifications ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                      <Palette className="text-[#EBBB54]" /> Visual_Skin
                   </h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Eye size={12} /> Master_Theme</label>
                         <div className="grid grid-cols-3 gap-3">
                            {["dark", "light", "glass"].map((t) => (
                              <button 
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, theme: t })}
                                className={cn(
                                  "py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                  formData.theme === t ? "bg-[#EBBB54] text-black border-[#EBBB54]" : "bg-white/5 border-white/10 text-gray-600"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary_Accent_HEX</label>
                         <div className="flex items-center gap-4">
                            <input name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/30 transition-all" />
                            <div className="w-14 h-14 rounded-2xl border border-white/10" style={{ backgroundColor: formData.primaryColor }}></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </form>
        </div>
      </div>
    </div>
  );
}
