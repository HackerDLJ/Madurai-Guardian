
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Navigation, Info, Layers, Loader2, ExternalLink } from "lucide-center";
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
          <h1 className="text-2xl font-bold font-headline">City Real-time Map</h1>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search area..." 
              className="pl-12 rounded-3xl h-12 border-none bg-card shadow-sm focus:ring-2 focus:ring-primary" 
            />
          </div>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-3xl bg-card border-none shadow-sm">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="relative flex-1 w-full bg-muted rounded-[40px] overflow-hidden shadow-inner border-4 border-card">
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
                  <div className="p-3 max-w-[220px] space-y-2">
                    <h4 className="font-bold text-sm text-foreground">
                      {selectedIncident.aiSuggestedCategory || "Urban Issue"}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{selectedIncident.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <Badge className={cn(
                        "border-none text-[10px] font-bold px-2 py-0.5",
                        selectedIncident.status === 'Resolved' ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                      )}>
                        {selectedIncident.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {selectedIncident.submittedAt ? <RelativeTime date={selectedIncident.submittedAt} short /> : "Just now"}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
            
            {/* API Setup Instructions Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted/20 pointer-events-none z-50">
              <div className="p-8 bg-white/95 rounded-[40px] border border-primary/20 shadow-2xl space-y-4 max-w-sm pointer-events-auto">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <Layers className="w-8 h-8" />
                </div>
                <h2 className="font-bold text-xl text-foreground">Maps API Setup Required</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Google Maps JavaScript API is not yet activated for project <strong>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</strong>.
                </p>
                <div className="p-4 bg-primary/5 rounded-2xl text-left space-y-3">
                  <p className="text-[10px] font-bold uppercase text-primary tracking-widest">Enable Steps:</p>
                  <ol className="text-[10px] space-y-2 list-decimal list-inside text-muted-foreground leading-relaxed">
                    <li>Visit the <a href="https://console.cloud.google.com/google/maps-apis/api-list" target="_blank" className="text-primary underline font-bold inline-flex items-center gap-1">Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Search for <strong>"Maps JavaScript API"</strong></li>
                    <li>Click <strong>ENABLE</strong> to activate the city maps.</li>
                  </ol>
                </div>
              </div>
            </div>
          </APIProvider>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-muted/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="w-8 h-8" />
            </div>
            <p className="font-bold text-xl">Maps API Key Missing</p>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button className="w-12 h-12 rounded-2xl bg-white text-primary shadow-lg hover:bg-white/90 flex items-center justify-center">
            <Navigation className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white text-secondary shadow-lg hover:bg-white/90 flex items-center justify-center">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
