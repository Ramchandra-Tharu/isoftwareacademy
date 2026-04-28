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
  BarChart3
} from "lucide-react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Student Management", href: "/admin/users" },
  { icon: BookOpen, label: "Course Management", href: "/admin/courses" },
  { icon: BarChart3, label: "Programs Management", href: "/admin/programs" },
  { icon: HelpCircle, label: "Quiz Management", href: "/admin/quizzes" },
  { icon: Award, label: "Certifications", href: "/admin/certifications" },
  { icon: CreditCard, label: "Payments & Enroll", href: "/admin/payments" },
  { icon: MessageSquare, label: "Moderation", href: "/admin/comments" },
  { icon: Settings, label: "System Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-neutral-950 border-r border-white/10 transition-all duration-300 ease-in-out font-mono",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex items-center justify-between h-24 px-6 border-b border-white/5 bg-white/[0.01]">
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#EBBB54] tracking-tighter uppercase">
              ROOT@SYS
            </span>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                 Privilege: Level-0
               </span>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#EBBB54] text-black" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-black" : "group-hover:text-[#EBBB54]")} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          href="/get-started"
          className="flex items-center w-full gap-3 px-3 py-3 text-gray-400 rounded-xl hover:bg-white/5 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={22} className="group-hover:text-red-400" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
