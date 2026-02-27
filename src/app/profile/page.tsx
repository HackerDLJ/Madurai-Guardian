
"use client";

import { useUser, useFirestore, useDoc } from "@/firebase";
import { useMemoFirebase } from "@/firebase/provider";
import { doc } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Medal, Store, ArrowUpRight, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading } = useDoc(userRef);

  if (isLoading) return <div className="flex justify-center p-20">Loading profile...</div>;

  const points = profile?.points || 0;
  const level = profile?.level || 1;
  const nextLevelPoints = level * 500;
  const progress = (points % 500) / 5;

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col items-center gap-4 pt-6">
        <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl">
          <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
          <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold font-headline">{user?.displayName || "Madurai Guardian"}</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full mt-1">
            Level {level} Guardian
          </Badge>
        </div>
      </header>

      {/* Stats Summary */}
      <section className="grid grid-cols-2 gap-4">
        <Card className="m3-card bg-primary text-primary-foreground p-5 space-y-2">
          <Star className="w-6 h-6 opacity-80" />
          <div>
            <p className="text-xs font-bold uppercase opacity-80">Clean Points</p>
            <h3 className="text-3xl font-bold">{points}</h3>
          </div>
        </Card>
        <Card className="m3-card bg-secondary text-secondary-foreground p-5 space-y-2">
          <Trophy className="w-6 h-6 opacity-80" />
          <div>
            <p className="text-xs font-bold uppercase opacity-80">Ranking</p>
            <h3 className="text-3xl font-bold">#42</h3>
          </div>
        </Card>
      </section>

      {/* Progress to next level */}
      <section className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Next Milestone</h3>
          <span className="text-xs font-bold">{points}/{nextLevelPoints} XP</span>
        </div>
        <Progress value={progress} className="h-3 rounded-full bg-muted" />
      </section>

      {/* Shopkeeper Module Shortcut */}
      <section>
        <Link href="/shopkeeper">
          <Card className="m3-card bg-accent/10 border-2 border-accent/20 p-5 flex items-center justify-between group hover:bg-accent/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground shadow-sm">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Shopkeeper Portal</h4>
                <p className="text-xs text-muted-foreground">Manage Heritage Credits</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </Card>
        </Link>
      </section>

      {/* Badges Collection */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold font-headline px-1">Badges Earned</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pioneer", icon: <Medal className="w-6 h-6" />, color: "bg-blue-500" },
            { label: "Eco Hero", icon: <Star className="w-6 h-6" />, color: "bg-green-500" },
            { label: "Civic King", icon: <Trophy className="w-6 h-6" />, color: "bg-amber-500" }
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full ${badge.color} text-white flex items-center justify-center shadow-lg border-4 border-white`}>
                {badge.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Deeds */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-xl font-bold font-headline">Clean Deeds</h3>
        </div>
        <div className="space-y-3">
          {[
            { title: "Trash Reported", date: "Today", pts: "+50" },
            { title: "Source Segregation Verified", date: "Yesterday", pts: "+100" },
            { title: "Sunday Cleanup Drive", date: "Oct 20", pts: "+250" }
          ].map((deed, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-card rounded-[24px] border border-border/40">
              <div>
                <h4 className="font-bold text-sm">{deed.title}</h4>
                <p className="text-[10px] text-muted-foreground uppercase">{deed.date}</p>
              </div>
              <span className="font-bold text-primary">{deed.pts}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
