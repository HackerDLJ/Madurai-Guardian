import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'madurai-temple');
  const awarenessImage = PlaceHolderImages.find(img => img.id === 'community-cleanup');

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome & Stats Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold font-headline text-foreground">Vanakkam, Madurai!</h2>
            <p className="text-muted-foreground">Keep our city clean and green today.</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-secondary font-semibold bg-secondary/10 flex gap-1">
            <TrendingUp className="w-3 h-3" />
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="material-card bg-primary/5 border-none shadow-none">
            <CardContent className="p-0 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Resolved Issues</p>
              <h3 className="text-2xl font-bold">1,284</h3>
            </CardContent>
          </Card>
          <Card className="material-card bg-secondary/5 border-none shadow-none">
            <CardContent className="p-0 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Active Citizens</p>
              <h3 className="text-2xl font-bold">42.5k</h3>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Action Card */}
      <section>
        <div className="relative h-56 w-full rounded-[40px] overflow-hidden google-shadow">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/madurai1/800/600"}
            alt="Madurai City"
            fill
            className="object-cover"
            data-ai-hint="Madurai temple"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <h3 className="text-white text-2xl font-bold font-headline">Report an Issue</h3>
            <p className="text-white/80 text-sm mb-4">Spotted trash or a leak? AI will help you report it instantly.</p>
            <Link href="/report/new">
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-bold">
                Start Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Feed Snippet */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
          <Link href="/status" className="text-primary text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {[
            { id: 1, type: "Trash Overflow", loc: "Meenakshi Bazaar", status: "In Progress", color: "text-blue-500 bg-blue-50" },
            { id: 2, type: "Illegal Dumping", loc: "Goripalayam", status: "Acknowledged", color: "text-amber-500 bg-amber-50" },
            { id: 3, type: "Water Logging", loc: "Simmakkal", status: "Pending", color: "text-slate-500 bg-slate-50" }
          ].map((item) => (
            <Card key={item.id} className="material-card border-none hover:google-shadow-hover transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.type}</h4>
                  <p className="text-xs text-muted-foreground">{item.loc}</p>
                </div>
                <Badge variant="outline" className={cn("rounded-full border-none px-3 py-1", item.color)}>
                  {item.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Awareness Hub Snippet */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold font-headline">City Awareness Hub</h3>
        <Card className="material-card overflow-hidden p-0 border-none">
          <div className="flex flex-col sm:flex-row h-full">
            <div className="relative w-full sm:w-1/3 h-40 sm:h-auto">
              <Image
                src={awarenessImage?.imageUrl || "https://picsum.photos/seed/cleanup2/800/600"}
                alt="Awareness"
                fill
                className="object-cover"
                data-ai-hint="community cleaning"
              />
            </div>
            <div className="p-6 flex-1 space-y-2">
              <h4 className="font-bold text-lg">Waste Segregation Guide</h4>
              <p className="text-sm text-muted-foreground">Learn how to separate dry and wet waste for a cleaner Madurai.</p>
              <Button variant="link" className="p-0 text-secondary h-auto font-bold flex gap-2 items-center">
                Read More <TrendingUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
