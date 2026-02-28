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
  GitBranch,
  Trash2,
  ChevronRight,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDrainageRealtimeData, type DrainageDataOutput } from "@/ai/flows/drainage-data-flow";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { RelativeTime } from "@/components/relative-time";

export default function DrainageMonitoringPage() {
  const [data, setData] = useState<DrainageDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const db = useFirestore();

  // Fetch real citizen reports to show the correlation source
  const reportsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "incidentReports"), orderBy("submittedAt", "desc"), limit(5));
  }, [db]);

  const { data: recentReports } = useCollection(reportsQuery);

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
    const interval = setInterval(() => loadData(true), 120000); // Poll every 2 minutes
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Synchronizing Blue-Green Resilience Engine...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Blue-Green Resilience</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              AI Graph-Theoretic Modeling Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1">
              Intensity: {data.rainfallSimulation.intensity} mm/hr
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
              Condition: {data.rainfallSimulation.status}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full gap-2 hover:bg-white"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Sync AI Model
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Network Health Card */}
        <Card className="m3-card border-none shadow-lg p-6 lg:col-span-3 flex flex-col justify-between bg-primary/5">
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Network Health</h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-bold">{data.networkHealthIndex}%</span>
              <Activity className="w-6 h-6 text-primary mb-2" />
            </div>
          </div>
          <div className="space-y-3">
            <Progress value={data.networkHealthIndex} className="h-2" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Live analysis of hydraulic pressure vs. waste load.
            </p>
          </div>
        </Card>

        {/* Predictive Flood Zones */}
        <Card className="m3-card border-none shadow-lg lg:col-span-9 p-6 space-y-6 bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" /> AI Flood Forecasting
            </h3>
            <Badge className="bg-destructive/10 text-destructive border-none text-[10px] font-bold tracking-widest uppercase">Risk Map v2.4</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.floodPredictions.map((prediction, i) => (
              <div key={i} className="bg-muted/30 rounded-[28px] p-5 space-y-3 border border-border/50 transition-all hover:bg-muted/40 group">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{prediction.zone}</span>
                  <Badge className={cn(
                    "text-[9px] font-bold border-none px-2 py-0.5",
                    prediction.probability > 70 ? "bg-destructive text-white" : "bg-amber-500 text-white"
                  )}>
                    {prediction.probability}% Risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">T-Minus: {prediction.estimatedImpactTime}</p>
                  </div>
                  <p className="text-[11px] leading-relaxed italic text-muted-foreground/80 font-medium">
                    {prediction.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Network Topology Visualizer (Stylized Graph) */}
        <Card className="lg:col-span-8 m3-card border-none shadow-xl bg-[#0F172A] text-white p-8 relative overflow-hidden min-h-[400px]">
          <div className="relative z-10 flex flex-col h-full">
             <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                 <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                   <GitBranch className="w-5 h-5 text-blue-400" /> UGD Topology
                 </h3>
                 <p className="text-xs text-blue-300/60 uppercase tracking-widest font-bold">Flow Dependency Graph</p>
               </div>
               <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">Live Nodes</Badge>
             </div>

             <div className="flex-1 relative flex items-center justify-center">
                {/* Stylized SVG Network Graph */}
                <svg className="w-full h-full max-w-[500px] opacity-40" viewBox="0 0 400 300">
                  <circle cx="200" cy="150" r="40" fill="none" stroke="#4285F4" strokeWidth="2" />
                  <circle cx="80" cy="80" r="30" fill="none" stroke="#4285F4" strokeWidth="2" />
                  <circle cx="320" cy="80" r="30" fill="none" stroke="#4285F4" strokeWidth="2" />
                  <circle cx="80" cy="220" r="30" fill="none" stroke="#4285F4" strokeWidth="2" />
                  <circle cx="320" cy="220" r="30" fill="none" stroke="#4285F4" strokeWidth="2" />
                  
                  <line x1="110" y1="95" x2="170" y2="135" stroke="#4285F4" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="290" y1="95" x2="230" y2="135" stroke="#4285F4" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="110" y1="205" x2="170" y2="165" stroke="#4285F4" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="290" y1="205" x2="230" y2="165" stroke="#4285F4" strokeWidth="1" strokeDasharray="4 2" />

                  {/* Blockage Highlights */}
                  {data.activeBlockages.map((_, i) => (
                    <circle key={i} cx={80 + (i * 240)} cy={80 + (i % 2 * 140)} r="10" fill="#EA4335" className="animate-pulse" />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="text-[10px] bg-blue-900/40 p-2 rounded-lg border border-blue-700/50">North Madurai</div>
                    <div className="text-[10px] bg-blue-900/40 p-2 rounded-lg border border-blue-700/50">East Zone</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-[10px] bg-blue-600/20 p-4 rounded-full border border-blue-400 font-bold">CORE JUNCTION</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-[10px] bg-blue-900/40 p-2 rounded-lg border border-blue-700/50">Sakkimangalam</div>
                    <div className="text-[10px] bg-blue-900/40 p-2 rounded-lg border border-blue-700/50">Avaniapuram</div>
                  </div>
                </div>
             </div>
          </div>
          <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <span>Flow Latency: 4ms</span>
            <span>Graph Stability: High</span>
          </div>
        </Card>

        {/* Correlated Waste Sources */}
        <Card className="lg:col-span-4 m3-card border-none shadow-xl p-6 bg-accent/5 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" /> Source Correlation
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Linked Citizen Reports</p>
          </div>
          
          <div className="space-y-4">
            {recentReports?.map((report) => (
              <div key={report.id} className="bg-white p-3 rounded-2xl shadow-sm border border-border/40 flex gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] font-bold truncate pr-2">{report.aiSuggestedCategory || "Waste Point"}</h4>
                    <span className="text-[8px] text-muted-foreground font-bold whitespace-nowrap">
                      {report.submittedAt ? <RelativeTime date={report.submittedAt} short /> : "Recently"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{report.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Badge className="bg-blue-500/10 text-blue-600 border-none text-[8px] font-bold uppercase py-0 px-2">Flow Contributor</Badge>
                  </div>
                </div>
              </div>
            ))}
            {!recentReports?.length && (
              <div className="text-center py-10">
                <p className="text-xs text-muted-foreground italic">No correlated reports detected.</p>
              </div>
            )}
          </div>
          
          <div className="pt-2">
             <Button variant="outline" className="w-full rounded-2xl h-10 text-[10px] font-bold uppercase border-accent text-accent hover:bg-accent hover:text-white transition-all">
                Run dependency Audit
             </Button>
          </div>
        </Card>

        {/* STP Monitoring */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stps.map((stp, i) => (
            <Card key={i} className="m3-card border-none shadow-md p-6 space-y-4 bg-card group hover:shadow-lg transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Waves className="w-5 h-5" />
                </div>
                <Badge className={cn(
                  "border-none text-[9px] font-bold uppercase px-3 py-1",
                  stp.status === 'Optimal' ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  {stp.status}
                </Badge>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm">{stp.name} STP</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Inflow</span>
                    <span className="text-foreground">{stp.inflow} MLD</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Waste Load</span>
                    <span className={cn(stp.wasteLoad > 70 ? "text-destructive" : "text-primary")}>
                      {stp.wasteLoad}%
                    </span>
                  </div>
                  <Progress value={stp.wasteLoad} className="h-1.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Intervention Panel */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-bold font-headline flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-amber-500" /> AI-Identified Blockages
             </h3>
             <Button className="rounded-full bg-primary text-white font-bold gap-2 px-8 py-6 shadow-lg hover:scale-105 transition-all">
               <Navigation className="w-5 h-5" /> Dispatch Hydro-Jetting Fleet
             </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.activeBlockages.map((blockage, i) => (
              <Card key={i} className="m3-card border-none shadow-xl p-8 flex gap-8 items-center group cursor-pointer hover:bg-muted/30 transition-all bg-card">
                <div className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center text-white shadow-lg shrink-0",
                  blockage.severity === 'Critical' ? "bg-destructive" : blockage.severity === 'High' ? "bg-amber-500" : "bg-primary"
                )}>
                  <ArrowDownCircle className="w-10 h-10" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xl tracking-tight">{blockage.location}</h4>
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase px-3",
                      blockage.severity === 'Critical' && "border-destructive text-destructive"
                    )}>
                      {blockage.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">AI Cause:</span> {blockage.identifiedCause}
                  </p>
                  <div className="flex items-center gap-6 pt-3">
                     <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-widest">
                       <Navigation className="w-4 h-4" /> {blockage.coordinates.lat.toFixed(4)}, {blockage.coordinates.lng.toFixed(4)}
                     </span>
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
