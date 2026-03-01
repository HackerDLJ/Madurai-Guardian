"use client";

import * as React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Cpu,
  UserCircle,
  Activity,
  ShieldCheck,
  Waves,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles
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
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const menuItems = [
    { label: "Smart Segregate", href: "/smart-segregate", icon: Cpu, badge: "AI" },
    { label: "WtE Optimization", href: "/wte-optimization", icon: Zap, badge: "Power" },
    { label: "Hygiene Control", href: "/hygiene-control", icon: Activity, badge: "Live" },
    { label: "Drainage Monitoring", href: "/drainage-monitoring", icon: Waves, badge: "AI" },
    { label: "MCCC Dashboard", href: "/mccc-dashboard", icon: ShieldCheck, badge: "Hub" },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-white/5 backdrop-blur-3xl transition-all duration-700 ease-in-out">
      <SidebarHeader className="p-6 space-y-8">
        {/* Detached App Branding inside Sidebar */}
        <div className={cn("flex items-center gap-4 transition-all duration-500", isCollapsed ? "justify-center" : "px-2")}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[16px] bg-primary flex items-center justify-center shadow-[0_8px_24px_rgba(66,133,244,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-700">
                <span className="text-lg font-black tracking-tighter text-foreground leading-none">Madurai Guardian</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary mt-1 opacity-80">Liquid Architecture</span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2">Navigation</span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn(
              "rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-500",
              isCollapsed ? "mx-auto w-10 h-10" : "w-8 h-8"
            )}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        <Card className={cn(
          "rounded-[24px] border border-white/10 bg-white/5 p-3 shadow-xl flex items-center transition-all duration-700 ease-in-out",
          isCollapsed ? "justify-center p-2" : "gap-3"
        )}>
          <Avatar className={cn(
            "rounded-[16px] bg-primary/10 text-primary border border-white/10 transition-all duration-500",
            isCollapsed ? "w-8 h-8" : "w-10 h-10"
          )}>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="rounded-[16px] bg-primary/10">
               <UserCircle className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-700">
              <h4 className="font-black text-xs truncate text-foreground">{user?.displayName || profile?.displayName || "Guardian"}</h4>
              <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-0.5">Level {profile?.level || 1} Elite</p>
            </div>
          )}
        </Card>

        <Link href="/report/new">
          <Button className={cn(
            "w-full rounded-[20px] bg-primary text-white font-black shadow-[0_12px_32px_rgba(66,133,244,0.3)] hover:shadow-[0_16px_40px_rgba(66,133,244,0.4)] hover:scale-[1.05] active:scale-95 transition-all duration-500 gap-3 h-12",
            isCollapsed ? "px-0 justify-center" : "px-4"
          )}>
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">New Report</span>}
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  tooltip={item.label}
                  className={cn(
                    "rounded-[18px] h-12 px-3 transition-all duration-500",
                    isActive 
                      ? "bg-primary text-white shadow-lg" 
                      : "hover:bg-white/5 text-muted-foreground/80 hover:text-primary"
                  )}
                >
                  <Link href={item.href} className="group flex items-center gap-3">
                    <item.icon className={cn(
                      "w-5 h-5 transition-all duration-500",
                      isActive ? "text-white scale-110" : "text-muted-foreground/50 group-hover:text-primary"
                    )} />
                    {!isCollapsed && (
                      <span className={cn(
                        "font-black text-xs transition-all duration-500",
                        isActive ? "text-white" : "text-foreground group-hover:text-primary"
                      )}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge className={cn(
                        "ml-auto border-none text-[7px] px-1.5 h-4 font-black uppercase tracking-tighter",
                        isActive ? "bg-white/20 text-white" : 
                        item.badge === "Live" ? "bg-green-500/15 text-green-500" : 
                        "bg-primary/15 text-primary"
                      )}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        {!isCollapsed ? (
          <Card className="rounded-[28px] bg-white/5 backdrop-blur-[40px] p-5 space-y-4 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-between items-center">
              <h5 className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> System Feed
              </h5>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-start group cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                <div className="transition-all group-hover:translate-x-1 duration-500">
                  <p className="text-[10px] font-black text-foreground leading-tight">Spike detected</p>
                  <p className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Temple • 2m</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse delay-150" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}