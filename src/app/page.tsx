
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Users, CheckCircle2, Search, Mic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'madurai-temple');
  const awarenessImage = PlaceHolderImages.find(img => img.id === 'community-cleanup');

  return (
    <div className="space-y-8 pb-10">
      {/* M3 Pill Search Bar */}
      <section className="px-1">
        <div className="m3-pill-search">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input 
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
            placeholder="Search reports or guides..."
          />
          <Mic className="w-5 h-5 text-muted-foreground cursor-pointer" />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="px-1">
        <h2 className="text-3xl font-bold font-headline text-foreground">Vanakkam, Madurai!</h2>
        <p className="text-muted-foreground mt-1 text-base">Help keep our city clean and green.</p>
      </section>

      {/* Hero Action Card */}
      <section>
        <div className="relative h-60 w-full rounded-[32px] overflow-hidden shadow-lg group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/madurai1/800/600"}
            alt="Madurai City"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            data-ai-hint="Madurai temple"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <h3 className="text-white text-2xl font-bold font-headline">Report an Issue</h3>
            <p className="text-white/80 text-sm mb-4">AI-assisted reporting for a cleaner city.</p>
            <Link href="/report/new">
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-bold py-6 text-lg shadow-xl active:scale-[0.98] transition-all">
                New Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4 px-1">
        <Card className="m3-card border-none bg-primary/5">
          <CardContent className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Resolved</p>
            <h3 className="text-2xl font-bold">1,284</h3>
          </CardContent>
        </Card>
        <Card className="m3-card border-none bg-secondary/5">
          <CardContent className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Citizens</p>
            <h3 className="text-2xl font-bold">42.5k</h3>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
          <Link href="/status" className="text-primary text-sm font-bold hover:underline">View all</Link>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, type: "Trash Overflow", loc: "Meenakshi Bazaar", status: "Active", color: "text-primary bg-primary/10" },
            { id: 2, type: "Illegal Dumping", loc: "Goripalayam", status: "New", color: "text-accent-foreground bg-accent/20" }
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-[24px] bg-card border border-border/50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base">{item.type}</h4>
                <p className="text-sm text-muted-foreground">{item.loc}</p>
              </div>
              <Badge variant="outline" className={cn("rounded-full border-none px-4 py-1 font-bold text-[11px]", item.color)}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
