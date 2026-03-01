"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Settings, Command } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <header className="sticky top-0 z-40 w-full bg-background/5 backdrop-blur-[32px] px-10 py-6 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-8 flex-1">
        {mounted && state === "collapsed" && (
          <SidebarTrigger className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-foreground hover:bg-white/10 transition-all duration-500 shadow-xl h-11 w-11 flex items-center justify-center shrink-0" />
        )}
        
        {/* Perfectly Aligned Search Bar */}
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-xs shadow-inner focus:ring-2 focus:ring-primary/30 focus:bg-white/10 outline-none transition-all duration-500 placeholder:text-muted-foreground/30 font-bold"
            placeholder="Search Intelligence Mesh..." 
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-30 pointer-events-none">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-bold">K</span>
          </div>
        </div>

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

      <div className="flex items-center gap-4 ml-10">
        <div className="flex items-center gap-2">
          <button className="h-11 w-11 rounded-xl hover:bg-white/5 text-muted-foreground/80 hover:text-foreground transition-all relative liquid-glass border-none group shrink-0 flex items-center justify-center">
            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background shadow-lg animate-pulse" />
          </button>
          
          <ThemeToggle />
          
          <button className="h-11 w-11 rounded-xl hover:bg-white/5 text-muted-foreground/80 hover:text-foreground transition-all liquid-glass border-none group shrink-0 flex items-center justify-center">
            <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </button>
        </div>

        <Link href="/profile" className="shrink-0">
          <Avatar className="w-11 h-11 border border-white/20 shadow-xl hover:scale-110 transition-all duration-500 ring-2 ring-primary/5">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-sm">
              {user?.displayName?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
