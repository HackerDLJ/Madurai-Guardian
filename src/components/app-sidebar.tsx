"use client";

import * as React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Cpu,
  UserCircle
} from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  return (
    <Sidebar className="border-r-0 bg-background/50">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
             <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Madurai Guardian</span>
        </Link>

        <Card className="rounded-[24px] border-none bg-white p-4 shadow-sm flex items-center gap-3">
          <Avatar className="w-12 h-12 rounded-2xl bg-primary/10 text-primary">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="rounded-2xl">
               <UserCircle className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-sm truncate">{user?.displayName || profile?.displayName || "Guardian"}</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">South Madurai Zone</p>
          </div>
        </Card>

        <Link href="/report/new" className="mt-4">
          <Button className="w-full rounded-2xl h-12 bg-primary text-primary-foreground font-bold shadow-sm hover:shadow-md transition-all gap-2">
            <Plus className="w-5 h-5" /> New Report
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/smart-segregate"} tooltip="AI Bin">
              <Link href="/smart-segregate" className="group">
                <Cpu className={cn(
                  "w-5 h-5 transition-colors",
                  pathname === "/smart-segregate" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
                <span className="font-bold">Smart Segregate</span>
                <Badge className="ml-auto bg-primary/10 text-primary border-none text-[8px] px-1.5 h-4">AI</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        <div className="rounded-3xl bg-white p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Recent Alerts</h5>
            <Link href="/notifications" className="text-[10px] font-bold text-primary">View All</Link>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
              <div>
                <p className="text-[11px] font-bold">High waste density detected</p>
                <p className="text-[9px] text-muted-foreground">Meenakshi Temple Zone • 2m ago</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
              <div>
                <p className="text-[11px] font-bold">Bin overflow predicted</p>
                <p className="text-[9px] text-muted-foreground">West Masi Street • 15m ago</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
