"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    title: "New Report Nearby",
    body: "A new waste issue was reported 200m from your current location in Bibikulam.",
    time: "5m ago",
    type: "location",
    icon: <MapPin className="w-5 h-5" />,
    color: "bg-primary"
  },
  {
    id: 2,
    title: "Report Resolved",
    body: "Good news! Your report #REP-4831 has been marked as resolved by the municipal team.",
    time: "2h ago",
    type: "status",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Civic Duty Alert",
    body: "Heavy rains expected. Please ensure trash bins are secured to prevent overflow.",
    time: "5h ago",
    type: "alert",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "bg-amber-500"
  }
];

export default function Notifications() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold font-headline">Alerts</h1>
      </header>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={cn("material-card border-none hover:google-shadow-hover transition-all p-5 flex gap-4", notif.color)}>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0", notif.color)}>
              {notif.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-base">{notif.title}</h4>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{notif.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {notif.body}
              </p>
              {notif.type === 'location' && (
                <Button variant="link" className="p-0 text-primary h-auto font-bold text-sm mt-1">
                  View on Map
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-10 text-center">
        <div className="w-20 h-20 rounded-[30px] bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
          <Bell className="w-10 h-10 opacity-20" />
        </div>
        <p className="text-muted-foreground text-sm italic">You're all caught up for now.</p>
      </div>
    </div>
  );
}
