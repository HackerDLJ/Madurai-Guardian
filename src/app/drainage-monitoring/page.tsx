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
  Droplets
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
  const [mapError, setMapError] = useState<boolean>(false);
  
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="space-y-1">
          <p className="font-bold text-lg">Initializing Resilience Core</p>
          <p className="text-muted-foreground text-sm">Syncing Madurai District UGD Infrastructure Map...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Blue-Green Resilience</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full bg-green-500", isRefreshing && "animate-pulse")} />
              Madurai District UGD Mesh Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1.5 font-bold">
              Intensity: {data.rainfallSimulation.intensity} mm/hr
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
              Event: {data.rainfallSimulation.status}
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
            Sync AI
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Stats Column */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="m3-card border-none shadow-lg p-6 bg-primary text-primary-foreground">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Network Health Index</p>
                <Activity className="w-4 h-4 opacity-70" />
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-6xl font-bold">{data.networkHealthIndex}%</h2>
                <span className="text-xs font-bold opacity-60">Status: {data.networkHealthIndex > 80 ? 'Optimal' : 'Strained'}</span>
              </div>
              <Progress value={data.networkHealthIndex} className="h-1.5 bg-white/20" />
            </div>
          </Card>

          <Card className="m3-card border-none shadow-lg p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Critical Nodes</h3>
            <div className="space-y-4">
              {data.infrastructure.map((node) => (
                <div key={node.id} className="flex gap-3 group cursor-pointer">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    node.status === 'Operational' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                  )}>
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold truncate group-hover:text-primary transition-colors">{node.name}</p>
                    <p className="text-[9px] text-muted-foreground">{node.type} • {node.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Central Map Panel */}
        <Card className="lg:col-span-6 m3-card border-none shadow-xl bg-card p-0 relative overflow-hidden min-h-[500px]">
          {apiKey && !mapError ? (
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
                      <div className="p-3 max-w-[200px] space-y-2">
                        <h4 className="font-bold text-sm text-foreground">
                          {selectedMarker.name || selectedMarker.location}
                        </h4>
                        <Badge className="text-[9px] font-bold uppercase">{selectedMarker.category}</Badge>
                        <p className="text-[10px] text-muted-foreground">
                          {selectedMarker.identifiedCause || `Type: ${selectedMarker.type}`}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>

              {/* Map UI Overlays */}
              <div className="absolute top-4 left-4 z-10 space-y-2">
                <Card className="p-4 rounded-2xl bg-white/95 backdrop-blur shadow-xl border-none space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Network Overlay</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold">Node Operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <span className="text-[10px] font-bold">Waste Blockage</span>
                  </div>
                </Card>
              </div>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/50 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-4 max-w-xs">
                <p className="font-bold text-lg">Google Maps API Activation Required</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Google Maps JavaScript API is not yet activated for this project. 
                </p>
                <div className="p-4 bg-white/80 rounded-2xl border border-primary/20 text-left space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-primary">Steps to Fix:</p>
                  <ol className="text-[10px] space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>Open the <a href="https://console.cloud.google.com/google/maps-apis/api-list" target="_blank" className="text-primary underline font-bold inline-flex items-center gap-1">Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Select project: <code className="bg-muted px-1 rounded">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</code></li>
                    <li>Search for <strong>"Maps JavaScript API"</strong></li>
                    <li>Click the <strong>ENABLE</strong> button</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Right Forecasting Column */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="m3-card border-none shadow-lg p-6 bg-destructive/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-destructive">Flood Forecasting</h3>
              <ShieldAlert className="w-4 h-4 text-destructive" />
            </div>
            <div className="space-y-4">
              {data.floodPredictions.map((pred, i) => (
                <div key={i} className="space-y-2 border-b border-destructive/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm">{pred.zone}</span>
                    <Badge className="bg-destructive text-white border-none text-[8px]">{pred.probability}% Risk</Badge>
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                    {pred.reasoning}
                  </p>
                  <p className="text-[9px] font-bold text-destructive flex items-center gap-1.5 uppercase">
                    <CloudRain className="w-3 h-3" /> Peak in {pred.estimatedImpactTime}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="m3-card border-none shadow-lg p-6 space-y-6 bg-accent/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent-foreground">Correlated Sources</h3>
              <Database className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-4">
              {recentReports?.slice(0, 3).map((report) => (
                <div key={report.id} className="flex gap-3 group bg-white/50 p-3 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-accent shrink-0 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold truncate">{report.aiSuggestedCategory || "Waste Point"}</p>
                    <p className="text-[8px] text-muted-foreground truncate">{report.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <span className="text-[7px] font-bold uppercase">Flow Contributor</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Intervention Panel */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
             <div className="space-y-1">
               <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-amber-500" /> Intervention Queue
               </h3>
               <p className="text-xs text-muted-foreground">AI-Identified District Blockages requiring immediate dispatch.</p>
             </div>
             <div className="flex gap-3">
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full h-12 border-primary text-primary font-bold gap-2 px-6 shadow-sm hover:bg-primary/5">
                      <PlusCircle className="w-4 h-4" /> Log Manual Blockage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[32px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold font-headline">Field Observation Report</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Landmark / Zone</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <Input 
                            id="location" 
                            className="pl-10 rounded-2xl h-12" 
                            value={reportLocation} 
                            onChange={(e) => setReportLocation(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Blockage Details</Label>
                        <Textarea 
                          id="description" 
                          placeholder="e.g., Heavy PET bottle accumulation near Vaigai Gate 2..." 
                          className="rounded-2xl min-h-[120px]"
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleManualReportSubmit} 
                        disabled={isSubmittingReport || !reportDescription}
                        className="w-full rounded-2xl h-14 bg-primary text-white font-bold gap-2 shadow-lg"
                      >
                        {isSubmittingReport ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Dispatch to Engineers
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button className="rounded-full h-12 bg-primary text-white font-bold gap-2 px-8 shadow-lg hover:scale-105 transition-all">
                  <Navigation className="w-4 h-4" /> Dispatch Jetting Fleet
                </Button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.activeBlockages.map((blockage, i) => (
              <Card key={i} className="m3-card border-none shadow-xl p-6 flex gap-6 items-center bg-card group cursor-pointer hover:bg-muted/30 transition-all">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg shrink-0",
                  blockage.severity === 'Critical' ? "bg-destructive" : blockage.severity === 'High' ? "bg-amber-500" : "bg-primary"
                )}>
                  <ArrowDownCircle className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm truncate">{blockage.location}</h4>
                    <Badge variant="outline" className="text-[8px] px-1.5 h-4 border-muted-foreground/20">{blockage.severity}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {blockage.identifiedCause}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                     <span className="text-[8px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                       <Navigation className="w-3 h-3" /> Track Fleet
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
