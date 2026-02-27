
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Navigation, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CityMap() {
  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold font-headline">City Real-time Map</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search area..." 
              className="pl-12 rounded-3xl h-12 border-none bg-card google-shadow" 
            />
          </div>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-3xl bg-card border-none google-shadow">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Map Mock View */}
      <div className="relative flex-1 min-h-[500px] w-full bg-muted rounded-[40px] overflow-hidden google-shadow">
        {/* Placeholder for map background */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://picsum.photos/seed/madurai-map/1200/800')" }}
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />

        {/* Map UI Elements */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="icon" className="w-12 h-12 rounded-2xl bg-white text-primary google-shadow hover:bg-white/90">
            <Navigation className="w-6 h-6" />
          </Button>
          <Button size="icon" className="w-12 h-12 rounded-2xl bg-white text-secondary google-shadow hover:bg-white/90">
            <Info className="w-6 h-6" />
          </Button>
        </div>

        {/* Map Markers (Mocks) */}
        <div className="absolute top-1/4 left-1/3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-destructive border-4 border-white flex items-center justify-center text-white google-shadow animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 w-48 hidden group-hover:block material-card rounded-2xl">
            <h4 className="font-bold text-sm">Trash Overflow</h4>
            <p className="text-xs text-muted-foreground">Reported 2h ago</p>
            <Badge className="mt-2 bg-destructive/10 text-destructive border-none">Urgent</Badge>
          </Card>
        </div>

        <div className="absolute top-1/2 right-1/4 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary border-4 border-white flex items-center justify-center text-white google-shadow">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/2 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-secondary border-4 border-white flex items-center justify-center text-white google-shadow">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Panel Legend */}
        <div className="absolute bottom-6 left-6 right-6">
          <Card className="material-card p-4 rounded-[32px] bg-card/90 backdrop-blur">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 bg-transparent p-0 h-10 gap-2">
                <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="urgent" className="rounded-full data-[state=active]:bg-destructive data-[state=active]:text-white">Urgent</TabsTrigger>
                <TabsTrigger value="my" className="rounded-full data-[state=active]:bg-secondary data-[state=active]:text-white">My Reports</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
