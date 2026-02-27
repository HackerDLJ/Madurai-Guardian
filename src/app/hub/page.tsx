"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Play, BookOpen, Newspaper, Users, Heart } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const articles = [
  {
    id: 1,
    title: "Zero Waste Living in Madurai",
    category: "Guides",
    readTime: "5 min",
    image: "https://picsum.photos/seed/hub1/400/250"
  },
  {
    id: 2,
    title: "New Municipal Waste Pickup Schedule",
    category: "Announcement",
    readTime: "2 min",
    image: "https://picsum.photos/seed/hub2/400/250"
  },
  {
    id: 3,
    title: "The Impact of Plastic on Vaigai River",
    category: "Awareness",
    readTime: "8 min",
    image: "https://picsum.photos/seed/hub3/400/250"
  }
];

export default function AwarenessHub() {
  const volunteers = PlaceHolderImages.find(img => img.id === 'community-cleanup');

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold font-headline">Community Hub</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            className="w-full h-14 pl-12 pr-6 rounded-[28px] bg-card border-none google-shadow focus:ring-2 focus:ring-primary outline-none text-lg" 
            placeholder="Search guides & news..." 
          />
        </div>
      </header>

      {/* Featured Video / Hero Article */}
      <section>
        <Card className="material-card overflow-hidden p-0 border-none relative h-64 group">
          <Image 
            src={volunteers?.imageUrl || ""} 
            alt="Volunteers" 
            fill 
            className="object-cover transition-transform group-hover:scale-105 duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent flex flex-col justify-end p-8 text-white">
            <Badge className="w-fit mb-3 bg-white/20 text-white border-none backdrop-blur-md">Local Spotlight</Badge>
            <h3 className="text-2xl font-bold font-headline leading-tight">Civic Heroes: Sunday Cleanup Drive at Simmakkal</h3>
            <div className="flex items-center gap-4 mt-4">
              <Button size="sm" className="rounded-full bg-white text-secondary hover:bg-white/90 font-bold gap-2">
                <Play className="w-4 h-4 fill-current" /> Watch Video
              </Button>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Users className="w-4 h-4" /> 24 Volunteers
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-2 gap-4">
        {[
          { label: "Guides", icon: <BookOpen />, color: "bg-blue-500" },
          { label: "News", icon: <Newspaper />, color: "bg-secondary" },
          { label: "Community", icon: <Users />, color: "bg-orange-500" },
          { label: "Donate", icon: <Heart />, color: "bg-destructive" }
        ].map((item) => (
          <Button key={item.label} variant="outline" className="h-24 material-card bg-card border-none hover:bg-muted justify-start gap-4 p-4 rounded-[32px]">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", item.color)}>
              {item.icon}
            </div>
            <span className="font-bold">{item.label}</span>
          </Button>
        ))}
      </section>

      {/* Recent Articles List */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold font-headline">Must Reads</h3>
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="material-card p-4 border-none flex gap-4 hover:google-shadow-hover transition-all">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-2 py-0.5 text-[10px] uppercase font-bold">
                    {article.category}
                  </Badge>
                  <h4 className="font-bold text-base leading-snug mt-1">{article.title}</h4>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{article.readTime} Read</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
