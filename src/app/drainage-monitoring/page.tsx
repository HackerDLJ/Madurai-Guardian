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
  GitBranch,
  Trash2,
  Database,
  PlusCircle,
  MapPin,
  Send,
  Layers,
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
import { RelativeTime } from "@/components/relative-time";
import { useToast } from "@/hooks/use-toast";

const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };
const STP_COORDINATES = [
  { name: "Sakkimangalam", lat: 9.9147, lng: 78.1714 },
  { name: "Avaniapuram", lat: 9.8821, lng: 78.1154 }
];

export default function DrainageMonitoringPage() {
  const [data, setData] = useState<DrainageDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  
  // Quick Report State
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState("Manual Entry");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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

  const handleManualReportSubmit = async () => {
    if (!user || !db || !reportDescription) return;

    setIsSubmittingReport(true);
    
    const reportData = {
      userId: user.uid,
      description: `Drainage/UGD Issue: ${reportDescription}`,
      latitude: MADURAI_CENTER.lat + (Math.random() - 0.5) * 0.01,
      longitude: MADURAI_CENTER.lng + (Math.random() - 0.5) * 0.01,
      photoUrls: ["https://picsum.photos/seed/drainage_manual/800/600"],
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      isVerified: true,
      aiSuggestedCategory: "Drainage Blockage",
      pointsAwarded: 25,
    };

    try {
      addDocumentNonBlocking(collection(db, "incidentReports"), reportData);
      toast({ 
        title: "Report Submitted", 
        description: "Your drainage issue report has been logged successfully." 
      });
      setIsReportDialogOpen(false);
      setReportDescription("");
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: "Could not log the drainage issue." 
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

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
              Madurai District Drainage Map Active
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
              Live analysis of district-wide hydraulic pressure vs. waste load.
            </p>
          </div>
        </Card>

        {/* Predictive Flood Zones */}
        <Card className="m3-card border-none shadow-lg lg:col-span-9 p-6 space-y-6 bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" /> AI Flood Forecasting
            </h3>
            <Badge className="bg-destructive/10 text-destructive border-none text-[10px] font-bold tracking-widest uppercase">District Risk Map</Badge>
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

        {/* Live Drainage Map */}
        <Card className="lg:col-span-8 m3-card border-none shadow-xl bg-card p-0 relative overflow-hidden min-h-[500px]">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <div className="absolute inset-0">
                <Map
                  defaultCenter={MADURAI_CENTER}
                  defaultZoom={13}
                  mapId="drainage_network_map"
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                >
                  {/* STP Markers */}
                  {STP_COORDINATES.map((stp, i) => (
                    <AdvancedMarker
                      key={`stp-${i}`}
                      position={{ lat: stp.lat, lng: stp.lng }}
                      onClick={() => setSelectedMarker({ ...stp, type: 'STP' })}
                    >
                      <Pin 
                        background={'#4285F4'} 
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
                      onClick={() => setSelectedMarker({ ...blockage, type: 'Blockage' })}
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
                      position={selectedMarker.coordinates || { lat: selectedMarker.lat, lng: selectedMarker.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-3 max-w-[200px] space-y-2">
                        <h4 className="font-bold text-sm text-foreground">
                          {selectedMarker.name || selectedMarker.location}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {selectedMarker.type === 'STP' ? 'Sewage Treatment Plant' : `Severity: ${selectedMarker.severity}`}
                        </p>
                        {selectedMarker.identifiedCause && (
                          <p className="text-[10px] italic text-destructive font-medium mt-1">
                            Cause: {selectedMarker.identifiedCause}
                          </p>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>

              {/* Floating Map Legend */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <Card className="p-4 rounded-2xl bg-white/90 backdrop-blur shadow-lg border-none space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Drainage Legend</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold">STP Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-[10px] font-bold">Waste Blockage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold">High Flood Risk</span>
                  </div>
                </Card>
              </div>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/50">
              <Layers className="w-12 h-12 text-primary/40" />
              <div>
                <p className="font-bold">Map Key Required</p>
                <p className="text-xs text-muted-foreground">Provide Google Maps API Key to view live district drainage infrastructure.</p>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-6 right-8 flex items-center gap-3 z-10">
             <Button size="sm" variant="outline" className="rounded-full bg-white/80 backdrop-blur border-none shadow-md h-9 gap-2 text-[10px] font-bold uppercase">
               <Layers className="w-3 h-3" /> Toggle Topology
             </Button>
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
             <div className="flex gap-4">
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full border-primary text-primary font-bold gap-2 px-6 py-6 shadow-sm hover:bg-primary/5">
                      <PlusCircle className="w-5 h-5" /> Report Manual Blockage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[32px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold font-headline">Report Drainage Issue</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location Landmark</Label>
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
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detailed Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="e.g., Heavy overflow near South Masi St junction..." 
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
                        Submit Field Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button className="rounded-full bg-primary text-white font-bold gap-2 px-8 py-6 shadow-lg hover:scale-105 transition-all">
                  <Navigation className="w-5 h-5" /> Dispatch Hydro-Jetting Fleet
                </Button>
             </div>
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
