"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Database,
  PlusCircle,
  MapPin,
  Send,
  Layers,
  Settings2,
  ExternalLink,
  X
} from "lucide-react";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";
import { fetchDrainageRealtimeData, type DrainageDataOutput } from "@/ai/flows/drainage-data-flow";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };

export default function DrainageMonitoringPage() {
  const [data, setData] = useState<DrainageDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(true);
  
  // Quick Report State
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState("Manual Entry");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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
      // AI fallback handled in flow
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

  const handleManualReportSubmit = async () => {
    if (!user || !db || !reportDescription) return;

    setIsSubmittingReport(true);
    
    const reportData = {
      userId: user.uid,
      description: `Drainage/UGD Blockage: ${reportDescription}`,
      latitude: MADURAI_CENTER.lat + (Math.random() - 0.5) * 0.015,
      longitude: MADURAI_CENTER.lng + (Math.random() - 0.5) * 0.015,
      photoUrls: ["https://picsum.photos/seed/drainage_field/800/600"],
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      isVerified: true,
      aiSuggestedCategory: "Drainage Blockage",
      pointsAwarded: 50,
    };

    addDocumentNonBlocking(collection(db, "incidentReports"), reportData);
    toast({ 
      title: "Field Report Logged", 
      description: "Emergency teams have been notified of the blockage." 
    });
    setIsReportDialogOpen(false);
    setReportDescription("");
    setIsSubmittingReport(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
        <div className="space-y-2">
          <p className="font-black text-2xl tracking-tighter text-foreground uppercase">Initializing Resilience Core</p>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Syncing Madurai District UGD Infrastructure Map...</p>
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
            <Network className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">Blue-Green Resilience</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={cn("w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]", isRefreshing && "animate-pulse")} />
              Madurai District UGD Mesh Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="border-primary/30 text-primary px-6 py-2 font-black text-[10px] rounded-full backdrop-blur-3xl shadow-lg">
              Intensity: {data.rainfallSimulation.intensity} mm/hr
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-2 uppercase font-black tracking-widest opacity-60">
              Event: {data.rainfallSimulation.status}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-[18px] gap-3 hover:bg-white/10 text-primary font-black text-[10px] uppercase tracking-widest h-14 px-8 border border-white/10"
          >
            <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Sync AI
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Stats Column */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="m3-card border-none shadow-2xl p-8 bg-primary text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Network Health Index</p>
                <Activity className="w-5 h-5 opacity-70" />
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-7xl font-black tracking-tighter">{data.networkHealthIndex}%</h2>
                <span className="text-xs font-black uppercase tracking-widest opacity-60">{data.networkHealthIndex > 80 ? 'Optimal' : 'Strained'}</span>
              </div>
              <Progress value={data.networkHealthIndex} className="h-3 bg-white/20 shadow-inner" />
            </div>
            <Network className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12" />
          </Card>

          <Card className="m3-card border-none shadow-xl p-8 space-y-8 bg-white/5 backdrop-blur-3xl border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Critical Nodes</h3>
            <div className="space-y-6">
              {data.infrastructure.map((node) => (
                <div key={node.id} className="flex gap-4 group cursor-pointer">
                  <div className={cn(
                    "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-lg border",
                    node.status === 'Operational' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  )}>
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden flex flex-col justify-center">
                    <p className="text-xs font-black tracking-tight truncate group-hover:text-primary transition-colors">{node.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{node.type} • {node.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Central Map Panel */}
        <Card className="lg:col-span-6 m3-card border-none shadow-2xl bg-card p-0 relative overflow-hidden min-h-[600px] border-white/10">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <div className="absolute inset-0">
                <Map
                  defaultCenter={MADURAI_CENTER}
                  defaultZoom={13}
                  mapId="drainage_network_v2"
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                >
                  {/* Infrastructure Markers */}
                  {data.infrastructure.map((node) => (
                    <AdvancedMarker
                      key={node.id}
                      position={node.coordinates}
                      onClick={() => setSelectedMarker({ ...node, category: 'Infrastructure' })}
                    >
                      <Pin 
                        background={node.status === 'Operational' ? '#34A853' : '#FBBC05'} 
                        borderColor={'#FFFFFF'} 
                        glyphColor={'#FFFFFF'} 
                      />
                    </AdvancedMarker>
                  ))}

                  {/* Blockage Markers */}
                  {data.activeBlockages.map((blockage, i) => (
                    <AdvancedMarker
                      key={`blockage-${i}`}
                      position={blockage.coordinates}
                      onClick={() => setSelectedMarker({ ...blockage, category: 'Blockage' })}
                    >
                      <Pin 
                        background={'#EA4335'} 
                        borderColor={'#FFFFFF'} 
                        glyphColor={'#FFFFFF'} 
                      />
                    </AdvancedMarker>
                  ))}

                  {selectedMarker && (
                    <InfoWindow
                      position={selectedMarker.coordinates}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-4 max-w-[220px] space-y-3">
                        <h4 className="font-black text-sm text-foreground tracking-tight">
                          {selectedMarker.name || selectedMarker.location}
                        </h4>
                        <Badge className="text-[9px] font-black uppercase bg-primary/10 text-primary border-none px-3 py-1">{selectedMarker.category}</Badge>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                          {selectedMarker.identifiedCause || `Type: ${selectedMarker.type}`}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>

              {/* API Activation Overlay */}
              {showHelp && (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/5 backdrop-blur-sm pointer-events-none z-50">
                  <Card className="p-8 rounded-[48px] bg-white/95 dark:bg-black/95 backdrop-blur shadow-2xl border border-primary/20 max-w-xs space-y-6 pointer-events-auto relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowHelp(false)}
                      className="absolute top-4 right-4 rounded-full opacity-40 hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary mx-auto">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="font-black text-xl tracking-tighter uppercase">Maps API Guidance</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                        If you see an error (ApiTargetBlockedMapError), the "Maps JavaScript API" must be enabled.
                      </p>
                    </div>

                    <div className="p-5 bg-primary/5 rounded-[32px] space-y-4">
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest">Enable Steps:</p>
                      <ol className="text-[10px] space-y-2 list-decimal list-inside text-muted-foreground font-bold leading-snug">
                        <li>Visit <a href="https://console.cloud.google.com/google/maps-apis/api-list" target="_blank" className="text-primary underline font-black inline-flex items-center gap-1">Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Search <strong>"Maps JavaScript API"</strong></li>
                        <li>Click <strong>ENABLE</strong> for your project.</li>
                      </ol>
                    </div>

                    <Button className="w-full rounded-full h-12 bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl" onClick={() => setShowHelp(false)}>
                      Got It
                    </Button>
                  </Card>
                </div>
              )}

              {/* Map UI Overlays */}
              <div className="absolute top-6 left-6 z-10 space-y-3">
                <Card className="p-6 rounded-[32px] bg-white/90 backdrop-blur-xl shadow-2xl border-white/20 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Network Overlay</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[11px] font-black tracking-tight">Node Operational</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-[11px] font-black tracking-tight">Waste Blockage</span>
                  </div>
                </Card>
              </div>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/50">
              <div className="w-20 h-20 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                <Layers className="w-10 h-10" />
              </div>
              <p className="font-black text-xl tracking-tighter uppercase">Maps API Key Required</p>
            </div>
          )}
        </Card>

        {/* Right Forecasting Column */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="m3-card border-none shadow-2xl p-8 bg-destructive/5 space-y-8 border-destructive/10">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">Flood Forecasting</h3>
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
            <div className="space-y-6">
              {data.floodPredictions.map((pred, i) => (
                <div key={i} className="space-y-3 border-b border-destructive/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-sm tracking-tight">{pred.zone}</span>
                    <Badge className="bg-destructive text-white border-none text-[9px] font-black px-3 py-1">{pred.probability}% Risk</Badge>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground italic font-medium">
                    {pred.reasoning}
                  </p>
                  <p className="text-[10px] font-black text-destructive flex items-center gap-2 uppercase tracking-tighter">
                    <CloudRain className="w-4 h-4" /> Peak in {pred.estimatedImpactTime}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="m3-card border-none shadow-xl p-8 space-y-8 bg-accent/5 border-accent/10">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-foreground">Correlated Sources</h3>
              <Database className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-6">
              {recentReports?.slice(0, 3).map((report) => (
                <div key={report.id} className="flex gap-4 group bg-white/40 p-4 rounded-[28px] border border-white/20 transition-all hover:bg-white/60">
                  <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center text-accent shrink-0 shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden flex flex-col justify-center">
                    <p className="text-[11px] font-black truncate tracking-tight">{report.aiSuggestedCategory || "Waste Point"}</p>
                    <p className="text-[9px] text-muted-foreground truncate font-bold">{report.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary/70">Flow Contributor</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Intervention Panel */}
        <section className="lg:col-span-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
             <div className="space-y-2">
               <h3 className="text-3xl font-black font-headline flex items-center gap-3 tracking-tighter uppercase">
                 <AlertCircle className="w-8 h-8 text-amber-500" /> Intervention Queue
               </h3>
               <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">AI-Identified District Blockages requiring immediate dispatch.</p>
             </div>
             <div className="flex gap-4">
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-[24px] h-14 border-primary/30 text-primary font-black uppercase text-[10px] tracking-widest gap-3 px-8 shadow-xl bg-white/5 backdrop-blur-3xl hover:bg-primary/5 transition-all">
                      <PlusCircle className="w-5 h-5" /> Log Manual Blockage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[48px] border-white/10 p-8">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black tracking-tighter uppercase">Field Observation</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-8 py-6">
                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Landmark / Zone</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <Input 
                            id="location" 
                            className="pl-12 rounded-[24px] h-14 bg-muted/20 border-white/10 font-bold" 
                            value={reportLocation} 
                            onChange={(e) => setReportLocation(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Blockage Details</Label>
                        <Textarea 
                          id="description" 
                          placeholder="e.g., Heavy PET bottle accumulation near Vaigai Gate 2..." 
                          className="rounded-[32px] min-h-[140px] bg-muted/20 border-white/10 p-6 font-bold leading-relaxed"
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleManualReportSubmit} 
                        disabled={isSubmittingReport || !reportDescription}
                        className="w-full rounded-[24px] h-16 bg-primary text-white font-black uppercase text-[12px] tracking-[0.2em] gap-3 shadow-2xl hover:scale-105 transition-all"
                      >
                        {isSubmittingReport ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        Dispatch to Engineers
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button className="rounded-[24px] h-14 bg-primary text-white font-black uppercase text-[10px] tracking-widest gap-3 px-10 shadow-2xl hover:scale-105 transition-all">
                  <Navigation className="w-5 h-5" /> Dispatch Jetting Fleet
                </Button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {data.activeBlockages.map((blockage, i) => (
              <Card key={i} className="m3-card border-none shadow-2xl p-8 flex gap-8 items-center bg-card group cursor-pointer hover:bg-white/10 transition-all border-white/10">
                <div className={cn(
                  "w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl shrink-0 transition-transform group-hover:rotate-6",
                  blockage.severity === 'Critical' ? "bg-destructive shadow-destructive/20" : blockage.severity === 'High' ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
                )}>
                  <ArrowDownCircle className="w-10 h-10" />
                </div>
                <div className="flex-1 space-y-2 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-base truncate tracking-tight uppercase">{blockage.location}</h4>
                    <Badge variant="outline" className="text-[8px] font-black px-2 h-5 border-muted-foreground/30 uppercase tracking-tighter">{blockage.severity}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                    {blockage.identifiedCause}
                  </p>
                  <div className="flex items-center gap-6 pt-3">
                     <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 group-hover:underline">
                       <Navigation className="w-4 h-4" /> Track Fleet
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