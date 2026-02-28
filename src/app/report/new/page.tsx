
"use client";

import { useState } from "react";
import { Camera, MapPin, Loader2, Sparkles, Send, X, Check, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { augmentReport, type ReportAugmentationOutput } from "@/ai/flows/ai-powered-report-augmentation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewReport() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [augmenting, setAugmenting] = useState(false);
  const [aiResult, setAiResult] = useState<ReportAugmentationOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();

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
      toast({ title: "AI Analysis Complete", description: "Waste fractions identified and description enriched." });
    } catch (error) {
      toast({ title: "AI Error", description: "Failed to analyze report." });
    } finally {
      setAugmenting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !image || !selectedCategory || !db) return;
    setLoading(true);
    
    try {
      const reportData = {
        userId: user.uid,
        description,
        latitude: MADURAI_CENTER.lat + (Math.random() - 0.5) * 0.02, // Mock GPS Variation
        longitude: MADURAI_CENTER.lng + (Math.random() - 0.5) * 0.02,
        photoUrls: [image], 
        submittedAt: new Date().toISOString(),
        status: "Submitted",
        isVerified: aiResult?.isVerified ?? false,
        aiAugmentedDescription: aiResult?.enrichedDescription ?? "",
        aiSuggestedCategory: selectedCategory,
        processedByAiAt: aiResult ? new Date().toISOString() : null,
        detectedWastePlasticVolumeCubicMeters: aiResult?.wasteFractions.plastic ?? 0,
        detectedWastePaperVolumeCubicMeters: aiResult?.wasteFractions.paper ?? 0,
        detectedWasteOrganicVolumeCubicMeters: aiResult?.wasteFractions.organic ?? 0,
        detectedWasteMetalVolumeCubicMeters: aiResult?.wasteFractions.metal ?? 0,
        detectedWasteEwasteVolumeCubicMeters: aiResult?.wasteFractions.ewaste ?? 0,
        detectedWasteHazardousVolumeCubicMeters: aiResult?.wasteFractions.hazardous ?? 0,
        serverTimestamp: serverTimestamp(),
      };

      // Submit to global collection for the city map
      await addDoc(collection(db, "incidentReports"), reportData);
      
      toast({ title: "Report Submitted", description: "Your contribution has been added to the city map." });
      router.push("/status");
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed", description: "Could not save report." });
    } finally {
      setLoading(false);
    }
  };

  const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };

  return (
    <div className="space-y-6 pb-10">
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
            className="w-full h-14 rounded-3xl bg-secondary hover:bg-secondary/90 text-white font-bold text-lg shadow-sm flex gap-2"
          >
            {augmenting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                AI Smart Identification
              </>
            )}
          </Button>
        )}

        {/* AI Results: Waste Fractions */}
        {aiResult && (
          <Card className="m3-card bg-primary/5 border-none p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="w-5 h-5" />
              <h3 className="font-bold">AI Waste Classification</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(aiResult.wasteFractions).map(([key, value]) => (
                <div key={key} className="bg-white/50 rounded-2xl p-3 flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{key}</span>
                  <span className="text-sm font-bold">{value.toFixed(2)} m³</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-primary/10">
              <span className="text-xs font-bold text-muted-foreground">Verification Status</span>
              <Badge className={cn("rounded-full border-none", aiResult.isVerified ? "bg-green-500 text-white" : "bg-amber-500 text-white")}>
                {aiResult.isVerified ? "Verified" : "Check Needed"}
              </Badge>
            </div>
          </Card>
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
                  selectedCategory === cat ? "bg-primary text-white border-primary" : "hover:bg-muted"
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
            className="rounded-[28px] p-6 min-h-[150px] bg-card border-none shadow-sm focus-visible:ring-primary text-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Location (Mock) */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Location</label>
          <Card className="m3-card bg-primary/5 p-4 flex items-center gap-3">
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
            className="w-full h-16 rounded-[32px] bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-lg flex gap-3"
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
