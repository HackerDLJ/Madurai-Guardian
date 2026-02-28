"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Waves, 
  Wind, 
  Monitor, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  TrendingUp,
  History,
  Activity,
  Droplets
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';

const gasData = [
  { time: '10am', nh3: 12, h2s: 5 },
  { time: '11am', nh3: 15, h2s: 7 },
  { time: '12pm', nh3: 18, h2s: 10 },
  { time: '01pm', nh3: 25, h2s: 15 },
  { time: '02pm', nh3: 30, h2s: 22 },
  { time: '03pm', nh3: 22, h2s: 12 },
];

const educationalTips = [
  "Did you know? Segregated organic waste can produce clean energy for our street lights!",
  "Thank you for recycling this plastic bottle! You just saved 0.5 liters of water.",
  "Madurai is our home. Every piece of trash in the bin is a step towards a cleaner future.",
  "Small act, big impact: Source segregation reduces landfill waste by 60%."
];

export default function HygieneControlPage() {
  const [fillLevel, setFillLevel] = useState(65);
  const [activeTip, setActiveTip] = useState(0);
  const [gasStatus, setGasStatus] = useState<'Normal' | 'Warning'>('Normal');

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % educationalTips.length);
    }, 5000);

    const levelInterval = setInterval(() => {
      setFillLevel(prev => {
        if (prev >= 95) return 20;
        return prev + 1;
      });
    }, 3000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(levelInterval);
    };
  }, []);

  useEffect(() => {
    if (fillLevel >= 80) {
      setGasStatus('Warning');
    } else {
      setGasStatus('Normal');
    }
  }, [fillLevel]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">Hygiene & Volume Control</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Sensor Mesh: Ward 42 Node-B1
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fill Level Monitoring */}
        <section className="space-y-6">
          <Card className="m3-card border-none shadow-lg p-8 space-y-8">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                <Waves className="w-5 h-5 text-primary" /> Fill Level
              </h3>
              {fillLevel >= 80 && (
                <Badge variant="destructive" className="animate-bounce">Dispatch Alert</Badge>
              )}
            </div>

            <div className="relative h-64 flex items-center justify-center">
              <div className="w-40 h-full border-4 border-muted rounded-3xl relative overflow-hidden bg-muted/20">
                <div 
                  className={cn(
                    "absolute bottom-0 w-full transition-all duration-1000 ease-in-out",
                    fillLevel >= 80 ? "bg-destructive/80" : "bg-primary/80"
                  )}
                  style={{ height: `${fillLevel}%` }}
                >
                  <div className="w-full h-4 bg-white/20 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-foreground mix-blend-difference">{fillLevel}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                <span>Capacity Status</span>
                <span>{fillLevel >= 80 ? "High Density" : "Optimized"}</span>
              </div>
              <Progress value={fillLevel} className={cn("h-2", fillLevel >= 80 ? "bg-destructive/20" : "bg-primary/20")} />
              <p className="text-[10px] text-muted-foreground italic">
                *Ultrasonic sensor calibrated at 1.2m range.
              </p>
            </div>
          </Card>
        </section>

        {/* Hygiene Analysis */}
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="m3-card border-none shadow-md p-6 bg-accent/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Ammonia (NH3)</h4>
                  <p className="text-xs text-muted-foreground">Organic Putrefaction</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">22.4</span>
                <span className="text-sm font-bold text-muted-foreground mb-1">ppm</span>
                <Badge variant="secondary" className="ml-auto bg-green-500/10 text-green-600 border-none">Safe</Badge>
              </div>
            </Card>

            <Card className="m3-card border-none shadow-md p-6 bg-destructive/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Hydrogen Sulfide</h4>
                  <p className="text-xs text-muted-foreground">Anaerobic Analysis</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">8.1</span>
                <span className="text-sm font-bold text-muted-foreground mb-1">ppm</span>
                <Badge variant="secondary" className="ml-auto bg-amber-500/10 text-amber-600 border-none">Active</Badge>
              </div>
            </Card>
          </div>

          <Card className="m3-card border-none shadow-lg p-6">
            <h3 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> 6-Hour Trend Analysis
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gasData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="nh3" radius={[4, 4, 0, 0]}>
                    {gasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.nh3 > 25 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Interactive Education (Billboard) */}
        <section className="lg:col-span-3">
          <Card className="rounded-[40px] bg-[#1E1B4B] text-white p-12 relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col justify-center border-none">
            <Monitor className="absolute -top-10 -right-10 w-64 h-64 text-white/5" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                  <Info className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Interactive Smart Screen</h3>
                  <p className="text-white/60 text-xs">Simulating 50-inch Outdoor Display Feedback</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {educationalTips[activeTip]}
                </h2>
                <div className="flex items-center gap-6">
                  <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 font-bold px-8 h-12">
                    Learn More
                  </Button>
                  <div className="flex gap-2">
                    {educationalTips.map((_, i) => (
                      <div key={i} className={cn("w-2 h-2 rounded-full transition-all", activeTip === i ? "bg-accent w-8" : "bg-white/20")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 right-10 flex items-center gap-4 text-white/40">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Civic Engagement Node v2.4</span>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
