"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Settings } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-background/5 backdrop-blur-lg px-8 py-6 flex items-center justify-between border-b border-white/10 transition-all duration-500">
      <div className="flex items-center gap-6">
        {/* Un-collapsed Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <span className="hidden sm:block text-lg font-bold tracking-tight text-foreground whitespace-nowrap">Madurai Guardian</span>
        </Link>

        {mounted && state === "collapsed" && (
          <SidebarTrigger className="rounded-xl bg-white/30 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/50 transition-all duration-300 shadow-sm" />
        )}
        
        <div className="m3-pill-nav bg-white/20 backdrop-blur-md border border-white/20 shadow-sm px-2 min-h-[44px] flex items-center">
          {mounted && topNavPills.map((pill) => {
            const isActive = pathname === pill.href || (pill.href !== "/" && pathname.startsWith(pill.href));
            
            return (
              <Link
                key={pill.href}
                href={pill.href}
                className={cn(
                  "m3-pill-item text-muted-foreground hover:text-foreground transition-all duration-300",
                  isActive && "active"
                )}
              >
                {pill.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-80 group hidden lg:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-full py-3 pl-12 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:bg-white/40 outline-none transition-all duration-300 placeholder:text-muted-foreground/60"
            placeholder="Search wards, alerts..." 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-full hover:bg-white/30 text-muted-foreground hover:text-foreground transition-all relative liquid-glass border-none">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white shadow-lg animate-pulse" />
          </button>
          <button className="p-3 rounded-full hover:bg-white/30 text-muted-foreground hover:text-foreground transition-all liquid-glass border-none">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <Link href="/profile">
          <Avatar className="w-12 h-12 border-2 border-white shadow-xl hover:scale-110 transition-all duration-300 ring-4 ring-primary/5">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {user?.displayName?.charAt(0) || "W"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
