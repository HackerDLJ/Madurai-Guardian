
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

export function TopBar() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 flex items-center justify-between border-none">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold font-headline tracking-tight text-foreground leading-none hidden sm:block">
            Madurai Guardian
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground sm:hidden">
          <Search className="w-6 h-6" />
        </button>
        <Link href="/profile">
          <Avatar className="w-9 h-9 border border-border shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/40/40`} />
            <AvatarFallback>{user?.displayName?.charAt(0) || "M"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
