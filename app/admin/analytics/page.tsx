"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Download,
  Activity,
  Award,
  ChevronDown
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AnalyticsPage() {
  const performanceMetrics = [
    { label: "Average Score", value: "78.4%", icon: Target, trend: "+2.4%", trendUp: true },
    { label: "Completion Rate", value: "92.1%", icon: Activity, trend: "+5.1%", trendUp: true },
    { label: "Avg. Time per Assessment", value: "42m 15s", icon: Clock, trend: "-3m 20s", trendUp: true },
    { label: "Certificates Awarded", value: "1,245", icon: Award, trend: "+12.5%", trendUp: true },
  ];

  const recentResults = [
    { id: 1, user: "Alex Johnson", assessment: "Frontend Engineering Core", score: 92, time: "45m 12s", date: "Today, 10:30 AM" },
    { id: 2, user: "Sarah Smith", assessment: "Backend Architecture", score: 85, time: "38m 45s", date: "Today, 09:15 AM" },
    { id: 3, user: "Michael Chen", assessment: "Database Design Principles", score: 64, time: "55m 20s", date: "Yesterday, 14:20 PM" },
    { id: 4, user: "Emily Davis", assessment: "Frontend Engineering Core", score: 96, time: "41m 05s", date: "Yesterday, 11:45 AM" },
  ];

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Results_&_Analytics</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Deep insights into candidate performance and assessment efficacy.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="btn-secondary flex items-center gap-2 text-xs bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              Last 30 Days <ChevronDown size={14} />
           </button>
           <button className="btn-primary flex items-center gap-2 text-xs bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20">
              <Download size={16} /> Export Data
           </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, i) => (
          <div key={i} className="card-premium p-8 group hover:border-blue-100 transition-colors">
             <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                   <metric.icon size={22} />
                </div>
                <div className={cn(
                   "flex items-center gap-1 text-xs font-black uppercase tracking-widest",
                   metric.trendUp ? "text-emerald-500" : "text-red-500"
                )}>
                   {metric.trendUp ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />} 
                   {metric.trend}
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{metric.label}</p>
             <h3 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">{metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Performance Trend Chart Placeholder */}
         <div className="lg:col-span-2 card-premium p-10 space-y-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h4 className="text-xl font-black tracking-tight uppercase">Score_Distribution</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Aggregate performance across all active assessments</p>
               </div>
            </div>
            
            <div className="h-[300px] w-full flex items-end gap-2 pt-10">
               {/* Faux Bar Chart */}
               {[10, 25, 40, 75, 100, 85, 60, 45, 30, 15].map((h, i) => (
                 <div key={i} className="flex-1 group/bar relative flex flex-col items-center justify-end h-full">
                    <div 
                      className="w-full bg-blue-50 group-hover/bar:bg-blue-600 rounded-t-xl transition-all duration-500" 
                      style={{ height: `${h}%` }}
                    />
                    <span className="mt-2 text-[9px] font-black text-gray-400">{(i+1)*10}%</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Accuracy by Topic */}
         <div className="lg:col-span-1 card-premium p-10 flex flex-col space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-xl font-black tracking-tight uppercase">Topic_Accuracy</h4>
               <Target size={18} className="text-blue-600" />
            </div>
            
            <div className="space-y-6 flex-1">
               {[
                 { topic: "React.js", accuracy: 88, color: "bg-blue-500" },
                 { topic: "Node.js", accuracy: 76, color: "bg-indigo-500" },
                 { topic: "SQL", accuracy: 62, color: "bg-amber-500" },
                 { topic: "AWS", accuracy: 91, color: "bg-emerald-500" },
                 { topic: "System Design", accuracy: 54, color: "bg-red-500" },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-gray-900">{item.topic}</span>
                       <span className="text-[10px] font-black text-gray-500">{item.accuracy}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.accuracy}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Recent Submissions */}
      <div className="card-premium overflow-hidden">
         <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h4 className="text-xl font-black tracking-tight uppercase">Recent_Submissions</h4>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Candidate</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Score</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Time Taken</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {recentResults.map((result) => (
                    <tr key={result.id} className="group hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-black uppercase">
                                {result.user.charAt(0)}
                             </div>
                             <span className="text-sm font-bold text-gray-900">{result.user}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-600">{result.assessment}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className={cn(
                             "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md",
                             result.score >= 80 ? "bg-emerald-50 text-emerald-600" : result.score >= 60 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                          )}>
                             {result.score}%
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-500">{result.time}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{result.date}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
