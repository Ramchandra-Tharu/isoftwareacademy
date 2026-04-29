"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Ban, 
  Mail,
  Loader2,
  Trash2
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
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
            USER <span className="text-[#EBBB54]">COMMAND</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Manage administrative privileges and access</p>
        </div>
      </div>

      <div className="bg-black border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#EBBB54] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="FILTER_USERS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#EBBB54]/30 focus:bg-white/5 transition-all"
          />
        </div>
      </div>

      <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/10">
              <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">User_Identity</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Role_Level</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Joined_Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EBBB54] font-black">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-[#EBBB54] transition-colors uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] text-gray-600 font-bold">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button 
                    onClick={() => toggleRole(user._id, user.role)}
                    className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                      user.role === "admin" ? "bg-[#EBBB54]/10 border-[#EBBB54]/20 text-[#EBBB54]" : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="px-6 py-5 text-[10px] text-gray-700 font-bold uppercase">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="p-2 text-gray-700 hover:text-white transition-colors"><Mail size={16} /></button>
                    <button onClick={() => deleteUser(user._id)} className="p-2 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    <button className="p-2 text-gray-700 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
