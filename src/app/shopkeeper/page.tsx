"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Award, Percent, Info, MapPin, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function ShopkeeperPortal() {
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
  const progressToGold = Math.min((credits / 2000) * 100, 100);

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Shopkeeper Portal</h1>
        <p className="text-muted-foreground text-sm">Madurai Heritage Rewards for Local Traders</p>
      </header>

      {/* Heritage Credits Card */}
      <section>
        <Card className="m3-card bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-20 rotate-12" />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Heritage Credits</span>
            </div>
            <div>
              <h3 className="text-4xl font-bold">{credits.toLocaleString()}</h3>
              <p className="text-sm opacity-80 mt-1">Next Tier: Gold Heritage Member</p>
            </div>
            <Progress value={progressToGold} className="h-2 bg-white/20" />
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>Member</span>
              <span>Gold (2,000)</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Key Benefits Grid */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="m3-card p-4 space-y-3 bg-card hover:bg-muted transition-colors border-none shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Licensing</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Up to 15% discount on municipal fees</p>
          </div>
        </Card>
        <Card className="m3-card p-4 space-y-3 bg-card hover:bg-muted transition-colors border-none shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Visibility</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">Priority placement in city tourism guides</p>
          </div>
        </Card>
      </section>

      {/* Current Establishment Cleanliness */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold font-headline">My Establishment</h3>
        <Card className="m3-card p-0 overflow-hidden border-none shadow-md">
          <div className="relative h-48 w-full">
            <Image 
              src="https://picsum.photos/seed/shop1/800/400" 
              alt="Shop Entrance" 
              fill 
              className="object-cover" 
              data-ai-hint="shop entrance"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500/90 backdrop-blur-md border-none text-white px-3 py-1">Verified Clean</Badge>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h4 className="font-bold">{profile?.displayName || "Local Establishment"}</h4>
              <p className="text-xs text-muted-foreground">Bibikulam Main Rd, Madurai</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full font-bold">Manage</Button>
          </div>
        </Card>
      </section>

      {/* How to earn more */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold font-headline">Earn Heritage Credits</h3>
        <div className="space-y-3">
          {[
            { title: "Daily Frontage Sweep", pts: "10 pts/day", icon: <Sparkles className="w-4 h-4" /> },
            { title: "Waste Segregation Setup", pts: "200 pts", icon: <Store className="w-4 h-4" /> },
            { title: "Public Dustbin Hosting", pts: "50 pts/week", icon: <Info className="w-4 h-4" /> }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-[24px] border border-border/40 hover:border-primary/40 transition-colors group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-[10px] text-primary font-bold uppercase">{item.pts}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}