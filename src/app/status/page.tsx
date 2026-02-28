"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Package, ArrowRight, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { RelativeTime } from "@/components/relative-time";
import { cn } from "@/lib/utils";

export default function StatusTracking() {
  const { user } = useUser();
  const db = useFirestore();

  const reportsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "incidentReports"),
      where("userId", "==", user.uid),
      orderBy("submittedAt", "desc")
    );
  }, [db, user?.uid]);

  const { data: reports, isLoading } = useCollection(reportsQuery);

  const getProgress = (status: string) => {
    switch (status) {
      case 'Resolved': return 100;
      case 'In Progress': return 65;
      case 'Acknowledged': return 30;
      default: return 10;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold font-headline">My Reports</h1>
        <p className="text-muted-foreground">Track the progress of your contributions.</p>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full h-14 bg-card rounded-[28px] p-1 shadow-sm">
          <TabsTrigger value="active" className="flex-1 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Active</TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {reports?.filter(r => r.status !== "Resolved").map((report) => (
            <Card key={report.id} className="m3-card overflow-hidden p-0 group border-none shadow-sm">
              <div className="flex h-32">
                <div className="relative w-32 bg-muted">
                  <Image 
                    src={report.photoUrls?.[0] || "https://picsum.photos/seed/report/100/100"} 
                    alt={report.description} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[120px]">
                      <h3 className="font-bold text-sm leading-tight truncate">
                        {report.aiSuggestedCategory || "Urban Issue"}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-1">
                        <MapPin className="w-3 h-3" />
                        Madurai
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5">
                      {report.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase">
                      <span>Progress</span>
                      <span>{getProgress(report.status)}%</span>
                    </div>
                    <Progress value={getProgress(report.status)} className="h-1 rounded-full" />
                  </div>
                </div>
                <div className="w-10 bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </Card>
          ))}
          {reports?.filter(r => r.status !== "Resolved").length === 0 && (
            <p className="text-center py-10 text-muted-foreground italic">No active reports.</p>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {reports?.filter(r => r.status === "Resolved").map((report) => (
             <Card key={report.id} className="m3-card overflow-hidden p-0 opacity-90 group border-none shadow-sm">
              <div className="flex h-32">
                <div className="relative w-32 bg-muted grayscale">
                  <Image 
                    src={report.photoUrls?.[0] || "https://picsum.photos/seed/resolved/100/100"} 
                    alt={report.description} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm leading-tight">
                        {report.aiSuggestedCategory || "Resolved Issue"}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Resolved {report.submittedAt ? <RelativeTime date={report.submittedAt} /> : ""}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-green-500/10 text-green-700 rounded-xl px-3 py-1.5 text-[9px] font-bold uppercase flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Area clean & verified
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {reports?.filter(r => r.status === "Resolved").length === 0 && (
            <p className="text-center py-10 text-muted-foreground italic">No resolved reports yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
