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
    <Sidebar collapsible="icon" className="border-r-0 bg-transparent transition-all duration-700 ease-in-out">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn(
              "rounded-2xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all duration-500 shadow-xl",
              isCollapsed ? "mx-auto w-12 h-12" : "ml-auto w-10 h-10"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </Button>
        </div>

        <Card className={cn(
          "rounded-[32px] border-none bg-white/5 backdrop-blur-3xl p-4 shadow-2xl flex items-center transition-all duration-700 ease-in-out",
          isCollapsed ? "justify-center p-2" : "gap-4"
        )}>
          <Avatar className={cn(
            "rounded-[20px] bg-primary/10 text-primary border-2 border-white/10 transition-all duration-500",
            isCollapsed ? "w-10 h-10" : "w-12 h-12"
          )}>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="rounded-[20px] bg-primary/10">
               <UserCircle className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-700">
              <h4 className="font-black text-sm truncate text-foreground">{user?.displayName || profile?.displayName || "Guardian"}</h4>
              <Badge className="bg-primary/20 text-primary border-none text-[8px] px-2 h-4 font-black uppercase tracking-widest mt-1">Lvl {profile?.level || 1} Elite</Badge>
            </div>
          )}
        </Card>

        <Link href="/report/new" className="mt-8">
          <Button className={cn(
            "w-full rounded-[24px] bg-primary text-white font-black shadow-[0_16px_40px_rgba(66,133,244,0.4)] hover:shadow-[0_20px_48px_rgba(66,133,244,0.5)] hover:scale-[1.05] active:scale-95 transition-all duration-500 gap-3 h-14",
            isCollapsed ? "px-0 justify-center" : "px-6"
          )}>
            <Plus className="w-6 h-6" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">New Report</span>}
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu className="gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  tooltip={item.label}
                  className={cn(
                    "rounded-[24px] h-14 px-4 transition-all duration-500",
                    isActive 
                      ? "bg-primary text-white shadow-[0_12px_24px_rgba(66,133,244,0.3)]" 
                      : "hover:bg-white/5 text-muted-foreground/80 hover:text-primary"
                  )}
                >
                  <Link href={item.href} className="group flex items-center gap-4">
                    <item.icon className={cn(
                      "w-6 h-6 transition-all duration-500",
                      isActive ? "text-white scale-110" : "text-muted-foreground/50 group-hover:text-primary group-hover:scale-110"
                    )} />
                    {!isCollapsed && (
                      <span className={cn(
                        "font-black text-sm transition-all duration-500",
                        isActive ? "text-white" : "text-foreground group-hover:text-primary"
                      )}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge className={cn(
                        "ml-auto border-none text-[8px] px-2 h-5 font-black uppercase tracking-tighter shadow-sm",
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
          <Card className="rounded-[40px] bg-white/5 backdrop-blur-[40px] p-6 space-y-6 border border-white/10 shadow-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Live Feed
              </h5>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="space-y-5">
              <div className="flex gap-4 items-start group cursor-default">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive mt-1.5 shadow-[0_0_12px_rgba(239,68,68,0.4)]" />
                <div className="transition-all group-hover:translate-x-1 duration-500">
                  <p className="text-xs font-black text-foreground leading-tight">Waste density spike</p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Temple Zone • 2m ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start group cursor-default">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shadow-[0_0_12px_rgba(251,188,5,0.4)]" />
                <div className="transition-all group-hover:translate-x-1 duration-500">
                  <p className="text-xs font-black text-foreground leading-tight">Bin critical load</p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">West Masi • 15m ago</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-6 py-6 opacity-30">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse delay-150" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse delay-300" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}