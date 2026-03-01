"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/5 backdrop-blur-lg px-8 py-6 flex items-center justify-between border-b border-white/10 transition-all duration-500">
      <div className="m3-pill-nav">
        {topNavPills.map((pill) => {
          // Use direct comparison for hydration safety in Next.js 15
          const isActive = pathname === pill.href || (pill.href !== "/" && pathname.startsWith(pill.href));
          
          return (
            <Link
              key={pill.href}
              href={pill.href}
              className={cn(
                "m3-pill-item text-muted-foreground hover:text-foreground",
                isActive && "active"
              )}
            >
              {pill.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-80 group">
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