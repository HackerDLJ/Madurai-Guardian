
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-none">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center google-shadow group-hover:google-shadow-hover transition-all">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold font-headline tracking-tight text-foreground leading-none">Madurai</h1>
          <p className="text-[10px] font-semibold text-secondary uppercase tracking-[0.2em]">Guardian</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground">
          <Search className="w-5 h-5" />
        </button>
        <Link href="/notifications" className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Link>
        <Avatar className="w-9 h-9 border border-border google-shadow">
          <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
          <AvatarFallback>MG</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
