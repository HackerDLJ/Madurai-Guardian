
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Flame, 
  Leaf, 
  Loader2, 
  RefreshCcw,
  Lightbulb,
  Factory,
  BrainCircuit,
  Info,
  ArrowUpRight,
  Gauge,
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
} from 'recharts';
import { fetchWteRealtimeData, type WteDataOutput } from "@/ai/flows/wte-data-flow";

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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="font-black text-2xl tracking-tighter text-foreground">Analyzing Thermal Gradients</p>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">Syncing Anaerobic Digestion Core...</p>
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
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-2xl border border-white/20">
            <Factory className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">Energy Matrix</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(34,197,94,0.6)]", isRefreshing && "animate-pulse")} />
              Madurai Smart-Grid: {data.energyOutput.streetlightsPowered.toLocaleString()} Nodes Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl p-2 rounded-[24px] border border-white/10 shadow-xl">
          <div className="px-6 py-2 flex flex-col items-end border-r border-white/10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stability</span>
            <span className="text-base font-black text-secondary">{data.energyOutput.gridStability}%</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-xl gap-2 hover:bg-primary/20 hover:text-primary transition-all duration-500 h-12 px-6"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sync AI</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* OPERATIONAL CORE - HIGH VISIBILITY */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <Card className="m3-card border-none shadow-2xl p-0 bg-primary text-white relative overflow-hidden group min-h-[500px] flex flex-col">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             
             <div className="p-10 pb-0 space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/20 text-white border-none text-[10px] font-black px-4 py-1.5 rounded-full backdrop-blur-xl">
                    OPERATIONAL CORE
                  </Badge>
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-white">Efficiency Index</h3>
             </div>

             <div className="flex-1 relative flex items-center justify-center">
                <div className="w-72 h-72 relative group-hover:scale-110 transition-transform duration-1000">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        innerRadius={85}
                        outerRadius={105}
                        startAngle={225}
                        endAngle={-45}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="hsl(var(--accent))" className="drop-shadow-[0_0_15px_rgba(251,188,5,0.6)]" />
                        <Cell fill="rgba(255,255,255,0.15)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black tracking-tighter text-white">{data.efficiencyIndex}%</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mt-1">Real-time Load</span>
                  </div>
                </div>
                <Zap className="absolute -top-16 -right-16 w-56 h-56 text-white/5 rotate-12 transition-transform group-hover:scale-125 duration-[2000ms]" />
             </div>

             <div className="p-10 pt-0 space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-[32px] border border-white/10 shadow-inner">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 opacity-80">Total Throughput</p>
                      <p className="text-2xl font-black text-white">{data.totalThroughput} <span className="text-xs font-medium opacity-60">t/d</span></p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-[32px] border border-white/10 shadow-inner">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 opacity-80">Plant Load</p>
                      <p className="text-2xl font-black text-white">95% <span className="text-xs font-medium opacity-60">Peak</span></p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white">
                     <span>Optimization Buffer</span>
                     <span className="text-accent font-black tracking-tighter">{data.efficiencyIndex >= 85 ? 'STABLE CORE' : 'MODERATE FLOW'}</span>
                   </div>
                   <Progress value={data.efficiencyIndex} className="h-2.5 bg-white/20" />
                </div>
             </div>
          </Card>

          <Card className="m3-card border-none shadow-xl p-10 space-y-10 bg-card border-white/10 hover:scale-[1.02] transition-all duration-700 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                <Gauge className="w-5 h-5 text-primary" /> Feedstock Matrix
              </h3>
              <Info className="w-4 h-4 text-muted-foreground/30" />
            </div>

            <div className="flex items-center gap-10">
               <div className="h-40 w-40 shrink-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={data.feedstock.composition}
                       innerRadius={45}
                       outerRadius={75}
                       paddingAngle={10}
                       dataKey="percentage"
                       stroke="none"
                     >
                       {data.feedstock.composition.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : index === 1 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="space-y-5 flex-1">
                  {data.feedstock.composition.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-3.5 h-3.5 rounded-full shadow-lg" style={{ backgroundColor: i === 0 ? 'hsl(var(--primary))' : i === 1 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))' }} />
                         <span className="text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors">{item.type}</span>
                      </div>
                      <span className="text-sm font-black text-foreground">{item.percentage}%</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-10 border-t border-white/10 space-y-6">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Moisture Balance</span>
                    <p className="text-[10px] text-muted-foreground/60 font-black italic uppercase tracking-tighter">Target: 65% Optimized</p>
                  </div>
                  <span className={cn(
                    "text-3xl font-black tracking-tighter",
                    data.feedstock.moistureContent > 70 ? "text-destructive" : "text-primary"
                  )}>
                    {data.feedstock.moistureContent}%
                  </span>
               </div>
               <Progress 
                value={data.feedstock.moistureContent} 
                className={cn(
                  "h-3 shadow-inner",
                  data.feedstock.moistureContent > 70 ? "bg-destructive/10" : "bg-primary/10"
                )} 
               />
            </div>
          </Card>
        </div>

        {/* ANALYTICS GRID */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <Card className="m3-card border-none shadow-xl p-10 bg-accent/5 border-white/5 space-y-10 group hover:bg-accent/10 transition-all duration-700">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[20px] bg-accent/10 text-accent flex items-center justify-center shadow-lg border border-accent/20 group-hover:rotate-6 transition-transform">
                      <Flame className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-foreground tracking-tight">Methane Yield</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Bioreactor Telemetry</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "border-none text-[9px] font-black px-4 py-2 rounded-full shadow-lg transition-all",
                    data.methaneProduction.status === 'Optimal' ? "bg-secondary text-white" : "bg-destructive text-white"
                  )}>
                    {data.methaneProduction.status}
                  </Badge>
               </div>

               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Flow Rate</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-foreground tracking-tighter">{data.methaneProduction.currentYield.toLocaleString()}</p>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">m³/h</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">24h Forecast</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-accent tracking-tighter">{(data.methaneProduction.predictedYield24h / 1000).toFixed(1)}k</p>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">m³</span>
                    </div>
                  </div>
               </div>

               <div className="h-40 w-full pt-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[{h: '12', v: 60}, {h: '13', v: 45}, {h: '14', v: 75}, {h: '15', v: 65}, {h: '16', v: 90}]}>
                     <Bar dataKey="v" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card className="m3-card border-none shadow-xl p-10 bg-primary/5 border-white/5 space-y-10 hover:bg-primary/10 transition-all duration-700">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[20px] bg-primary/10 text-primary flex items-center justify-center shadow-lg border border-primary/20">
                      <Lightbulb className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-foreground tracking-tight">Grid Output</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Smart Grid Export</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black px-4 h-8 rounded-full">
                    LIVE FEED
                  </Badge>
               </div>

               <div className="flex items-center gap-10">
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Energy Generated</p>
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-6xl font-black text-primary tracking-tighter">{data.energyOutput.kwhGenerated.toLocaleString()}</h4>
                      <span className="text-xl font-black text-primary/30 tracking-widest uppercase">kWh</span>
                    </div>
                  </div>
                  <div className="h-28 w-28 rounded-full border-[10px] border-primary/10 border-t-primary flex items-center justify-center bg-white/5 shadow-2xl animate-in zoom-in duration-1000">
                     <div className="text-center">
                        <span className="text-base font-black block text-foreground tracking-tighter">{data.energyOutput.gridStability}%</span>
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Stability</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[40px] flex items-center gap-8 border border-white/10 shadow-xl group cursor-default">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_10px_20px_rgba(66,133,244,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <ArrowUpRight className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest">Network Contribution</p>
                    <p className="text-sm text-muted-foreground font-black leading-tight uppercase tracking-tighter">Powering {data.energyOutput.streetlightsPowered.toLocaleString()} Smart Nodes</p>
                  </div>
               </div>
            </Card>
          </div>

          <Card className="m3-card border-none shadow-[0_64px_128px_-20px_rgba(0,0,0,0.3)] bg-primary text-white p-12 relative overflow-hidden border-white/10">
             <BrainCircuit className="absolute -bottom-24 -right-24 w-96 h-96 text-white/5 pointer-events-none rotate-12" />
             
             <div className="relative z-10 space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-2xl">
                      <BrainCircuit className="w-9 h-9" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white">Neural Optimization</h3>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Autonomous Biogas Tuning Core active</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(251,188,5,1)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(251,188,5,1)] [animation-delay:0.2s]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(251,188,5,1)] [animation-delay:0.4s]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {data.optimizationTips.map((tip, i) => (
                     <div key={i} className="flex gap-8 group cursor-default p-8 rounded-[48px] hover:bg-white/10 transition-all duration-700 border border-transparent hover:border-white/10 bg-white/5 backdrop-blur-md">
                        <div className="w-14 h-14 rounded-[22px] bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-black transition-all duration-500 shadow-2xl border border-white/10">
                          <Info className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest">Protocol Delta {i + 1}</p>
                          <p className="text-lg text-white font-medium leading-relaxed tracking-tight">
                            {tip}
                          </p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <p className="text-[11px] text-white/40 font-black italic tracking-[0.2em] uppercase">
                    *Tuning Core: Madurai-WTE-v4.8-Alpha
                  </p>
                  <Button variant="ghost" className="text-accent hover:text-accent hover:bg-white/10 rounded-full font-black text-xs gap-3 uppercase tracking-[0.2em] px-10 h-14 transition-all">
                    Access System Logs <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
