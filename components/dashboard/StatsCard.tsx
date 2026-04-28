import React from "react";
import { LucideIcon } from "lucide-react";
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
    <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#EBBB54]/30 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#EBBB54]/5 rounded-full blur-2xl group-hover:bg-[#EBBB54]/10 transition-all duration-500"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#EBBB54]/10 text-gray-400 group-hover:text-[#EBBB54] transition-all">
          <Icon size={24} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 relative z-10">
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            trendType === "positive" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend}
          </span>
        )}
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </div>
  );
}
