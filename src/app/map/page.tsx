
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Navigation, Info, Layers, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from "@vis.gl/react-google-maps";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };

export default function CityMap() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const db = useFirestore();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Functional Map: Fetch real incidents from global collection
  const incidentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "incidentReports"), orderBy("submittedAt", "desc"));
  }, [db]);

  const { data: incidents, isLoading } = useCollection(incidentsQuery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return '#34A853'; // Google Green
      case 'In Progress': return '#FBBC05'; // Google Yellow
      case 'Acknowledged': return '#4285F4'; // Google Blue
      default: return '#EA4335'; // Google Red (Submitted)
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

      {/* Map Integration */}
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
                        {selectedIncident.submittedAt ? formatDistanceToNow(new Date(selectedIncident.submittedAt)) + " ago" : "Just now"}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-lg">Map Initialization Required</p>
              <p className="text-sm text-muted-foreground">Please provide a Google Maps API Key in the .env file to view the real-time Madurai dashboard.</p>
            </div>
          </div>
        )}

        {/* Floating Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button size="icon" className="w-12 h-12 rounded-2xl bg-white text-primary shadow-lg hover:bg-white/90">
            <Navigation className="w-6 h-6" />
          </Button>
          <Button size="icon" className="w-12 h-12 rounded-2xl bg-white text-secondary shadow-lg hover:bg-white/90">
            <Info className="w-6 h-6" />
          </Button>
        </div>

        {/* Earth Engine Overlay Info */}
        <div className="absolute bottom-24 left-6 right-6 z-10">
          <Card className="p-4 rounded-[32px] bg-white/90 backdrop-blur shadow-xl border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Earth Engine Status</p>
                  <p className="text-sm font-semibold">Live Analysis {incidents ? `(${incidents.length} points)` : 'Ready'}</p>
                </div>
              </div>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList className="bg-muted/50 rounded-full p-1 h-10">
                  <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-4 text-xs">Hybrid</TabsTrigger>
                  <TabsTrigger value="infra" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-4 text-xs">Heatmap</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
