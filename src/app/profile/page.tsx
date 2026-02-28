"use client";

import { useUser, useFirestore, useDoc } from "@/firebase";
import { useMemoFirebase } from "@/firebase/provider";
import { doc } from "firebase/firestore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Medal, 
  Store, 
  History, 
  TrendingUp,
  Settings,
  Share2,
  Target,
  CheckCircle2,
  Zap,
  Award,
  Crown,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from "@/lib/utils";

const chartData = [
  { name: 'Mon', points: 400 },
  { name: 'Tue', points: 300 },
  { name: 'Wed', points: 500 },
  { name: 'Thu', points: 280 },
  { name: 'Fri', points: 590 },
  { name: 'Sat', points: 800 },
  { name: 'Sun', points: 650 },
];

const achievements = [
  {
    id: "scout",
    title: "Madurai Scout",
    description: "Report 5 cleanliness issues in your ward.",
    progress: 3,
    total: 5,
    icon: <Target className="w-5 h-5" />,
    color: "bg-primary",
  },
  {
    id: "wizard",
    title: "Waste Wizard",
    description: "Correctly identify 10 waste fractions using AI.",
    progress: 8,
    total: 10,
    icon: <Zap className="w-5 h-5" />,
    color: "bg-accent",
  },
  {
    id: "guardian",
    title: "Temple Guardian",
    description: "Keep the Meenakshi temple zone clean for 7 days.",
    progress: 7,
    total: 7,
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "bg-secondary",
    completed: true,
  },
  {
    id: "hero",
    title: "Civic Hero",
    description: "Organize a local cleanup drive with 5+ neighbors.",
    progress: 1,
    total: 5,
    icon: <Crown className="w-5 h-5" />,
    color: "bg-destructive",
  }
];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  if (isUserLoading || isProfileLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Loading your profile...</p>
    </div>
  );

  const points = profile?.points || 0; 
  const level = profile?.level || 1;
  const progressValue = ((points % 500) / 500) * 100;
  const badges = profile?.badges || [];

  return (
    <div className="space-y-8 pb-24 max-w-lg mx-auto">
      {/* Header Section */}
      <header className="flex flex-col items-center gap-6 pt-8 px-4">
        <div className="relative">
          <Avatar className="w-28 h-28 border-4 border-background shadow-2xl ring-2 ring-primary/20">
            <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/150/150`} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {user?.displayName?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-background">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">{user?.displayName || profile?.displayName || "Madurai Guardian"}</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-bold">
              Level {level} Guardian
            </Badge>
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <Button className="flex-1 rounded-[24px] bg-primary font-bold shadow-lg gap-2 h-12">
            <Share2 className="w-4 h-4" /> Share Progress
          </Button>
          {profile?.isShopkeeper && (
            <Link href="/shopkeeper" className="flex-1">
              <Button variant="outline" className="w-full rounded-[24px] border-primary text-primary font-bold h-12 gap-2">
                <Store className="w-4 h-4" /> Shop Portal
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4 px-4">
        <Card className="m3-card bg-primary/5 border-none p-6 flex flex-col items-start gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Clean Points</p>
            <h3 className="text-3xl font-bold text-primary">{points.toLocaleString()}</h3>
          </div>
        </Card>
        <Card className="m3-card bg-secondary/5 border-none p-6 flex flex-col items-start gap-2">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Heritage Credits</p>
            <h3 className="text-3xl font-bold text-secondary">{profile?.heritageCredits?.toLocaleString() || 0}</h3>
          </div>
        </Card>
      </section>

      {/* Progression Section */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-headline">Next Milestone</h3>
            <p className="text-xs text-muted-foreground">Keep up the good work for Level {level + 1}!</p>
          </div>
          <span className="text-sm font-bold text-primary">{points % 500} / 500 XP</span>
        </div>
        <Progress value={progressValue} className="h-3 rounded-full bg-muted" />
      </section>

      {/* Activity Tabs */}
      <Tabs defaultValue="achievements" className="px-4">
        <TabsList className="w-full h-14 bg-muted/50 rounded-[28px] p-1.5 mb-6 overflow-x-auto no-scrollbar justify-start sm:justify-center">
          <TabsTrigger value="achievements" className="flex-1 min-w-[100px] rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Achievements</TabsTrigger>
          <TabsTrigger value="badges" className="flex-1 min-w-[80px] rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Badges</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 min-w-[80px] rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 min-w-[80px] rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <h3 className="text-lg font-bold px-1">Milestones</h3>
          {achievements.map((ach) => (
            <Card key={ach.id} className="m3-card border-none bg-card shadow-sm p-5 space-y-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", ach.color)}>
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base">{ach.title}</h4>
                    {ach.completed && (
                      <Badge className="bg-green-500 text-white border-none rounded-full px-2 py-0.5 text-[10px] uppercase font-bold">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mt-1">{ach.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.total}</span>
                </div>
                <Progress value={(ach.progress / ach.total) * 100} className="h-2 bg-muted rounded-full" />
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="badges" className="grid grid-cols-3 gap-6 py-4">
          {badges.length > 0 ? badges.map((badgeId) => (
            <div key={badgeId} className="flex flex-col items-center gap-3 text-center">
              <div className="w-20 h-20 rounded-[30px] flex items-center justify-center text-white shadow-xl transition-transform hover:scale-110 bg-primary">
                <Medal className="w-10 h-10" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-tight">{badgeId}</p>
                <p className="text-[8px] text-muted-foreground uppercase">AI Verified Badge</p>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-10 text-muted-foreground italic text-sm">
              No badges earned yet. Start reporting to earn them!
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {[
            { title: "Trash Reported", date: "Today, 10:24 AM", pts: "+50", loc: "Bibikulam" },
            { title: "Source Segregation", date: "Yesterday", pts: "+100", loc: "Home" },
          ].map((deed, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-card rounded-[32px] border border-border/40 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{deed.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">{deed.date}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-primary font-bold uppercase">{deed.loc}</span>
                  </div>
                </div>
              </div>
              <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">{deed.pts}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="m3-card border-none bg-card shadow-sm p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Points Trend
              </CardTitle>
            </CardHeader>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#888'}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="points" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}