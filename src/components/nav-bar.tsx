
"use client";

import { Home, Map as MapIcon, Plus, ClipboardList, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: MapIcon, label: "Map", href: "/map" },
  { icon: Plus, label: "Report", href: "/report/new", isFab: true },
  { icon: ClipboardList, label: "Status", href: "/status" },
  { icon: BookOpen, label: "Hub", href: "/hub" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* FAB - Material 3 Rounded Square Style */}
      <Link
        href="/report/new"
        className="m3-fab lg:hidden"
        title="New Report"
      >
        <Plus className="w-8 h-8" />
      </Link>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 pt-2 pb-6 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {navItems.filter(i => !i.isFab).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 min-w-[64px] group"
              >
                <div className={cn(
                  "px-5 py-1 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:bg-muted"
                )}>
                  <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                </div>
                <span className={cn(
                  "text-[12px] font-bold tracking-tight",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
