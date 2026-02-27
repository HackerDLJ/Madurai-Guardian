
"use client";

import { useState } from "react";
import { Camera, MapPin, Loader2, Sparkles, Send, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { augmentReport, type ReportAugmentationOutput } from "@/ai/flows/ai-powered-report-augmentation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function NewReport() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [augmenting, setAugmenting] = useState(false);
  const [aiResult, setAiResult] = useState<ReportAugmentationOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAugment = async () => {
    if (!image) return;
    setAugmenting(true);
    try {
      const result = await augmentReport({ imageDataUri: image, description });
      setAiResult(result);
      setDescription(result.enrichedDescription);
      if (result.suggestedCategories.length > 0) {
        setSelectedCategory(result.suggestedCategories[0]);
      }
      toast({ title: "AI Augmentation Success", description: "Report details enriched by AI." });
    } catch (error) {
      toast({ title: "AI Error", description: "Failed to augment report." });
    } finally {
      setAugmenting(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Report Submitted", description: "Your report has been received by the municipality." });
      router.push("/status");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">New Report</h1>
      </header>

      <div className="space-y-6">
        {/* Photo Upload */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Evidence Photo</label>
          <div className="relative w-full aspect-square rounded-[40px] border-4 border-dashed border-muted flex flex-col items-center justify-center overflow-hidden bg-card hover:border-primary/50 transition-colors group">
            {image ? (
              <>
                <Image src={image} alt="Report evidence" fill className="object-cover" />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => { setImage(null); setAiResult(null); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-[30px] bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <Camera className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-bold text-lg">Snap the Issue</p>
                  <p className="text-sm text-muted-foreground">Take a clear photo of the area</p>
                </div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload} 
                />
                <Button className="rounded-2xl pointer-events-none">Open Camera</Button>
              </div>
            )}
          </div>
        </section>

        {/* AI Augmentation Button */}
        {image && !aiResult && (
          <Button 
            onClick={handleAugment} 
            disabled={augmenting}
            className="w-full h-14 rounded-3xl bg-secondary hover:bg-secondary/90 text-white font-bold text-lg google-shadow flex gap-2"
          >
            {augmenting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                AI Smart Enlarge
              </>
            )}
          </Button>
        )}

        {/* Category Selection */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Issue Category</label>
          <div className="flex flex-wrap gap-2">
            {(aiResult?.suggestedCategories || ["Trash Overflow", "Illegal Dumping", "Street Sweeping", "Water Logging", "Infrastructure", "Other"]).map((cat) => (
              <Badge 
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={cn(
                  "px-4 py-2 rounded-2xl cursor-pointer text-sm font-medium transition-all",
                  selectedCategory === cat ? "google-shadow bg-primary text-white border-primary" : "hover:bg-muted"
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} {selectedCategory === cat && <Check className="w-3 h-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Description</label>
          <Textarea 
            placeholder="Tell us what's wrong..." 
            className="rounded-[28px] p-6 min-h-[150px] bg-card border-none google-shadow focus-visible:ring-primary text-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Location (Mock) */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Location</label>
          <Card className="material-card border-none bg-primary/5 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Automated Location</p>
              <p className="text-sm text-muted-foreground">Meenakshi Amman Temple St, Madurai</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold">Edit</Button>
          </Card>
        </section>

        {/* Submit */}
        <div className="pt-6">
          <Button 
            className="w-full h-16 rounded-[32px] bg-primary hover:bg-primary/90 text-white font-bold text-xl google-shadow flex gap-3"
            onClick={handleSubmit}
            disabled={loading || !image || !selectedCategory}
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
