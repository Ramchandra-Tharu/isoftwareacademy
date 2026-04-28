"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  HelpCircle, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
  { icon: BarChart2, label: "Progress", href: "/dashboard/progress" },
  { icon: HelpCircle, label: "Quiz", href: "/dashboard/quiz" },
  { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
  { icon: MessageSquare, label: "Comments", href: "/dashboard/comments" },
];

import { useSession } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-[#111111] border-r border-white/5 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-[#EBBB54] to-[#f5d085] bg-clip-text text-transparent">
            iSoftware Lab
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {session?.user?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600/20 transition-all group mb-6"
          >
            <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="font-bold uppercase tracking-tighter">Admin Panel</span>}
          </Link>
        )}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#EBBB54] text-black shadow-[0_0_20px_rgba(235,187,84,0.3)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-black" : "group-hover:text-[#EBBB54]")} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-white/5">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
            pathname === "/dashboard/settings" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings size={22} className="group-hover:text-[#EBBB54]" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>
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
