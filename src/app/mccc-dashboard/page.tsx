"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
  RefreshCcw
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

export default function MCCCDashboard() {
  const [data, setData] = useState<McccDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    const interval = setInterval(() => loadData(true), 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Synchronizing MCCC Data Streams...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">MCCC Central Command</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              Unified Municipal Operations Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full gap-2"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Badge variant="outline" className="rounded-full px-4 border-primary/20 text-primary font-bold">
            System Status: Optimal
          </Badge>
          <Badge variant="secondary" className="rounded-full px-4 bg-secondary/10 text-secondary border-none font-bold">
            Last Sync: {isRefreshing ? "Refreshing..." : "Just now"}
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Health Department */}
        <Card className="m3-card border-none shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-primary">
              <Users className="w-5 h-5" />
              <h3 className="font-bold">Health Dept.</h3>
            </div>
            <Badge className="bg-primary/10 text-primary border-none text-[10px]">Ward 1-{data.health.totalWards}</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Workforce Attendance</p>
                <p className="text-2xl font-bold">{data.health.attendancePercent}% <span className="text-xs text-muted-foreground font-normal">/ {data.health.totalStaff} staff</span></p>
              </div>
              <Activity className="w-8 h-8 text-primary/20" />
            </div>
            <Progress value={data.health.attendancePercent} className="h-2" />
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Collection Logs</p>
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-bold">{data.health.completedWards} / {data.health.totalWards} Wards</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Engineering Department */}
        <Card className="m3-card border-none shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-secondary">
              <Truck className="w-5 h-5" />
              <h3 className="font-bold">Engineering Dept.</h3>
            </div>
            <Badge className="bg-secondary/10 text-secondary border-none text-[10px]">Fleet Active</Badge>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.engineering.fleetZones}>
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Bar dataKey="active" stackId="a" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="idle" stackId="a" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-2xl">
              <Fuel className="w-4 h-4 text-amber-500 mb-1" />
              <p className="text-[10px] font-bold text-muted-foreground">Fuel Consumed</p>
              <p className="text-sm font-bold">{data.engineering.fuelConsumedLiters} L</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl">
              <Navigation className="w-4 h-4 text-blue-500 mb-1" />
              <p className="text-[10px] font-bold text-muted-foreground">GPS Uptime</p>
              <p className="text-sm font-bold">{data.engineering.gpsUptimePercent}%</p>
            </div>
          </div>
        </Card>

        {/* 3. PWD/WRO */}
        <Card className="m3-card border-none shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-blue-600">
              <Waves className="w-5 h-5" />
              <h3 className="font-bold">PWD / WRO</h3>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-600 text-[10px]">1,314 Tanks</Badge>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-sm text-blue-700">Vaigai River Level</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{data.pwd.vaigaiLevelFeet} <span className="text-xs font-normal">ft</span></p>
              <p className="text-[10px] text-blue-600 mt-1 font-bold">Warning at {data.pwd.warningLevelFeet} ft</p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Tank Storage Avg.</span>
              <span className="font-bold">{data.pwd.tankStorageAvgPercent}% Capacity</span>
            </div>
            <Progress value={data.pwd.tankStorageAvgPercent} className="h-1.5 bg-blue-100" />
          </div>
        </Card>

        {/* 4. Disaster Management */}
        <Card className="m3-card border-none shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-amber-600">
              <CloudRain className="w-5 h-5" />
              <h3 className="font-bold">Disaster Mgmt.</h3>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">{data.disaster.stations.length} Stations</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Avg. Rainfall (24h)</p>
              <AlertTriangle className={cn("w-4 h-4", data.disaster.avgRainfallMm > 10 ? "text-destructive" : "text-amber-500")} />
            </div>
            <h4 className="text-3xl font-bold">{data.disaster.avgRainfallMm} <span className="text-sm text-muted-foreground">mm</span></h4>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.disaster.stations}>
                  <Bar dataKey="mm" radius={[4, 4, 0, 0]}>
                    {data.disaster.stations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.mm > 15 ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 5. Citizen Reports (Madurai Guardian) */}
        <Card className="m3-card border-none shadow-lg lg:col-span-2 p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-bold">Citizen Verified Reports</h3>
            </div>
            <Badge variant="default" className="bg-primary text-white text-[10px]">App Real-time</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-accent/5 border border-accent/10">
                <p className="text-[10px] font-bold text-accent uppercase mb-1">Total Reports (Daily)</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{data.citizens.totalReportsDaily}</span>
                  <span className={cn("text-xs font-bold mb-1", data.citizens.trendPercent >= 0 ? "text-green-600" : "text-destructive")}>
                    {data.citizens.trendPercent >= 0 ? "+" : ""}{data.citizens.trendPercent}% vs avg
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10">
                <p className="text-[10px] font-bold text-secondary uppercase mb-1">Resolution Rate</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{data.citizens.resolutionRatePercent}%</span>
                  <span className="text-xs text-muted-foreground font-bold mb-1">Avg 4.2h</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-3xl p-4 flex flex-col justify-center gap-3">
              {data.citizens.recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <div className={cn("w-2 h-2 rounded-full", log.color === 'destructive' ? 'bg-destructive' : log.color === 'secondary' ? 'bg-secondary' : 'bg-primary')} />
                  <span className="flex-1">{log.issue} ({log.zone})</span>
                  <span className="font-bold text-[10px] uppercase">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

function Button({ className, variant, size, ...props }: any) {
  return <button className={cn("inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", 
    variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
    size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 py-2',
    className)} {...props} />;
}
