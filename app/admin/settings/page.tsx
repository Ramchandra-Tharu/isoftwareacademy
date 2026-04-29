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
  Type,
  ChevronRight,
  ShieldAlert
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
      if (res.ok) setFormData(await res.json());
    } catch (err) {
      console.error(err);
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
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading System Configuration...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any; desc: string }[] = [
    { id: "general", label: "General", icon: Globe, desc: "Site identity and contact info" },
    { id: "security", label: "Security", icon: Shield, desc: "Access control and hardening" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert protocols and SMTP" },
    { id: "appearance", label: "Appearance", icon: Palette, desc: "Visual skin and accenting" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">System_Settings</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Configure global parameters and security protocols.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {status === "success" && (
             <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
                <CheckCircle size={14} /> Synced
             </div>
           )}
           <button 
             onClick={handleSubmit}
             disabled={saving}
             className="btn-primary flex items-center gap-2 disabled:opacity-50"
           >
             {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
             <span>Save Configuration</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all text-left border",
                 activeTab === tab.id 
                   ? "bg-white border-blue-100 shadow-xl shadow-blue-600/5" 
                   : "bg-transparent border-transparent text-gray-400 hover:bg-white hover:border-gray-50 hover:text-gray-600"
               )}
             >
               <div className={cn(
                 "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                 activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
               )}>
                  <tab.icon size={20} />
               </div>
               <div className="flex-1">
                  <p className={cn("text-sm font-black uppercase tracking-tight", activeTab === tab.id ? "text-gray-900" : "text-gray-500")}>{tab.label}</p>
                  <p className="text-[10px] font-medium text-gray-400">{tab.desc}</p>
               </div>
               {activeTab === tab.id && <ChevronRight size={16} className="text-blue-600" />}
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-8 card-premium p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Cpu size={200} />
           </div>

           <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              {activeTab === "general" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Site_Identity</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Public-facing credentials</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">Website_Name</label>
                         <input name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">Website_Logo_URL</label>
                         <input name="siteLogo" value={formData.siteLogo} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">Public_Email</label>
                         <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 focus:bg-white transition-all" />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Access_Hardening</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global security protocols</p>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center justify-between p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Require_Complex_Passwords</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mandatory special characters and length</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("requireSpecialChars")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.requireSpecialChars ? "bg-blue-600" : "bg-gray-200"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                              formData.requireSpecialChars ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Two-Factor_Authentication</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Extra layer of protection for admin accounts</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("twoFactorAuth")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.twoFactorAuth ? "bg-blue-600" : "bg-gray-200"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                              formData.twoFactorAuth ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>

                      <div className="flex items-center justify-between p-8 bg-red-50 border border-red-100 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-red-600 uppercase tracking-tight flex items-center gap-2"><ShieldAlert size={16} /> Maintenance_Mode</p>
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Take the platform offline for updates</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("maintenanceMode")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.maintenanceMode ? "bg-red-600" : "bg-gray-200"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                              formData.maintenanceMode ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Communication_Logic</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">SMTP and In-app alert triggers</p>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Global_Email_Alerts</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Dispatch system updates via SMTP gateway</p>
                         </div>
                         <button type="button" onClick={() => handleToggle("enableEmailAlerts")} className={cn(
                           "w-12 h-6 rounded-full relative transition-all duration-300",
                           formData.enableEmailAlerts ? "bg-blue-600" : "bg-gray-200"
                         )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                              formData.enableEmailAlerts ? "right-1" : "left-1"
                            )} />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Visual_Experience</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global skin and accenting</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master_Theme</label>
                         <div className="grid grid-cols-2 gap-3">
                            {["light", "glass"].map((t) => (
                              <button 
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, theme: t })}
                                className={cn(
                                  "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                  formData.theme === t ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" : "bg-gray-50 border-gray-100 text-gray-400"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary_Accent</label>
                         <div className="flex items-center gap-4">
                            <input name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-100 transition-all" />
                            <div className="w-14 h-14 rounded-2xl border border-gray-100" style={{ backgroundColor: formData.primaryColor }}></div>
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
