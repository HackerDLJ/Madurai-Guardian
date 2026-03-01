"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  Droplets, 
  CloudRain, 
  MessageSquare,
  Activity,
  Fuel,
  Waves,
  Navigation,
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Clock,
  Zap,
  Radio
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { fetchMcccRealtimeData, type McccDataOutput } from "@/ai/flows/mccc-data-flow";
import { cn } from "@/lib/utils";
import { RelativeTime } from "@/components/relative-time";

export default function MCCCDashboard() {
  const [data, setData] = useState<McccDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const result = await fetchMcccRealtimeData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch MCCC data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 60000); // More frequent sync for "realtime" feel
    
    // Live clock update
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const formatExactTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', { hour12: false });
    } catch (e) {
      return "--:--:--";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <Radio className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="font-black text-2xl tracking-tighter text-foreground uppercase">Establishing MCCC Uplink</p>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Synchronizing District Departmental Streams...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-2xl border border-white/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">MCCC CENTRAL COMMAND</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={cn("w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]", isRefreshing && "animate-pulse")} />
              System Status: Optimal • Network Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl p-3 rounded-[32px] border border-white/10 shadow-xl">
          <div className="px-6 py-2 flex flex-col items-end border-r border-white/10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Command Time</span>
            <span className="text-xl font-black text-foreground tabular-nums">{currentTime}</span>
          </div>
          <div className="px-6 py-2 flex flex-col items-end border-r border-white/10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Sync</span>
            <span className="text-xl font-black text-primary tabular-nums">{formatExactTime(data.lastSyncTime)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-[18px] gap-3 hover:bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest h-14 px-8 border border-white/10"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* 1. Health Department */}
        <Card className="m3-card border-none shadow-2xl p-10 space-y-8 bg-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-32 h-32 -mr-8 -mt-8 rotate-12" />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4 text-primary">
              <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">Health Dept.</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Ward 1-100 Coverage</p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-3 py-1">Synced {formatExactTime(data.lastSyncTime)}</Badge>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Workforce Attendance</p>
                <p className="text-4xl font-black tracking-tighter">{data.health.attendancePercent}% <span className="text-sm text-muted-foreground font-bold uppercase ml-2 tracking-tighter">/ {data.health.totalStaff} staff</span></p>
              </div>
              <Activity className="w-10 h-10 text-primary/20" />
            </div>
            <Progress value={data.health.attendancePercent} className="h-2.5 bg-primary/10" />
            <div className="bg-muted/20 rounded-[24px] p-5 space-y-3 shadow-inner">
              <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em]">Sanitation Coverage</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase">Wards Completed</span>
                <span className="font-black text-lg text-primary">{data.health.completedWards} / 100</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Engineering Department */}
        <Card className="m3-card border-none shadow-2xl p-10 space-y-8 bg-card relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 text-secondary">
              <div className="w-12 h-12 rounded-[18px] bg-secondary/10 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">Engineering</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fleet Operations</p>
              </div>
            </div>
            <Badge className="bg-secondary/10 text-secondary border-none text-[10px] font-black uppercase px-3 py-1">Active</Badge>
          </div>

          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.engineering.fleetZones}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: '900' }}
                />
                <Bar dataKey="active" stackId="a" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="idle" stackId="a" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-muted/30 p-5 rounded-[28px] border border-muted/20 shadow-sm group hover:scale-105 transition-transform">
              <Fuel className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Fuel Consumption</p>
              <p className="text-xl font-black tabular-nums">{data.engineering.fuelConsumedLiters} L</p>
            </div>
            <div className="bg-muted/30 p-5 rounded-[28px] border border-muted/20 shadow-sm group hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">GPS Connectivity</p>
              <p className="text-xl font-black tabular-nums">{data.engineering.gpsUptimePercent}%</p>
            </div>
          </div>
        </Card>

        {/* 3. PWD/WRO */}
        <Card className="m3-card border-none shadow-2xl p-10 space-y-8 bg-card relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 text-blue-600">
              <div className="w-12 h-12 rounded-[18px] bg-blue-100/50 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">PWD / WRO</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Water Management</p>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">1,314 Tanks</Badge>
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[32px] border border-blue-100 shadow-sm group hover:bg-blue-50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-black text-sm text-blue-700 uppercase tracking-tighter">Vaigai River Level</span>
                </div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{formatExactTime(data.lastSyncTime)}</span>
              </div>
              <p className="text-5xl font-black text-blue-900 tabular-nums">{data.pwd.vaigaiLevelFeet} <span className="text-lg font-bold opacity-40">FT</span></p>
              <p className="text-[10px] text-blue-600 mt-3 font-black uppercase tracking-widest opacity-60">Warning Threshold: {data.pwd.warningLevelFeet} ft</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span>District Storage Avg</span>
                <span className="text-blue-700">{data.pwd.tankStorageAvgPercent}% Capacity</span>
              </div>
              <Progress value={data.pwd.tankStorageAvgPercent} className="h-2 bg-blue-100" />
            </div>
          </div>
        </Card>

        {/* 4. Disaster Management */}
        <Card className="m3-card border-none shadow-2xl p-10 space-y-8 bg-card">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 text-amber-600">
              <div className="w-12 h-12 rounded-[18px] bg-amber-100/50 flex items-center justify-center">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">Disaster Mgmt</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Rainfall Telemetry</p>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black px-3 py-1 rounded-full uppercase">{data.disaster.stations.length} STATIONS</Badge>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Avg. Rainfall (24h)</p>
                <h4 className="text-5xl font-black tabular-nums">{data.disaster.avgRainfallMm} <span className="text-lg font-bold text-muted-foreground/40">MM</span></h4>
              </div>
              <AlertTriangle className={cn("w-10 h-10 transition-colors", data.disaster.avgRainfallMm > 10 ? "text-destructive animate-pulse" : "text-amber-500")} />
            </div>
            
            <div className="h-32 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.disaster.stations}>
                  <Bar dataKey="mm" radius={[6, 6, 0, 0]}>
                    {data.disaster.stations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.mm > 15 ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-center font-black text-muted-foreground uppercase tracking-widest italic opacity-40">Satellite Data Uplink: Verified {formatExactTime(data.lastSyncTime)}</p>
          </div>
        </Card>

        {/* 5. Citizen Reports (Madurai Guardian) */}
        <Card className="m3-card border-none shadow-2xl lg:col-span-2 p-10 space-y-10 bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <MessageSquare className="w-48 h-48 -mr-12 -mt-12" />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4 text-primary">
              <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight text-foreground">Madurai Guardian Feed</h3>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Real-time Citizen Intelligence</p>
              </div>
            </div>
            <Badge className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter animate-pulse shadow-lg shadow-primary/20">LIVE STREAM</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6">
              <div className="p-6 rounded-[32px] bg-accent/5 border border-accent/10 shadow-sm group hover:bg-accent/10 transition-all">
                <p className="text-[10px] font-black text-accent uppercase mb-2 tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Exact Log Volume
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-black tabular-nums leading-none tracking-tighter">{data.citizens.totalReportsDaily}</span>
                  <div className="flex flex-col mb-1">
                    <span className={cn("text-xs font-black tracking-tight", data.citizens.trendPercent >= 0 ? "text-green-600" : "text-destructive")}>
                      {data.citizens.trendPercent >= 0 ? "↑" : "↓"} {Math.abs(data.citizens.trendPercent)}%
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">vs Weekly</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-[32px] bg-secondary/5 border border-secondary/10 shadow-sm group hover:bg-secondary/10 transition-all">
                <p className="text-[10px] font-black text-secondary uppercase mb-2 tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Efficiency Rating
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-black tabular-nums leading-none tracking-tighter">{data.citizens.resolutionRatePercent}%</span>
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Avg Dispatch: 4.2h</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-[40px] p-8 flex flex-col justify-center gap-6 shadow-inner border border-white/10">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-muted-foreground/10 pb-4 mb-2">Exact Event Logs (Last 2h)</p>
              {data.citizens.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-5 text-sm group cursor-default">
                  <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_rgba(0,0,0,0.1)]", log.color === 'destructive' ? 'bg-destructive shadow-destructive/20' : log.color === 'secondary' ? 'bg-secondary shadow-secondary/20' : 'bg-primary shadow-primary/20')} />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {log.issue} • <span className="opacity-60 text-[10px] font-bold uppercase">{log.zone}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{formatExactTime(log.timestamp)}</span>
                      <Badge variant="outline" className="font-black text-[8px] uppercase border-muted-foreground/20 px-2 py-0 h-4">{log.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
