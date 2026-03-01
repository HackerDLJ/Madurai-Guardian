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
  SidebarTrigger,
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
  ChevronRight
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
    <Sidebar collapsible="icon" className="border-r-0 bg-background/30 backdrop-blur-2xl transition-all duration-500 ease-in-out">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between mb-4 group/header">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">Madurai Guardian</span>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn(
              "rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300",
              isCollapsed ? "mx-auto w-10 h-10" : "w-8 h-8"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        <Card className={cn(
          "rounded-[24px] border-none bg-white/40 backdrop-blur-md p-3 shadow-sm flex items-center transition-all duration-500",
          isCollapsed ? "justify-center p-1.5" : "gap-3"
        )}>
          <Avatar className={cn(
            "rounded-2xl bg-primary/10 text-primary border-2 border-white/50 transition-all",
            isCollapsed ? "w-8 h-8" : "w-11 h-11"
          )}>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="rounded-2xl">
               <UserCircle className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-700">
              <h4 className="font-bold text-xs truncate text-foreground">{user?.displayName || profile?.displayName || "Guardian"}</h4>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">South Madurai</p>
            </div>
          )}
        </Card>

        <Link href="/report/new" className="mt-4">
          <Button className={cn(
            "w-full rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all gap-2 h-11",
            isCollapsed ? "px-0 justify-center" : "px-4"
          )}>
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">New Report</span>}
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu className="gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive} 
                  tooltip={item.label}
                  className={cn(
                    "rounded-2xl h-11 px-3.5 transition-all duration-300",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "hover:bg-primary/5 hover:text-primary text-muted-foreground"
                  )}
                >
                  <Link href={item.href} className="group flex items-center gap-3">
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                    )} />
                    {!isCollapsed && (
                      <span className={cn(
                        "font-bold text-sm transition-all duration-300",
                        isActive ? "text-white" : "text-foreground group-hover:text-primary"
                      )}>
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge className={cn(
                        "ml-auto border-none text-[8px] px-1.5 h-4 font-black uppercase tracking-tighter",
                        isActive ? "bg-white/20 text-white" : 
                        item.badge === "Live" ? "bg-green-500/10 text-green-600" : 
                        "bg-primary/10 text-primary"
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

      <SidebarFooter className="p-4 mt-auto">
        {!isCollapsed ? (
          <Card className="rounded-[32px] bg-white/30 backdrop-blur-xl p-5 space-y-4 border border-white/40 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Live Feed</h5>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start group cursor-default">
                <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 shadow-lg shadow-destructive/20" />
                <div className="transition-transform group-hover:translate-x-1 duration-300">
                  <p className="text-[11px] font-bold text-foreground leading-tight">Waste density warning</p>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">Temple Zone • 2m ago</p>
                </div>
              </div>
              <div className="flex gap-3 items-start group cursor-default">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shadow-lg shadow-accent/20" />
                <div className="transition-transform group-hover:translate-x-1 duration-300">
                  <p className="text-[11px] font-bold text-foreground leading-tight">Bin overflow imminent</p>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">West Masi • 15m ago</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
