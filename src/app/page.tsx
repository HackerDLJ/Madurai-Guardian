
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, CheckCircle2, Search, Mic, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { useMemoFirebase } from "@/firebase/provider";
import { doc } from "firebase/firestore";

export default function Dashboard() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'madurai-temple');
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

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
      <section className="px-1 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold font-headline text-foreground tracking-tight">Vanakkam, {user?.displayName?.split(' ')[0] || 'Madurai'}!</h2>
          <p className="text-muted-foreground mt-1 text-base">You've earned <span className="text-primary font-bold">{profile?.points || 0}</span> Clean Points.</p>
        </div>
        <Link href="/profile">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Level {profile?.level || 1}</span>
          </div>
        </Link>
      </section>

      {/* Hero Action Card */}
      <section>
        <div className="relative h-64 w-full rounded-[40px] overflow-hidden shadow-lg group">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/madurai1/800/600"}
            alt="Madurai City"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint="Madurai temple"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <h3 className="text-white text-2xl font-bold font-headline mb-1">Report an Issue</h3>
            <p className="text-white/80 text-sm mb-6">AI-assisted reporting for a cleaner city.</p>
            <Link href="/report/new">
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-[24px] font-bold py-7 text-lg shadow-xl active:scale-[0.98] transition-all">
                New Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4 px-1">
        <Card className="rounded-[32px] border-none bg-primary/5 p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Resolved</p>
            <h3 className="text-2xl font-bold">1,284</h3>
          </div>
        </Card>
        <Card className="rounded-[32px] border-none bg-secondary/5 p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Citizens</p>
            <h3 className="text-2xl font-bold">42.5k</h3>
          </div>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4 px-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
          <Link href="/status" className="text-primary text-sm font-bold hover:underline">View all</Link>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, type: "Trash Overflow", loc: "Meenakshi Bazaar", status: "Active", color: "text-primary bg-primary/10" },
            { id: 2, type: "Illegal Dumping", loc: "Goripalayam", status: "New", color: "text-accent-foreground bg-accent/20" }
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5 rounded-[32px] bg-card border border-border/40 hover:shadow-md transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base leading-tight">{item.type}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{item.loc}</p>
              </div>
              <Badge variant="outline" className={cn("rounded-full border-none px-4 py-1.5 font-bold text-[10px] uppercase", item.color)}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
