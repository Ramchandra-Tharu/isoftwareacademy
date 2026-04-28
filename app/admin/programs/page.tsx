"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen,
  MoreVertical,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ProgramManagement() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/programs", {
        headers: { "x-user-role": "admin" }
      });
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      setError("An error occurred while fetching programs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": "admin" }
      });
      if (res.ok) {
        setPrograms(programs.filter(p => p._id !== id));
      } else {
        alert("Failed to delete program");
      }
    } catch (err) {
      alert("Error deleting program");
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            PROGRAM <span className="text-[#EBBB54]">MANAGEMENT</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Group courses into professional tracks</p>
        </div>
        <Link href="/admin/programs/new" className="flex items-center gap-2 px-6 py-3 bg-[#EBBB54] text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#EBBB54]/10 uppercase text-xs">
          <Plus size={18} />
          <span>New_Program</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-black border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="FILTER_BY_TITLE_OR_DESC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all"
          />
        </div>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <div key={program._id} className="bg-black border border-white/5 hover:border-white/20 p-6 rounded-2xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#EBBB54]/10 flex items-center justify-center text-[#EBBB54] border border-[#EBBB54]/20 group-hover:scale-110 transition-transform">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#EBBB54] transition-colors uppercase tracking-tight">{program.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen size={12} className="text-[#EBBB54]" /> {program.courses?.length || 0} COURSES
                    </span>
                    {program.duration && (
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        DUR: {program.duration}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {program._id.slice(-6)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Link href={`/admin/programs/${program._id}/edit`} className="px-4 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                    <Edit2 size={14} /> EDIT
                 </Link>
                 <button onClick={() => handleDelete(program._id)} className="px-4 py-2 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all flex items-center gap-2">
                    <Trash2 size={14} /> DELETE
                 </button>
                 <button className="p-2 text-gray-600 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">No programs found in system</p>
          </div>
        )}
      </div>
    </div>
  );
}
