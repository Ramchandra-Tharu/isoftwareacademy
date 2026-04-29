import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative";
  description: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = "positive",
  description 
}: StatsCardProps) {
  return (
    <div className="group p-8 rounded-[1.5rem] bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between relative z-10 mb-6">
        <div className="space-y-1">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
           <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
          <Icon size={22} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10 pt-4 border-t border-gray-50">
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
            trendType === "positive" ? "text-emerald-500" : "text-red-500"
          )}>
            {trendType === "positive" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{description}</span>
      </div>
    </div>
  );
}
