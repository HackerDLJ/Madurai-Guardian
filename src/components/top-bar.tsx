"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Settings, Command } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const topNavPills = [
  { label: "Dashboard", href: "/" },
  { label: "WtE", href: "/wte-optimization" },
  { label: "Credits", href: "/credits" },
  { label: "Reports", href: "/status" },
  { label: "Map", href: "/map" },
  { label: "Profile", href: "/profile" },
];

export function TopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/5 backdrop-blur-[32px] px-10 py-8 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-10">
        {/* Fixed App Branding - Detached from Sidebar */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-[20px] bg-primary flex items-center justify-center shadow-[0_12px_32px_rgba(66,133,244,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-foreground leading-none">Madurai Guardian</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-1.5 opacity-80">iOS 26 Liquid UI</span>
          </div>
        </Link>

        {mounted && state === "collapsed" && (
          <SidebarTrigger className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-foreground hover:bg-white/10 transition-all duration-500 shadow-xl" />
        )}
        
        <nav className="hidden xl:flex m3-pill-nav">
          {mounted && topNavPills.map((pill) => {
            const isActive = pathname === pill.href || (pill.href !== "/" && pathname.startsWith(pill.href));
            
            return (
              <Link
                key={pill.href}
                href={pill.href}
                className={cn(
                  "m3-pill-item",
                  isActive && "active"
                )}
              >
                {pill.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative w-72 group hidden md:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full py-4 pl-12 pr-6 text-xs shadow-inner focus:ring-2 focus:ring-primary/30 focus:bg-white/10 outline-none transition-all duration-500 placeholder:text-muted-foreground/30 font-bold"
            placeholder="Search Intelligence..." 
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-30">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-bold">K</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-4 rounded-2xl hover:bg-white/5 text-muted-foreground/80 hover:text-foreground transition-all relative liquid-glass border-none group">
            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background shadow-lg animate-pulse" />
          </button>
          <button className="p-4 rounded-2xl hover:bg-white/5 text-muted-foreground/80 hover:text-foreground transition-all liquid-glass border-none group">
            <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </button>
        </div>

        <Link href="/profile">
          <Avatar className="w-14 h-14 border-2 border-white/20 shadow-2xl hover:scale-110 transition-all duration-500 ring-4 ring-primary/5">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
              {user?.displayName?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}