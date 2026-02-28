"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Flame, 
  Droplets, 
  Leaf, 
  BarChart3, 
  Activity, 
  Loader2, 
  RefreshCcw,
  Lightbulb,
  Factory,
  TrendingUp,
  BrainCircuit,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis
} from 'recharts';
import { fetchWteRealtimeData, type WteDataOutput } from "@/ai/flows/wte-data-flow";

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

export default function WteOptimizationPage() {
  const [data, setData] = useState<WteDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const result = await fetchWteRealtimeData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch WtE telemetry:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 120000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="space-y-1">
          <p className="font-bold text-lg">Calibrating Anaerobic Digestion Core</p>
          <p className="text-muted-foreground text-sm">Analyzing current feedstock throughput for Madurai Central WtE Plant...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
            <Factory className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Waste-to-Energy Optimization</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              Madurai Smart-Grid: {data.energyOutput.streetlightsPowered} Streetlights Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full gap-2 hover:bg-white"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Sync AI Predictions
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="m3-card border-none shadow-lg p-6 bg-primary text-primary-foreground relative overflow-hidden">
             <Zap className="absolute -top-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
             <div className="space-y-6 relative z-10">
               <div className="flex items-center justify-between">
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Plant Efficiency Index</p>
                 <Activity className="w-4 h-4 opacity-70" />
               </div>
               <div className="flex items-baseline gap-2">
                 <h2 className="text-6xl font-bold">{data.efficiencyIndex}%</h2>
                 <Badge variant="secondary" className="bg-white/20 text-white border-none text-[8px] font-bold">OPTIMAL</Badge>
               </div>
               <Progress value={data.efficiencyIndex} className="h-2 bg-white/20" />
               <p className="text-[10px] opacity-70 italic">*Real-time throughput: {data.totalThroughput} tons/day</p>
             </div>
          </Card>

          <Card className="m3-card border-none shadow-lg p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" /> Feedstock Analysis
            </h3>
            <div className="flex items-center gap-8">
               <div className="h-32 w-32">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={data.feedstock.composition}
                       innerRadius={30}
                       outerRadius={50}
                       paddingAngle={5}
                       dataKey="percentage"
                     >
                       {data.feedstock.composition.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="space-y-2 flex-1">
                  {data.feedstock.composition.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-muted-foreground">{item.type}</span>
                      </div>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="pt-4 border-t border-muted">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Moisture Level</span>
                  <span className="text-xs font-bold text-blue-500">{data.feedstock.moistureContent}%</span>
               </div>
               <Progress value={data.feedstock.moistureContent} className="h-1.5 bg-blue-100" />
            </div>
          </Card>
        </div>

        {/* Methane & Grid Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="m3-card border-none shadow-lg p-6 bg-orange-50 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Methane Production</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Anaerobic Digestors</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "border-none text-[10px] font-bold px-3 py-1",
                    data.methaneProduction.status === 'Optimal' ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                  )}>
                    {data.methaneProduction.status}
                  </Badge>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">Current Rate</p>
                    <p className="text-2xl font-bold">{data.methaneProduction.currentYield} <span className="text-xs font-medium">m³/hr</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">24h Forecast</p>
                    <p className="text-2xl font-bold">{data.methaneProduction.predictedYield24h.toLocaleString()} <span className="text-xs font-medium">m³</span></p>
                  </div>
               </div>
               <div className="h-24 w-full pt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[{v: 60}, {v: 45}, {v: 75}, {v: 65}, {v: 90}]}>
                     <Bar dataKey="v" fill="#F97316" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card className="m3-card border-none shadow-lg p-6 bg-blue-50 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Smart Grid Output</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Public Lighting Load</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-blue-600 text-[10px] font-bold">
                    {data.energyOutput.gridStability}% Stable
                  </Badge>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Power Generated</p>
                    <h4 className="text-3xl font-bold">{data.energyOutput.kwhGenerated.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">kWh</span></h4>
                  </div>
                  <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 flex items-center justify-center">
                     <span className="text-sm font-bold">{data.energyOutput.gridStability}%</span>
                  </div>
               </div>
               <div className="bg-white/50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Smart Grid Utilization</p>
                    <p className="text-[9px] text-muted-foreground">Powering 4,200 Ward 42 streetlights.</p>
                  </div>
               </div>
            </Card>
          </div>

          <Card className="m3-card border-none shadow-xl bg-indigo-900 text-white p-8 relative overflow-hidden">
             <BrainCircuit className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">AI Optimization Engine</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {data.optimizationTips.map((tip, i) => (
                     <div key={i} className="flex gap-4 group cursor-default">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                          <Info className="w-4 h-4" />
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">
                          {tip}
                        </p>
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
