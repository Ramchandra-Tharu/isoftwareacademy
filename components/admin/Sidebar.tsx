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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
               <Cpu size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase text-gray-900">
               ADMIN_<span className="text-blue-600">PANEL</span>
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
