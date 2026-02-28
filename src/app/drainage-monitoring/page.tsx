"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Waves, 
  AlertCircle, 
  Activity, 
  Navigation, 
  ShieldAlert,
  CloudRain,
  Loader2,
  RefreshCcw,
  Network,
  ArrowDownCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDrainageRealtimeData, type DrainageDataOutput } from "@/ai/flows/drainage-data-flow";

export default function DrainageMonitoringPage() {
  const [data, setData] = useState<DrainageDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const result = await fetchDrainageRealtimeData();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch drainage telemetry:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 45000); // Polling every 45s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Analyzing UGD Network Graphs...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">Blue-Green Resilience</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              Graph-Theoretic Predictive Engine Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1">
              Rainfall: {data.rainfallSimulation.intensity} mm/hr
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
              Simulation: {data.rainfallSimulation.status}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full gap-2"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Update Model
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Network Health Card */}
        <Card className="m3-card border-none shadow-lg p-6 lg:col-span-1 flex flex-col justify-between bg-primary/5">
          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">UGD Health Index</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{data.networkHealthIndex}%</span>
              <Activity className="w-6 h-6 text-primary mb-2" />
            </div>
          </div>
          <div className="space-y-3">
            <Progress value={data.networkHealthIndex} className="h-2" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              *Real-time correlation of waste load and pressure sensors across the city grid.
            </p>
          </div>
        </Card>

        {/* Predictive Flood Zones */}
        <Card className="m3-card border-none shadow-lg lg:col-span-3 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" /> AI Flood Prediction
            </h3>
            <Badge className="bg-destructive/10 text-destructive border-none">High Confidence</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.floodPredictions.map((prediction, i) => (
              <div key={i} className="bg-muted/30 rounded-[24px] p-4 space-y-3 border border-border/50">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm">{prediction.zone}</span>
                  <Badge className={cn(
                    "text-[8px] font-bold border-none",
                    prediction.probability > 70 ? "bg-destructive text-white" : "bg-amber-500 text-white"
                  )}>
                    {prediction.probability}% Risk
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <CloudRain className="w-3 h-3" /> T-Minus: {prediction.estimatedImpactTime}
                  </p>
                  <p className="text-[10px] leading-relaxed italic text-muted-foreground">
                    Reason: {prediction.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* STP Monitoring */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stps.map((stp, i) => (
            <Card key={i} className="m3-card border-none shadow-md p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Waves className="w-5 h-5" />
                </div>
                <Badge className={cn(
                  "border-none text-[8px] font-bold uppercase",
                  stp.status === 'Optimal' ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  {stp.status}
                </Badge>
              </div>
              <div>
                <h4 className="font-bold text-sm">{stp.name} STP</h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">Current Inflow</span>
                    <span>{stp.inflow} MLD</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">Waste Load</span>
                    <span className={cn(stp.wasteLoad > 70 ? "text-destructive" : "text-primary")}>
                      {stp.wasteLoad}%
                    </span>
                  </div>
                  <Progress value={stp.wasteLoad} className="h-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Blockage Intervention Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-bold font-headline flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-amber-500" /> Active Waste Blockages
             </h3>
             <Button className="rounded-full bg-primary text-white font-bold gap-2 px-6">
               <Navigation className="w-4 h-4" /> Dispatch Emergency Fleet
             </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.activeBlockages.map((blockage, i) => (
              <Card key={i} className="m3-card border-none shadow-xl p-6 flex gap-6 items-center group cursor-pointer hover:bg-muted/20 transition-all">
                <div className={cn(
                  "w-16 h-16 rounded-[28px] flex items-center justify-center text-white shadow-lg shrink-0",
                  blockage.severity === 'Critical' ? "bg-destructive" : blockage.severity === 'High' ? "bg-amber-500" : "bg-primary"
                )}>
                  <ArrowDownCircle className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{blockage.location}</h4>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{blockage.severity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">AI Cause:</span> {blockage.identifiedCause}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                     <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest">
                       <Navigation className="w-3 h-3" /> {blockage.coordinates.lat.toFixed(4)}, {blockage.coordinates.lng.toFixed(4)}
                     </span>
                     <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase text-blue-600">
                       Analyze Graph Impact
                     </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
