"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Award, 
  Leaf, 
  Map as MapIcon, 
  Users, 
  Clock, 
  TrendingUp,
  Zap,
  Filter,
  AlertCircle,
  Search
} from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { RelativeTime } from "@/components/relative-time";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const efficiencyData = [
  { name: 'M', value: 30 },
  { name: 'T', value: 45 },
  { name: 'W', value: 35 },
  { name: 'T', value: 65 },
  { name: 'F', value: 85 },
  { name: 'S', value: 98 },
  { name: 'S', value: 40 },
];

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const mapImg = PlaceHolderImages.find(img => img.id === 'city-map-bg');

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userRef);

  const feedsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "incidentReports"), orderBy("submittedAt", "desc"), limit(3));
  }, [db]);

  const { data: feeds } = useCollection(feedsQuery);

  const points = profile?.points || 0;
  const hCredits = profile?.heritageCredits || 0;
  const level = profile?.level || 1;

  return (
    <div className="space-y-10">
      <header className="md:hidden space-y-4">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full liquid-glass rounded-full py-5 pl-14 pr-6 text-sm shadow-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
            placeholder="Search wards, cleanup drives..." 
          />
        </div>
      </header>

      <section>
        <Card className="rounded-[48px] bg-gradient-to-br from-white/60 to-white/10 p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="space-y-8 max-w-2xl relative z-10">
            <div className="flex items-center gap-4">
              <Badge className="bg-accent/20 text-accent-foreground border-none px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent/10">LIVE STATUS</Badge>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <Clock className="w-4 h-4" /> Updated 5m ago
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tight text-foreground leading-tight">Ward 42 <span className="text-primary">Cleanliness</span></h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-xl font-medium">
                Current status is <span className="text-secondary font-bold">Excellent</span>. 92% of scheduled waste collection has been completed today.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/20 backdrop-blur-3xl p-10 rounded-[64px] mt-8 md:mt-0 shadow-2xl border border-white/40 group-hover:scale-105 transition-transform duration-500">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 92 }, { value: 8 }]}
                    innerRadius={65}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="hsl(var(--primary))" className="drop-shadow-[0_0_8px_rgba(66,133,244,0.4)]" />
                    <Cell fill="hsl(var(--muted) / 0.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-primary">92</span>
                <span className="text-xs font-black text-muted-foreground uppercase tracking-tighter">INDEX</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="m3-card group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5 group-hover:rotate-12 transition-transform duration-500">
              <BarChart3 className="w-6 h-6" />
            </div>
            <Badge className="bg-secondary/20 text-secondary border-none font-black text-[10px] px-3">+5.2%</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl tracking-tight">Cleanliness Pulse</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Efficiency Real-time</p>
          </div>
          <div className="h-40 w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {efficiencyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 80 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.1)'} 
                      className="transition-all duration-500"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="m3-card group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-[18px] bg-accent/10 flex items-center justify-center text-accent shadow-lg shadow-accent/5 group-hover:rotate-12 transition-transform duration-500">
              <Award className="w-6 h-6" />
            </div>
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest">Level {level}</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl tracking-tight">Heritage Credits</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Contribution score</p>
          </div>
          <div className="flex items-center gap-8 pt-6">
            <div className="relative w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: points % 500 || 1 }, { value: 500 - (points % 500) }]}
                    innerRadius={35}
                    outerRadius={45}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--muted) / 0.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-foreground">{hCredits}</span>
                <span className="text-[7px] text-muted-foreground font-black uppercase tracking-tighter">PTS</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Points Balance</p>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">{points} Total Clean XP</p>
              <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(66,133,244,0.3)] transition-all duration-1000" style={{ width: `${(points % 500) / 500 * 100}%` }} />
              </div>
              <p className="text-[9px] text-right text-muted-foreground font-bold tracking-tighter">{500 - (points % 500)} to Level {level + 1}</p>
            </div>
          </div>
        </Card>

        <Card className="m3-card group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-[18px] bg-secondary/10 flex items-center justify-center text-secondary shadow-lg shadow-secondary/5 group-hover:rotate-12 transition-transform duration-500">
              <Leaf className="w-6 h-6" />
            </div>
            <Badge className="bg-secondary/20 text-secondary border-none font-black text-[10px] px-3">+150KG</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl tracking-tight">Local Impact</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Green energy conversion</p>
          </div>
          <div className="space-y-6 pt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-foreground">2.4</span>
              <span className="text-lg font-black text-muted-foreground uppercase tracking-widest">TONS</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/30 backdrop-blur-xl p-4 rounded-[24px] flex flex-col gap-1 border border-white/40 shadow-sm group-hover:translate-y-[-4px] transition-transform duration-500">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Energy</span>
                </div>
                <span className="font-black text-base text-foreground">120 <span className="text-xs text-muted-foreground">kWh</span></span>
              </div>
              <div className="bg-white/30 backdrop-blur-xl p-4 rounded-[24px] flex flex-col gap-1 border border-white/40 shadow-sm group-hover:translate-y-[-4px] transition-transform duration-500 delay-75">
                 <div className="flex items-center gap-2 text-secondary">
                  <Leaf className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Compost</span>
                </div>
                <span className="font-black text-base text-foreground">850 <span className="text-xs text-muted-foreground">kg</span></span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <Card className="p-0 overflow-hidden flex flex-col border-none shadow-2xl relative group">
          <div className="p-8 flex justify-between items-center bg-white/40 backdrop-blur-2xl z-20 border-b border-white/20">
            <h3 className="font-bold text-2xl font-headline tracking-tight">City Intelligence Map</h3>
            <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl shadow-inner border border-white/20">
               <Button size="sm" variant="ghost" className="h-9 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/60">Heatmap</Button>
               <Button size="sm" variant="default" className="h-9 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl bg-primary text-white hover:bg-primary/90">Smart Bins</Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[500px]">
            <Image 
              src={mapImg?.imageUrl || "https://picsum.photos/seed/map42/800/600"} 
              alt="Map Background" 
              fill 
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 flex items-center justify-center p-16 z-10">
               <div className="relative w-full h-full liquid-glass rounded-[48px] border-4 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] flex items-center justify-center group-hover:shadow-[0_48px_80px_-12px_rgba(66,133,244,0.15)] transition-all duration-700">
                  <MapIcon className="w-20 h-20 text-primary/20 animate-pulse" />
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 rounded-[18px] bg-secondary text-white flex items-center justify-center shadow-2xl shadow-secondary/40 animate-bounce cursor-pointer hover:scale-125 transition-transform">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-[18px] bg-destructive text-white flex items-center justify-center shadow-2xl shadow-destructive/40 animate-pulse cursor-pointer hover:scale-125 transition-transform">
                    <AlertCircle className="w-6 h-6" />
                  </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col border-none shadow-2xl bg-white/20 backdrop-blur-3xl p-8 group">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="font-bold text-2xl font-headline tracking-tight">Community Feed</h3>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary font-black text-xs uppercase tracking-widest gap-3 px-6 h-12 rounded-full liquid-glass border-none">
               <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar px-2">
            {feeds?.map((feed, i) => (
              <div key={feed.id} className="flex gap-6 group/item relative p-4 rounded-[32px] hover:bg-white/40 transition-all duration-500 cursor-pointer">
                <Avatar className="w-16 h-16 rounded-[22px] border-4 border-white shadow-xl group-hover/item:scale-110 transition-all duration-500">
                  <AvatarImage src={`https://picsum.photos/seed/${feed.userId}/100/100`} />
                  <AvatarFallback className="rounded-[22px] bg-primary/10 text-primary">
                    <Users className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg tracking-tight">Verified Reporter</h4>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {feed.submittedAt ? <RelativeTime date={feed.submittedAt} short /> : "Recently"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
                    {feed.description || "Reported an urban issue. Verification pending by the AI core."}
                  </p>
                  <div className="flex gap-3">
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-none text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-1.5 shadow-sm">{feed.status}</Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-1.5 border-white/40 shadow-sm backdrop-blur-md">#{feed.aiSuggestedCategory || 'Urban'}</Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {(!feeds || feeds.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                <Users className="w-16 h-16 text-muted-foreground/30" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Awaiting fresh reports...</p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}