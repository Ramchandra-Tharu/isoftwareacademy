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
    <div className="space-y-8 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            Program Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Group courses into curated professional learning tracks.</p>
        </div>
        <Link href="/admin/programs/new" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/10 text-sm select-none">
          <Plus size={18} />
          <span>New Program</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Filters & Search */}
      <div className="relative group w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search programs by title or description..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
        />
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <div key={program._id} className="bg-white border border-gray-100 hover:border-blue-100 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">{program.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      <BookOpen size={13} className="text-blue-500" /> {program.courses?.length || 0} Courses
                    </div>
                    {program.duration && (
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider border-l border-gray-200 pl-4">
                        {program.duration}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-l border-gray-200 pl-4">
                      ID: {program._id.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <Link href={`/admin/programs/${program._id}/edit`} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                    <Edit2 size={14} /> Edit
                 </Link>
                 <button onClick={() => handleDelete(program._id)} className="px-4 py-2 bg-white border border-gray-200 text-red-600 hover:text-red-700 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm">
                    <Trash2 size={14} /> Delete
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-center space-y-2 bg-gray-50/50">
             <BarChart3 size={40} className="text-gray-300 mb-2" />
             <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">No programs found</p>
             <p className="text-xs text-gray-500 font-medium">Start organizing tracks by clicking "New Program".</p>
          </div>
        )}
      </div>
    </div>
  );
}
