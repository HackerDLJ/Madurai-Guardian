
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
  Search,
  ChevronRight,
  Sparkles,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Send,
  MessageSquare,
  Globe,
  ExternalLink
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

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luke-jebasundar-46805a364", icon: <Linkedin className="w-5 h-5" />, color: "hover:bg-blue-600 hover:text-white" },
  { label: "GitHub", href: "https://github.com/HackerDLJ", icon: <Github className="w-5 h-5" />, color: "hover:bg-gray-800 hover:text-white" },
  { label: "X", href: "https://x.com/DLJ25961186", icon: <Twitter className="w-5 h-5" />, color: "hover:bg-black hover:text-white" },
  { label: "Telegram", href: "https://t.me/LukeDLJ", icon: <Send className="w-5 h-5" />, color: "hover:bg-blue-400 hover:text-white" },
  { label: "Instagram", href: "https://www.instagram.com/lukedlj", icon: <Instagram className="w-5 h-5" />, color: "hover:bg-pink-600 hover:text-white" },
  { label: "Discord", href: "https://discord.com/users/869597257295609886", icon: <MessageSquare className="w-5 h-5" />, color: "hover:bg-indigo-600 hover:text-white" },
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
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="md:hidden space-y-6">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full liquid-glass rounded-full py-6 pl-16 pr-8 text-sm shadow-2xl focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-500"
            placeholder="Search Intelligence Mesh..." 
          />
        </div>
      </header>

      {/* Hero Section */}
      <section>
        <Card className="rounded-[64px] liquid-glass p-16 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border-white/40">
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <Sparkles className="absolute top-10 right-10 w-24 h-24 text-primary/5 rotate-12" />
          
          <div className="space-y-10 max-w-2xl relative z-10">
            <div className="flex items-center gap-6">
              <Badge className="bg-primary/20 text-primary border-none px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/10">CORE STABILITY: ELITE</Badge>
              <div className="flex items-center gap-3 text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">
                <Clock className="w-4 h-4" /> Live Sync 2s ago
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-7xl font-black tracking-tighter text-foreground leading-[1.1]">Ward 42 <span className="text-primary italic">Mesh</span></h1>
              <p className="text-muted-foreground/80 text-2xl font-medium leading-relaxed max-w-lg">
                Environmental status is <span className="text-secondary font-black">Optimized</span>. 92% throughput verified.
              </p>
            </div>
            <Button size="lg" className="rounded-full h-16 px-10 bg-primary text-white font-black text-lg shadow-[0_20px_40px_rgba(66,133,244,0.3)] hover:scale-105 transition-all gap-4">
              Explore Neural Map <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-6 bg-white/10 backdrop-blur-[60px] p-12 rounded-[80px] mt-12 md:mt-0 shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-white/40 group-hover:scale-[1.05] transition-all duration-1000">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 92 }, { value: 8 }]}
                    innerRadius={75}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="hsl(var(--primary))" className="drop-shadow-[0_0_20px_rgba(66,133,244,0.6)]" />
                    <Cell fill="hsl(var(--muted) / 0.1)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-foreground tracking-tighter">92</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Stability</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card className="m3-card group border-white/30">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-2xl group-hover:rotate-6 transition-all duration-500">
              <BarChart3 className="w-7 h-7" />
            </div>
            <Badge className="bg-secondary/20 text-secondary border-none font-black text-[10px] px-4 py-1.5">+5.2%</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-2xl tracking-tight">Environmental Pulse</h3>
            <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">Efficiency Mesh</p>
          </div>
          <div className="h-44 w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {efficiencyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 80 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.15)'} 
                      className="transition-all duration-1000"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="m3-card group border-white/30">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shadow-2xl group-hover:rotate-6 transition-all duration-500">
              <Award className="w-7 h-7" />
            </div>
            <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5">Elite Level {level}</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-2xl tracking-tight">Heritage Credits</h3>
            <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">Civic Contribution</p>
          </div>
          <div className="flex items-center gap-10 pt-10">
            <div className="relative w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: points % 500 || 1 }, { value: 500 - (points % 500) }]}
                    innerRadius={45}
                    outerRadius={55}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="hsl(var(--primary))" className="drop-shadow-[0_0_12px_rgba(66,133,244,0.4)]" />
                    <Cell fill="hsl(var(--muted) / 0.1)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-foreground">{hCredits}</span>
                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter">CREDITS</span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <p className="text-[11px] font-black text-foreground uppercase tracking-[0.15em]">XP Progress</p>
              <div className="h-2.5 w-full bg-muted/10 rounded-full overflow-hidden border border-white/20 shadow-inner">
                <div className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(66,133,244,0.5)] transition-all duration-[2s]" style={{ width: `${(points % 500) / 500 * 100}%` }} />
              </div>
              <p className="text-[9px] text-right text-muted-foreground/80 font-black tracking-widest">{500 - (points % 500)} XP to Level {level + 1}</p>
            </div>
          </div>
        </Card>

        <Card className="m3-card group border-white/30">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary shadow-2xl group-hover:rotate-6 transition-all duration-500">
              <Leaf className="w-7 h-7" />
            </div>
            <Badge className="bg-secondary/25 text-secondary border-none font-black text-[10px] px-4 py-1.5">+150KG</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-2xl tracking-tight">Ecological Impact</h3>
            <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">Bio-Energy Conversion</p>
          </div>
          <div className="space-y-8 pt-10">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-foreground tracking-tighter">2.4</span>
              <span className="text-xl font-black text-muted-foreground/40 uppercase tracking-[0.2em]">TONS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-[40px] p-5 rounded-[32px] flex flex-col gap-2 border border-white/10 shadow-xl group-hover:translate-y-[-6px] transition-all duration-700">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Power</span>
                </div>
                <span className="font-black text-lg text-foreground">120 <span className="text-xs text-muted-foreground font-medium uppercase">kWh</span></span>
              </div>
              <div className="bg-white/5 backdrop-blur-[40px] p-5 rounded-[32px] flex flex-col gap-2 border border-white/10 shadow-xl group-hover:translate-y-[-6px] transition-all duration-700 delay-100">
                 <div className="flex items-center gap-2 text-secondary">
                  <Leaf className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Earth</span>
                </div>
                <span className="font-black text-lg text-foreground">850 <span className="text-xs text-muted-foreground font-medium uppercase">kg</span></span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Map & Feed Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-0 overflow-hidden flex flex-col border-none shadow-[0_48px_100px_rgba(0,0,0,0.2)] relative group rounded-[64px]">
          <div className="p-10 flex justify-between items-center bg-white/10 backdrop-blur-[60px] z-20 border-b border-white/10">
            <h3 className="font-black text-3xl tracking-tight text-foreground">Intelligence Map</h3>
            <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-[24px] shadow-inner border border-white/10">
               <Button size="sm" variant="ghost" className="h-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/20 px-6">Heatmap</Button>
               <Button size="sm" variant="default" className="h-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-2xl bg-primary text-white hover:bg-primary/90 px-6">Smart Nodes</Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[550px]">
            <Image 
              src={mapImg?.imageUrl || "https://picsum.photos/seed/map42/800/600"} 
              alt="Intelligence Map" 
              fill 
              className="object-cover opacity-60 group-hover:scale-[1.05] transition-transform duration-[4s]"
            />
            <div className="absolute inset-0 flex items-center justify-center p-20 z-10">
               <div className="relative w-full h-full bg-white/5 backdrop-blur-[80px] rounded-[56px] border-[3px] border-white/20 shadow-[0_64px_128px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:shadow-[0_80px_160px_-20px_rgba(66,133,244,0.3)] transition-all duration-1000">
                  <MapIcon className="w-24 h-24 text-primary/15 animate-pulse" />
                  <div className="absolute top-1/4 left-1/3 w-14 h-14 rounded-[22px] bg-secondary text-white flex items-center justify-center shadow-[0_15px_30px_rgba(34,197,94,0.5)] animate-bounce cursor-pointer hover:scale-125 transition-all">
                    <Leaf className="w-7 h-7" />
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-14 h-14 rounded-[22px] bg-destructive text-white flex items-center justify-center shadow-[0_15px_30px_rgba(239,68,68,0.5)] animate-pulse cursor-pointer hover:scale-125 transition-all">
                    <AlertCircle className="w-7 h-7" />
                  </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col border-none shadow-[0_48px_100px_rgba(0,0,0,0.1)] bg-white/5 backdrop-blur-[60px] p-12 group rounded-[64px] border-white/10">
          <div className="flex justify-between items-center mb-12">
            <h3 className="font-black text-3xl tracking-tight text-foreground">Community Sync</h3>
            <Button variant="ghost" className="text-muted-foreground/60 hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] gap-3 h-14 px-8 rounded-full bg-white/5 border border-white/10 transition-all">
               <Filter className="w-4 h-4" /> Categorize
            </Button>
          </div>
          <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pr-2">
            {feeds?.map((feed, i) => (
              <div key={feed.id} className="flex gap-8 group/item relative p-6 rounded-[40px] hover:bg-white/10 transition-all duration-700 cursor-pointer border border-transparent hover:border-white/10">
                <Avatar className="w-20 h-20 rounded-[28px] border-[3px] border-white/20 shadow-2xl group-hover/item:scale-110 transition-all duration-700">
                  <AvatarImage src={`https://picsum.photos/seed/${feed.userId}/120/120`} />
                  <AvatarFallback className="rounded-[28px] bg-primary/15 text-primary">
                    <Users className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-xl tracking-tight">Citizen #{feed.userId.slice(0, 4)}</h4>
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                      {feed.submittedAt ? <RelativeTime date={feed.submittedAt} short /> : "Neural Sync"}
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground/80 font-medium leading-relaxed line-clamp-2">
                    {feed.description || "Reported an environmental anomaly. Neural verification in progress."}
                  </p>
                  <div className="flex gap-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl px-5 py-2 shadow-inner">{feed.status}</Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl px-5 py-2 border-white/20 shadow-sm backdrop-blur-xl">#{feed.aiSuggestedCategory || 'Urban'}</Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {(!feeds || feeds.length === 0) && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-30">
                <Users className="w-24 h-24 text-muted-foreground/20" />
                <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing fresh reports...</p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* About the Developer Section */}
      <section className="pt-12">
        <Card className="rounded-[64px] liquid-glass p-16 relative overflow-hidden group border-white/40 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-accent/20 text-accent border-none px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">Architect & Innovator</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase">About the Developer</h2>
            </div>
            
            <div className="max-w-4xl space-y-6">
              <h3 className="text-3xl font-bold text-primary">LUKE JEBASUNDAR D</h3>
              <p className="text-xl text-muted-foreground/80 font-medium leading-relaxed italic">
                "I’m a first‑year Computer Science Engineering student from Tirunelveli, Tamil Nadu, deeply passionate about AI, blockchain, and full‑stack development. I love building DeFi and AI‑driven applications and regularly participate in hackathons to create accessible tech solutions for rural and underserved communities. Alongside coding, I enjoy music production, poetry, Art and designing engaging presentations. I’m currently strengthening my skills in React Native, Supabase, and decentralized systems while working toward a future that blends innovation, finance, and social impact."
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full pt-8">
              {socialLinks.map((link) => (
                <Button 
                  key={link.label}
                  asChild
                  variant="outline"
                  className={cn(
                    "rounded-[28px] h-16 bg-white/5 border-white/10 backdrop-blur-xl shadow-lg transition-all duration-500 group/btn",
                    link.color
                  )}
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1">
                    {link.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{link.label}</span>
                  </a>
                </Button>
              ))}
            </div>

            <div className="pt-10 flex items-center gap-2 text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">
              <Globe className="w-4 h-4" />
              Building for a better Tamil Nadu • 2026
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
