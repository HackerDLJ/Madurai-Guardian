
"use client";

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
  AlertTriangle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip,
  Cell
} from 'recharts';

// Dummy data for the Command Center
const fleetData = [
  { name: 'Zone 1', active: 12, idle: 2 },
  { name: 'Zone 2', active: 15, idle: 1 },
  { name: 'Zone 3', active: 8, idle: 4 },
  { name: 'Zone 4', active: 20, idle: 0 },
];

const rainData = [
  { station: 'Meenakshi', mm: 12 },
  { station: 'Anna Nagar', mm: 5 },
  { station: 'Koodal Nagar', mm: 18 },
  { station: 'Bibikulam', mm: 8 },
];

export default function MCCCDashboard() {
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
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Unified Municipal Operations Hub
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="rounded-full px-4 border-primary/20 text-primary font-bold">
            System Status: Optimal
          </Badge>
          <Badge variant="secondary" className="rounded-full px-4 bg-secondary/10 text-secondary border-none font-bold">
            Last Sync: Just now
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
            <Badge className="bg-primary/10 text-primary border-none text-[10px]">Ward 1-100</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Workforce Attendance</p>
                <p className="text-2xl font-bold">94% <span className="text-xs text-muted-foreground font-normal">/ 1,240 staff</span></p>
              </div>
              <Activity className="w-8 h-8 text-primary/20" />
            </div>
            <Progress value={94} className="h-2" />
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Collection Logs</p>
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-bold">850 / 1,000 Wards</span>
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
              <BarChart data={fleetData}>
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
              <p className="text-sm font-bold">1,240 L</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl">
              <Navigation className="w-4 h-4 text-blue-500 mb-1" />
              <p className="text-[10px] font-bold text-muted-foreground">GPS Uptime</p>
              <p className="text-sm font-bold">99.8%</p>
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
              <p className="text-2xl font-bold text-blue-900">42.5 <span className="text-xs font-normal">ft</span></p>
              <p className="text-[10px] text-blue-600 mt-1 font-bold">Warning at 55.0 ft</p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Tank Storage Avg.</span>
              <span className="font-bold">68% Capacity</span>
            </div>
            <Progress value={68} className="h-1.5 bg-blue-100" />
          </div>
        </Card>

        {/* 4. Disaster Management */}
        <Card className="m3-card border-none shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-amber-600">
              <CloudRain className="w-5 h-5" />
              <h3 className="font-bold">Disaster Mgmt.</h3>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">22 Stations</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Avg. Rainfall (24h)</p>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-3xl font-bold">8.4 <span className="text-sm text-muted-foreground">mm</span></h4>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rainData}>
                  <Bar dataKey="mm" radius={[4, 4, 0, 0]}>
                    {rainData.map((entry, index) => (
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
                  <span className="text-4xl font-bold">142</span>
                  <span className="text-xs text-green-600 font-bold mb-1">+12% vs avg</span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10">
                <p className="text-[10px] font-bold text-secondary uppercase mb-1">Resolution Rate</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">89%</span>
                  <span className="text-xs text-muted-foreground font-bold mb-1">Avg 4.2h</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-3xl p-4 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="flex-1">Illegal Dumping (Zone 4)</span>
                <span className="font-bold text-[10px]">Pending</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="flex-1">Street Sweep (Zone 1)</span>
                <span className="font-bold text-[10px]">Resolved</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="flex-1">Dustbin Overflow (Zone 2)</span>
                <span className="font-bold text-[10px]">In Progress</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
