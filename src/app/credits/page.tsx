"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Sparkles, 
  Store, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Zap,
  Leaf,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const creditTypes = [
  {
    title: "Daily Frontage Sweep",
    description: "Maintain the 10-meter area in front of your shop or home clean daily.",
    points: "+10 pts / day",
    icon: <Sparkles className="w-5 h-5" />,
    color: "bg-amber-500",
    category: "Daily Duty"
  },
  {
    title: "Waste Segregation Setup",
    description: "Implement a 3-bin segregation system (Organic, Recyclable, Others).",
    points: "+200 pts",
    icon: <Trash2 className="w-5 h-5" />,
    color: "bg-blue-500",
    category: "One-time"
  },
  {
    title: "Public Dustbin Hosting",
    description: "Allow a municipal-approved dustbin to be placed near your establishment.",
    points: "+50 pts / week",
    icon: <Store className="w-5 h-5" />,
    color: "bg-green-500",
    category: "Recurring"
  },
  {
    title: "Community Cleanup Drive",
    description: "Participate in or organize a local neighborhood cleaning event.",
    points: "+100 pts / event",
    icon: <Users className="w-5 h-5" />,
    color: "bg-purple-500",
    category: "Community"
  },
  {
    title: "AI-Verified Reporting",
    description: "Successfully report an urban issue with high-quality photo evidence.",
    points: "+25 pts / report",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-primary",
    category: "Reporting"
  }
];

const rewards = [
  {
    title: "Municipal Fee Discount",
    requirement: "1,000 Credits",
    benefit: "15% off license fees",
    icon: <Award className="w-6 h-6" />
  },
  {
    title: "City Guide Spotlight",
    requirement: "2,500 Credits",
    benefit: "Featured in Tourism App",
    icon: <Info className="w-6 h-6" />
  }
];

export default function HeritageCreditsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const credits = profile?.heritageCredits || 0;
  const progressValue = Math.min((credits / 2500) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Heritage Credits</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          The Heritage Credits program incentivizes Madurai's citizens and shopkeepers to take ownership of city cleanliness. 
          Earn credits for civic responsibility and redeem them for municipal benefits.
        </p>
      </header>

      {/* Credits Overview Card */}
      <section>
        <Card className="rounded-[40px] bg-gradient-to-br from-[#1E1B4B] to-[#312E81] text-white p-10 relative overflow-hidden shadow-xl">
          <Award className="absolute -top-6 -right-6 w-48 h-48 opacity-10 rotate-12" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                {profile?.isShopkeeper ? "Shopkeeper Account" : "Citizen Account"}
              </Badge>
              <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> Verified Guardian
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest">Available Balance</p>
                <h2 className="text-6xl font-bold tracking-tight">{credits.toLocaleString()} <span className="text-xl text-white/40">Credits</span></h2>
              </div>
              
              <div className="flex-1 space-y-3 pb-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-white/60">Progress to Next Tier</span>
                  <span className="text-white">{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-white/10" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Earning Types Listing */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold font-headline">How to Earn</h3>
          <Button variant="ghost" className="text-primary font-bold gap-2">
            View Policy <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creditTypes.map((type) => (
            <Card key={type.title} className="m3-card border-none hover:shadow-md transition-all p-6 group cursor-pointer">
              <div className="flex gap-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", type.color)}>
                  {type.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{type.title}</h4>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px] font-bold uppercase">
                      {type.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                  <p className="text-sm font-bold text-primary">{type.points}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Rewards Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Leaf className="w-6 h-6 text-secondary" />
          <h3 className="text-2xl font-bold font-headline">Redeem Rewards</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.title} className="m3-card bg-secondary/5 border-2 border-secondary/10 p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-[28px] bg-white shadow-sm flex items-center justify-center text-secondary">
                {reward.icon}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-lg">{reward.title}</h4>
                <p className="text-sm text-secondary font-bold">{reward.benefit}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 flex-1 bg-secondary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${Math.min((credits / parseInt(reward.requirement.replace(/[^0-9]/g, ''))) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{reward.requirement}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full border-secondary text-secondary font-bold px-6"
                disabled={credits < parseInt(reward.requirement.replace(/[^0-9]/g, ''))}
              >
                {credits >= parseInt(reward.requirement.replace(/[^0-9]/g, '')) ? "Unlock" : "Locked"}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Participation CTA */}
      <Card className="p-8 rounded-[40px] bg-accent/10 border-none flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold font-headline">Ready to boost your credits?</h3>
          <p className="text-muted-foreground">Start by reporting an issue or verifying your shop frontage.</p>
        </div>
        <div className="flex gap-4">
          <Button className="rounded-full px-8 py-6 font-bold text-lg bg-primary" asChild>
            <a href="/report/new">Start Reporting</a>
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 font-bold text-lg">Contact Admin</Button>
        </div>
      </Card>
    </div>
  );
}