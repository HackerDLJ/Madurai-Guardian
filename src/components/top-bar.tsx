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
    <header className="sticky top-0 z-40 w-full bg-background/50 backdrop-blur px-8 py-4 flex items-center justify-between">
      <div className="m3-pill-nav bg-white shadow-sm px-2">
        {topNavPills.map((pill) => {
          const isActive = mounted && (pathname === pill.href || (pill.href !== "/" && pathname.startsWith(pill.href)));
          
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
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            className="w-full bg-white border-none rounded-full py-2.5 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Search wards, alerts..." 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-full hover:bg-white text-muted-foreground transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-white text-muted-foreground transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <Link href="/profile">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm hover:scale-105 transition-all">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.displayName?.charAt(0) || "W"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
