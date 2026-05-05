"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  HelpCircle, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  BarChart3,
  Shield,
  Cpu
} from "lucide-react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: BarChart3, label: "Programs", href: "/admin/programs" },
  { icon: HelpCircle, label: "Quiz", href: "/admin/quizzes" },
  { icon: Award, label: "Certificates", href: "/admin/certifications" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: MessageSquare, label: "Moderation", href: "/admin/comments" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "flex items-center h-20 px-6 border-b border-gray-50 bg-gray-50/30",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="#0f172a" />
                  <path d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" fill="none" stroke="#f8fafc" strokeWidth="2" opacity="0.2" />
                  <path d="M30 35 L50 25 L70 35 L70 65 L50 75 L30 65 Z" fill="#f8fafc" />
                  <path d="M50 25 V75 M30 35 L70 65 M70 35 L30 65" stroke="#0f172a" strokeWidth="1" />
               </svg>
            </div>
            <span className="text-[11px] font-black tracking-tight uppercase text-gray-900">
               iSoftware <span className="text-blue-600">Lab</span>
            </span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm",
            isCollapsed && "mt-2"
          )}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-600/5" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
              )} />
              {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-50">
        <Link 
          href="/api/auth/signout"
          className={cn(
            "flex items-center w-full gap-3 px-4 py-3 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} className="group-hover:text-red-600" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
