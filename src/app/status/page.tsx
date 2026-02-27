
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Package, ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";

const reports = [
  {
    id: "REP-4829",
    type: "Trash Overflow",
    date: "Oct 24, 2023",
    status: "In Progress",
    location: "Sathyamoorthy Rd",
    progress: 65,
    icon: <Package className="w-5 h-5" />,
    color: "bg-primary",
    image: "https://picsum.photos/seed/trash1/100/100"
  },
  {
    id: "REP-4830",
    type: "Illegal Dumping",
    date: "Oct 23, 2023",
    status: "Acknowledged",
    location: "Anna Nagar",
    progress: 25,
    icon: <Clock className="w-5 h-5" />,
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/trash2/100/100"
  },
  {
    id: "REP-4831",
    type: "Street Sweeping",
    date: "Oct 21, 2023",
    status: "Resolved",
    location: "Teppakulam",
    progress: 100,
    icon: <CheckCircle className="w-5 h-5" />,
    color: "bg-green-500",
    image: "https://picsum.photos/seed/clean1/100/100"
  }
];

export default function StatusTracking() {
  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold font-headline">My Reports</h1>
        <p className="text-muted-foreground">Track the progress of your contributions.</p>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full h-14 bg-card rounded-[28px] p-1 google-shadow">
          <TabsTrigger value="active" className="flex-1 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Active</TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {reports.filter(r => r.status !== "Resolved").map((report) => (
            <Card key={report.id} className="material-card overflow-hidden p-0 group">
              <div className="flex h-32">
                <div className="relative w-32 bg-muted">
                  <Image src={report.image} alt={report.type} fill className="object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{report.type}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px] font-bold uppercase tracking-wider">{report.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Status</span>
                      <span>{report.progress}%</span>
                    </div>
                    <Progress value={report.progress} className="h-1.5" />
                  </div>
                </div>
                <div className="w-12 bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {reports.filter(r => r.status === "Resolved").map((report) => (
             <Card key={report.id} className="material-card overflow-hidden p-0 opacity-80 group">
              <div className="flex h-32">
                <div className="relative w-32 bg-muted grayscale">
                  <Image src={report.image} alt={report.type} fill className="object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{report.type}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Completed on {report.date}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-green-500/10 text-green-700 rounded-xl px-3 py-2 text-[10px] font-bold uppercase flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Area has been cleaned
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
