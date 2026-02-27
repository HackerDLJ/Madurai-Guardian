
"use client";

import { Home, Map as MapIcon, Plus, ClipboardList, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: MapIcon, label: "City Map", href: "/map" },
  { icon: Plus, label: "Report", href: "/report/new", isFab: true },
  { icon: ClipboardList, label: "Status", href: "/status" },
  { icon: BookOpen, label: "Hub", href: "/hub" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="bg-card/90 backdrop-blur-xl border border-white/20 rounded-[40px] google-shadow p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-16 h-16 -mt-10 rounded-[28px] bg-primary flex items-center justify-center text-white google-shadow hover:google-shadow-hover active:scale-95 transition-all"
                title={item.label}
              >
                <item.icon className="w-8 h-8" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-4 rounded-3xl transition-all duration-300",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
