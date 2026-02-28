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
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section>
        <Card className="rounded-[40px] bg-[#FFFBEB] border-none p-10 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#FEF3C7] text-[#92400E] border-none px-4 py-1.5 rounded-full font-bold text-xs">LIVE STATUS</Badge>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                <Clock className="w-3 h-3" /> Updated 5m ago
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-[#1E1B4B]">Ward 42 Cleanliness Index</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Current status is <span className="text-secondary font-bold">Good</span>. 92% of scheduled waste collection has been completed today, exceeding the weekly average.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/40 p-8 rounded-[48px] mt-8 md:mt-0">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 92 }, { value: 8 }]}
                    innerRadius={50}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    <Cell fill="hsl(var(--accent))" />
                    <Cell fill="transparent" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">92</span>
                <span className="text-[10px] font-bold text-muted-foreground">%</span>
              </div>
            </div>
            <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto">View Analytics</Button>
          </div>
        </Card>
      </section>

      {/* Stats Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="m3-card space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <Badge className="bg-secondary/10 text-secondary border-none font-bold text-[10px]">+5%</Badge>
          </div>
          <div>
            <h3 className="font-bold text-lg">Cleanliness Pulse</h3>
            <p className="text-xs text-muted-foreground">Waste collection efficiency vs target</p>
          </div>
          <div className="h-32 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {efficiencyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 90 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.1)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="m3-card space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Award className="w-5 h-5" />
            </div>
            <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px]">Level 4</Badge>
          </div>
          <div>
            <h3 className="font-bold text-lg">Heritage Credits</h3>
            <p className="text-xs text-muted-foreground">Community contribution score</p>
          </div>
          <div className="flex items-center gap-6 pt-2">
            <div className="relative w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 450 }, { value: 50 }]}
                    innerRadius={30}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold">450</span>
                <span className="text-[6px] text-muted-foreground font-bold uppercase">PTS</span>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-[10px] font-bold text-foreground">Next Reward</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Free Temple Entry Pass</p>
              <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[85%]" />
              </div>
              <p className="text-[8px] text-right text-muted-foreground pt-1">50 pts to go</p>
            </div>
          </div>
        </Card>

        <Card className="m3-card space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Leaf className="w-5 h-5" />
            </div>
            <Badge className="bg-secondary/10 text-secondary border-none font-bold text-[10px]">+150kg</Badge>
          </div>
          <div>
            <h3 className="font-bold text-lg">Local Impact</h3>
            <p className="text-xs text-muted-foreground">Organic waste converted to energy</p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">2.4</span>
              <span className="text-lg font-bold text-muted-foreground">tons</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted/30 p-3 rounded-2xl flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <Zap className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase">Energy</span>
                </div>
                <span className="font-bold text-sm">120 kWh</span>
              </div>
              <div className="flex-1 bg-muted/30 p-3 rounded-2xl flex flex-col gap-1">
                 <div className="flex items-center gap-1.5 text-secondary">
                  <Leaf className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase">Compost</span>
                </div>
                <span className="font-bold text-sm">850 kg</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Map and Feed Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <Card className="m3-card p-0 overflow-hidden flex flex-col">
          <div className="p-6 flex justify-between items-center bg-white z-10">
            <h3 className="font-bold text-lg">Live Cleanliness Map</h3>
            <div className="flex bg-muted/50 p-1 rounded-xl">
               <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[10px] font-bold">Heatmap</Button>
               <Button size="sm" variant="default" className="h-8 rounded-lg text-[10px] font-bold shadow-none bg-primary text-white hover:bg-primary/90">Bins</Button>
            </div>
          </div>
          <div className="flex-1 relative bg-muted/20 min-h-[400px]">
            <Image 
              src="https://picsum.photos/seed/map42/800/600" 
              alt="Map Background" 
              fill 
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center p-12">
               <div className="relative w-full h-full bg-white/40 backdrop-blur rounded-[32px] border-4 border-white shadow-2xl flex items-center justify-center">
                  <MapIcon className="w-12 h-12 text-primary/40" />
                  <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg animate-bounce">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                  </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="m3-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Community Feed</h3>
            <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto gap-2">
               <Filter className="w-3 h-3" /> Filter
            </Button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
            {feeds?.map((feed, i) => (
              <div key={feed.id} className="flex gap-4 group">
                <Avatar className="w-12 h-12 rounded-2xl bg-muted ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <AvatarImage src={`https://picsum.photos/seed/${feed.userId}/100/100`} />
                  <AvatarFallback className="rounded-2xl">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm leading-none">Reporter</h4>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">2h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feed.description || "Reported an urban issue. Verification pending."}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-[#FEF3C7] text-[#92400E] border-none text-[8px] font-bold rounded-lg px-2">{feed.status}</Badge>
                    <Badge variant="outline" className="text-[8px] font-bold rounded-lg px-2 border-muted">#{feed.aiSuggestedCategory || 'Urban'}</Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Fallback Static Mock Data */}
            {(!feeds || feeds.length === 0) && (
              <>
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary ring-2 ring-transparent group-hover:ring-secondary/20 transition-all">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-none">Green Madurai NGO</h4>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">5h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Organized a cleanup drive at Vaigai River bank. 45 volunteers participated.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none text-[8px] font-bold rounded-lg px-2">Completed</Badge>
                      <Badge className="bg-primary/10 text-primary border-none text-[8px] font-bold rounded-lg px-2">+500 Credits</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 group border-t border-muted/30 pt-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-none">City Corporation</h4>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">1d ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      New waste segregation bins installed in Ward 42. Please follow color codes.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
