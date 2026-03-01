"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Navigation, Info, Layers, Loader2, ExternalLink, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from "@vis.gl/react-google-maps";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { RelativeTime } from "@/components/relative-time";
import { cn } from "@/lib/utils";

const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };

export default function CityMap() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(true);
  const db = useFirestore();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const incidentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "incidentReports"), orderBy("submittedAt", "desc"));
  }, [db]);

  const { data: incidents, isLoading } = useCollection(incidentsQuery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return '#34A853'; 
      case 'In Progress': return '#FBBC05'; 
      case 'Acknowledged': return '#4285F4'; 
      default: return '#EA4335'; 
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-14rem)] pb-10">
      <header className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">City Real-time Map</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-80">Intelligence Mesh v4.0</p>
          </div>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search Intelligence Mesh..." 
              className="pl-12 rounded-[24px] h-14 border-white/10 bg-white/5 backdrop-blur-xl shadow-inner focus:ring-2 focus:ring-primary font-bold" 
            />
          </div>
          <Button variant="outline" size="icon" className="w-14 h-14 rounded-[24px] bg-white/5 border-white/10 shadow-xl backdrop-blur-xl hover:bg-white/10">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="relative flex-1 w-full bg-muted/20 rounded-[48px] overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.1)] border border-white/10">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={MADURAI_CENTER}
              defaultZoom={14}
              mapId="madurai_guardian_map"
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              {incidents?.map((incident) => (
                <AdvancedMarker
                  key={incident.id}
                  position={{ lat: incident.latitude, lng: incident.longitude }}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <Pin 
                    background={getStatusColor(incident.status)} 
                    borderColor={'#FFFFFF'} 
                    glyphColor={'#FFFFFF'} 
                  />
                </AdvancedMarker>
              ))}

              {selectedIncident && (
                <InfoWindow
                  position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                  onCloseClick={() => setSelectedIncident(null)}
                >
                  <div className="p-4 max-w-[240px] space-y-3">
                    <h4 className="font-black text-sm text-foreground tracking-tight">
                      {selectedIncident.aiSuggestedCategory || "Urban Issue"}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{selectedIncident.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <Badge className={cn(
                        "border-none text-[9px] font-black uppercase px-3 py-1",
                        selectedIncident.status === 'Resolved' ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                      )}>
                        {selectedIncident.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                        {selectedIncident.submittedAt ? <RelativeTime date={selectedIncident.submittedAt} short /> : "Neural Sync"}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
            
            {showHelp && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/5 backdrop-blur-sm z-50 pointer-events-none">
                <Card className="p-8 bg-white/95 dark:bg-black/95 rounded-[48px] border border-primary/20 shadow-2xl space-y-6 max-w-sm pointer-events-auto relative">
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
                  
                  <div className="space-y-2">
                    <h2 className="font-black text-xl text-foreground tracking-tight uppercase">Fixing Map Errors</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      If the map shows a gray error box (ApiTargetBlockedMapError), follow these steps to enable the service:
                    </p>
                  </div>

                  <div className="p-5 bg-primary/5 rounded-[32px] text-left space-y-4">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Mandatory Steps:</p>
                    <ol className="text-[10px] space-y-2.5 list-decimal list-inside text-muted-foreground font-bold leading-relaxed">
                      <li>Visit the <a href="https://console.cloud.google.com/google/maps-apis/api-list" target="_blank" className="text-primary underline font-black inline-flex items-center gap-1">Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                      <li>Select project <strong>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</strong></li>
                      <li>Search for <strong>"Maps JavaScript API"</strong></li>
                      <li>Click <strong>ENABLE</strong>. It may take 2-5 mins to propagate.</li>
                    </ol>
                  </div>

                  <Button className="w-full rounded-full h-12 bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl" onClick={() => setShowHelp(false)}>
                    I've Enabled It
                  </Button>
                </Card>
              </div>
            )}
          </APIProvider>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-muted/50">
            <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-xl">
              <Layers className="w-8 h-8" />
            </div>
            <p className="font-black text-xl tracking-tighter uppercase">Maps API Key Missing</p>
          </div>
        )}

        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <button className="w-14 h-14 rounded-[24px] bg-white/90 backdrop-blur-xl text-primary shadow-2xl hover:bg-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-white/20">
            <Navigation className="w-6 h-6" />
          </button>
          <button 
            className="w-14 h-14 rounded-[24px] bg-white/90 backdrop-blur-xl text-secondary shadow-2xl hover:bg-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-white/20"
            onClick={() => setShowHelp(true)}
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
