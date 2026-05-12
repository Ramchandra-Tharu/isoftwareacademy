"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, FileCheck, Calendar, Ghost } from "lucide-react";

interface QuizAttempt {
  title: string;
  score: number;
  passed: boolean;
  date: string;
}

interface AnalyticsProps {
  analytics: {
    attemptsTrend: QuizAttempt[];
    summary: {
      totalAttempts: number;
      passed: number;
      failed: number;
      successRate: number;
    };
  };
}

export default function PerformanceAnalytics({ analytics }: AnalyticsProps) {
  const { attemptsTrend, summary } = analytics;

  // 1. Fallback if no activity
  if (!attemptsTrend || attemptsTrend.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
          <Ghost size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-500 text-sm max-w-xs">Complete your first quiz to begin tracking your genuine learning performance and accuracy metrics.</p>
      </div>
    );
  }

  // 2. Calculations for SVG Chart
  const chartHeight = 200;
  const chartWidth = 1000; // Generic internal viewBox coordinate
  const padding = 40;
  const usableHeight = chartHeight - padding * 2;
  const usableWidth = chartWidth - padding * 2;

  // Ensure at least 2 data points for a line, padding if single point
  const dataPoints = attemptsTrend.length === 1 
    ? [{...attemptsTrend[0], score: 0}, attemptsTrend[0]] 
    : attemptsTrend;

  const xStep = usableWidth / Math.max(1, dataPoints.length - 1);

  // Calculate path
  let linePath = "";
  let areaPath = "";
  const points: { x: number; y: number; score: number; title: string }[] = [];

  dataPoints.forEach((pt, index) => {
    const x = padding + index * xStep;
    const y = padding + usableHeight - (pt.score / 100) * usableHeight;
    
    points.push({ x, y, score: pt.score, title: pt.title });
    
    if (index === 0) {
      linePath += `M ${x} ${y}`;
      areaPath += `M ${x} ${chartHeight} L ${x} ${y}`;
    } else {
      // Simple Catmull-Rom approximation / Bezier curve for smooth charts
      const prevPoint = points[index - 1];
      const cx = (prevPoint.x + x) / 2;
      linePath += ` C ${cx} ${prevPoint.y}, ${cx} ${y}, ${x} ${y}`;
      areaPath += ` C ${cx} ${prevPoint.y}, ${cx} ${y}, ${x} ${y}`;
    }
  });

  areaPath += ` L ${points[points.length - 1].x} ${chartHeight} Z`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-600" />
            Learning Performance
          </h2>
          <p className="text-sm text-gray-500 mt-1">Based on your genuine quiz interaction data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Accuracy Rate</span>
             <span className="text-2xl font-bold text-indigo-600">{summary.successRate}%</span>
          </div>
        </div>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-50 divide-x divide-gray-50 bg-gray-50/30">
        <div className="p-6 text-center">
          <div className="text-xs font-medium text-gray-400 uppercase mb-1">Passed</div>
          <div className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
            <FileCheck size={18} /> {summary.passed}
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="text-xs font-medium text-gray-400 uppercase mb-1">Retries Needed</div>
          <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-2">
            <Target size={18} /> {summary.failed}
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="text-xs font-medium text-gray-400 uppercase mb-1">Attempts</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Award size={18} /> {summary.totalAttempts}
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="text-xs font-medium text-gray-400 uppercase mb-1">Recent Trend</div>
          <div className="text-xl font-bold text-indigo-600">
            +{attemptsTrend[attemptsTrend.length - 1]?.score}%
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="p-6 sm:p-8 flex-1 relative group">
        <h3 className="text-sm font-semibold text-gray-600 mb-6 flex items-center gap-2">
          <Calendar size={16} /> Last {attemptsTrend.length} Performance Trajectory
        </h3>

        <div className="relative w-full h-[220px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            preserveAspectRatio="none" 
            className="w-full h-full overflow-visible"
          >
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val, i) => {
              const y = padding + usableHeight - (val / 100) * usableHeight;
              return (
                <g key={i}>
                  <line 
                    x1={padding} y1={y} x2={chartWidth - padding} y2={y} 
                    stroke="#f1f5f9" strokeWidth="1" 
                    strokeDasharray="5,5"
                  />
                  <text x="0" y={y + 4} fontSize="12" className="fill-gray-300 font-medium">{val}%</text>
                </g>
              );
            })}

            {/* Area Gradient definition */}
            <defs>
              <linearGradient id="gradient-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Render Area */}
            <motion.path 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              d={areaPath} fill="url(#gradient-fill)" 
            />

            {/* Render Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={linePath} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
            />

            {/* Render Points */}
            {points.map((p, i) => (
              <g key={i} className="group/point">
                <motion.circle 
                  initial={{ r: 0 }}
                  animate={{ r: 5 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  cx={p.x} cy={p.y} r="5" 
                  fill={p.score >= 70 ? "#10b981" : "#f59e0b"} 
                  stroke="#fff" strokeWidth="2" 
                  className="shadow-md cursor-pointer transition-all hover:scale-150 hover:stroke-gray-900"
                />
                {/* Dynamic Tooltip on hover rendered in pure SVG, will hide/reveal using Tailwind */}
                <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <rect x={p.x - 50} y={p.y - 45} width="100" height="35" rx="6" fill="#1e293b" />
                  <polygon points={`${p.x - 5},${p.y - 12} ${p.x + 5},${p.y - 12} ${p.x},${p.y - 5}`} fill="#1e293b" />
                  <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">{p.score}%</text>
                </g>
              </g>
            ))}
          </svg>
        </div>
        
        {/* X-Axis Labels beneath the SVG */}
        <div className="mt-4 flex justify-between px-[40px]">
          {dataPoints.map((p, i) => (
            <div key={i} className="flex flex-col items-center text-center w-0 overflow-visible relative">
              <span className="whitespace-nowrap absolute -translate-x-1/2 text-[10px] font-bold text-gray-400 truncate max-w-[60px]" title={p.title}>
                 {attemptsTrend.length === 1 && i === 0 ? "Start" : p.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
