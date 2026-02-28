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
  Activity, 
  Loader2, 
  RefreshCcw,
  Lightbulb,
  Factory,
  TrendingUp,
  BrainCircuit,
  Info,
  ArrowUpRight,
  ZapOff,
  Gauge,
  CheckCircle2,
  ShieldCheck
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
  XAxis,
  YAxis,
  CartesianGrid
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

  const gaugeData = [
    { name: 'Efficiency', value: data.efficiencyIndex },
    { name: 'Remaining', value: 100 - data.efficiencyIndex }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
            <Factory className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">WtE Energy Optimization</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              Madurai Smart-Grid: {data.energyOutput.streetlightsPowered.toLocaleString()} streetlights active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end border-r border-border/50 pr-4 h-10 justify-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grid Stability</span>
            <span className="text-sm font-bold text-secondary">{data.energyOutput.gridStability}% Stable</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full gap-2 hover:bg-white px-4 h-10 border border-border/40 shadow-sm"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Sync AI Predictions
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plant Efficiency and Feedstock - LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="m3-card border-none shadow-xl p-0 bg-[#1E1B4B] text-white relative overflow-hidden group min-h-[420px] flex flex-col">
             <div className="p-8 pb-0 space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/20 text-white border-none text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    SYSTEM EFFICIENCY
                  </Badge>
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Operational Core</h3>
             </div>

             <div className="flex-1 relative flex items-center justify-center -mt-8">
                <div className="w-64 h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        innerRadius={80}
                        outerRadius={100}
                        startAngle={225}
                        endAngle={-45}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="hsl(var(--primary))" />
                        <Cell fill="rgba(255,255,255,0.1)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold tracking-tighter">{data.efficiencyIndex}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Load Index</span>
                  </div>
                </div>
                <Zap className="absolute -top-10 -right-10 w-48 h-48 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
             </div>

             <div className="p-8 pt-0 space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Input</p>
                      <p className="text-xl font-bold">{data.totalThroughput} <span className="text-xs opacity-40 font-normal">t/d</span></p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Target</p>
                      <p className="text-xl font-bold">95 <span className="text-xs opacity-40 font-normal">%</span></p>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                     <span>Throughput Optimization</span>
                     <span>{data.efficiencyIndex >= 85 ? 'Optimized' : 'Normal'}</span>
                   </div>
                   <Progress value={data.efficiencyIndex} className="h-1.5 bg-white/10" />
                </div>
             </div>
          </Card>

          <Card className="m3-card border-none shadow-lg p-6 space-y-6 bg-card transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-500" /> Feedstock Composition
              </h3>
              <Info className="w-4 h-4 text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-6">
               <div className="h-32 w-32 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={data.feedstock.composition}
                       innerRadius={30}
                       outerRadius={50}
                       paddingAngle={6}
                       dataKey="percentage"
                       stroke="none"
                     >
                       {data.feedstock.composition.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="space-y-2.5 flex-1">
                  {data.feedstock.composition.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] font-medium">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-muted-foreground">{item.type}</span>
                      </div>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-6 border-t border-border/50">
               <div className="flex justify-between items-center mb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Moisture Balance</span>
                    <p className="text-[9px] text-muted-foreground italic">Target Range: 60-70%</p>
                  </div>
                  <span className={cn(
                    "text-lg font-bold",
                    data.feedstock.moistureContent > 70 ? "text-destructive" : "text-blue-500"
                  )}>
                    {data.feedstock.moistureContent}%
                  </span>
               </div>
               <Progress 
                value={data.feedstock.moistureContent} 
                className={cn(
                  "h-1.5",
                  data.feedstock.moistureContent > 70 ? "bg-destructive/20" : "bg-blue-100"
                )} 
               />
            </div>
          </Card>
        </div>

        {/* Methane & Grid Analytics - RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Methane Production Card */}
            <Card className="m3-card border-none shadow-lg p-8 bg-orange-50/50 space-y-8 group">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Methane Yield</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Anaerobic Bioreactors</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "border-none text-[10px] font-bold px-4 py-1.5 rounded-full",
                    data.methaneProduction.status === 'Optimal' ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                  )}>
                    {data.methaneProduction.status}
                  </Badge>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Rate</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-4xl font-bold">{data.methaneProduction.currentYield.toLocaleString()}</p>
                      <span className="text-sm font-bold text-muted-foreground">m³/hr</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">24h Forecast</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-4xl font-bold text-orange-600">{(data.methaneProduction.predictedYield24h / 1000).toFixed(1)}k</p>
                      <span className="text-sm font-bold text-muted-foreground">m³</span>
                    </div>
                  </div>
               </div>

               <div className="h-28 w-full pt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[{h: '12', v: 60}, {h: '13', v: 45}, {h: '14', v: 75}, {h: '15', v: 65}, {h: '16', v: 90}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                     <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} />
                     <Bar dataKey="v" fill="#F97316" radius={[6, 6, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            {/* Smart Grid Integration Card */}
            <Card className="m3-card border-none shadow-lg p-8 bg-blue-50/50 space-y-8">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Smart Grid Export</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Municipal Lighting Load</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-200 text-blue-600 text-[10px] font-bold px-3">
                      ONLINE
                    </Badge>
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Power Exported Today</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-5xl font-bold text-blue-700">{data.energyOutput.kwhGenerated.toLocaleString()}</h4>
                      <span className="text-lg font-bold text-blue-300">kWh</span>
                    </div>
                  </div>
                  <div className="h-20 w-20 rounded-full border-[6px] border-blue-100 border-t-blue-600 flex items-center justify-center bg-white shadow-inner">
                     <div className="text-center">
                        <span className="text-xs font-bold block">{data.energyOutput.gridStability}%</span>
                        <span className="text-[7px] font-bold uppercase text-muted-foreground">Stability</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-5 rounded-[24px] flex items-center gap-5 border border-blue-100 shadow-sm group hover:border-blue-300 transition-all cursor-default">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-blue-800">Operational Highlight</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">Actively powering {data.energyOutput.streetlightsPowered.toLocaleString()} Ward 42 streetlights.</p>
                  </div>
               </div>
            </Card>
          </div>

          {/* AI Optimization Insights */}
          <Card className="m3-card border-none shadow-2xl bg-[#0F172A] text-white p-10 relative overflow-hidden">
             <BrainCircuit className="absolute -bottom-16 -right-16 w-80 h-80 text-white/5 pointer-events-none" />
             
             <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                      <BrainCircuit className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-headline">AI Optimization Engine</h3>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Autonomous Biogas Tuning Active</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.optimizationTips.map((tip, i) => (
                     <div key={i} className="flex gap-5 group cursor-default p-4 rounded-3xl hover:bg-white/5 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all shadow-lg border border-white/5">
                          <Info className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Protocol Tip {i + 1}</p>
                          <p className="text-sm text-white/70 leading-relaxed group-hover:text-white transition-colors">
                            {tip}
                          </p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[10px] text-white/30 font-medium italic">
                    *Tuning model: v4.2 High-Throughput Anaerobic Analysis
                  </p>
                  <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10 rounded-full font-bold text-xs gap-2">
                    Review Historical Performance <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
