"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Loader2, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function QuizAnalyticsPage() {
  const params = useParams();
  const quizId = params?.id;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!quizId) return;
      try {
        const res = await fetch(`/api/quizzes/${quizId}/analytics`);
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        } else {
          setError("Failed to load analytics");
        }
      } catch (err) {
        setError("Error fetching analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [quizId]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-bold">Analytics Unavailable</p>
        <p className="text-sm mt-2">{error}</p>
        <Link href="/admin/quizzes" className="inline-block mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white border border-white/5">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">ANALYTICS_<span className="text-[#EBBB54]">DASHBOARD</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{data.quizTitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-[#EBBB54] group-hover:scale-110 transition-transform duration-500">
             <Users size={120} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Total_Attempts</p>
          <p className="text-5xl font-black text-white">{data.totalAttempts}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-green-500 group-hover:scale-110 transition-transform duration-500">
             <CheckCircle size={120} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Pass_Rate</p>
          <p className="text-5xl font-black text-white">{data.passRate.toFixed(1)}%</p>
        </div>

        <div className="bg-[#EBBB54] rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-[#EBBB54]/20">
          <div className="absolute -right-4 -top-4 opacity-10 text-black group-hover:scale-110 transition-transform duration-500">
             <BarChart3 size={120} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60 mb-2">Average_Score</p>
          <p className="text-5xl font-black text-black">{data.averageScore.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-black border border-white/10 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xs font-black text-[#EBBB54] uppercase tracking-[0.3em] border-l-2 border-[#EBBB54] pl-3">ATTEMPT_LOGS</h2>
        </div>
        
        {data.attempts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm font-bold uppercase tracking-widest">No attempts recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-gray-500 font-black">
                <tr>
                  <th className="px-8 py-4">Student</th>
                  <th className="px-8 py-4">Score</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Time Spent</th>
                  <th className="px-8 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.attempts.map((attempt: any) => {
                   const durationMs = new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime();
                   const durationMins = Math.floor(durationMs / 60000);
                   const durationSecs = Math.floor((durationMs % 60000) / 1000);

                   return (
                     <tr key={attempt._id} className="hover:bg-white/[0.02] transition-colors">
                       <td className="px-8 py-5">
                         <p className="font-bold text-white">{attempt.userId?.name || "Unknown User"}</p>
                         <p className="text-[10px] text-gray-500">{attempt.userId?.email || "No Email"}</p>
                       </td>
                       <td className="px-8 py-5">
                         <span className="font-bold">{attempt.score} / {attempt.maxScore}</span>
                         <span className="ml-2 text-[10px] text-gray-500">({attempt.percentage.toFixed(1)}%)</span>
                       </td>
                       <td className="px-8 py-5">
                         {attempt.passed ? (
                           <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">Passed</span>
                         ) : (
                           <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">Failed</span>
                         )}
                       </td>
                       <td className="px-8 py-5 text-gray-400 flex items-center gap-2">
                         <Clock size={14} />
                         {durationMins > 0 ? `${durationMins}m ` : ''}{durationSecs}s
                       </td>
                       <td className="px-8 py-5 text-gray-400">
                         {new Date(attempt.createdAt).toLocaleDateString()}
                       </td>
                     </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
