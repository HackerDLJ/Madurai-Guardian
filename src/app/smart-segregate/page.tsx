"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Scan, 
  Boxes, 
  RotateCw, 
  Zap, 
  AlertCircle, 
  CheckCircle2,
  Camera,
  Loader2,
  Trash2,
  XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { analyzeWaste, type SmartWasteOutput } from "@/ai/flows/smart-waste-analysis";

const fractions = [
  { id: 'Dry', label: 'Dry Waste', color: 'bg-blue-500', icon: <Boxes className="w-5 h-5" /> },
  { id: 'Wet', label: 'Wet/Organic', color: 'bg-green-500', icon: <Zap className="w-5 h-5" /> },
  { id: 'E-waste', label: 'Electronic', color: 'bg-purple-500', icon: <Cpu className="w-5 h-5" /> }
];

export default function SmartSegregatePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItem, setDetectedItem] = useState<SmartWasteOutput | null>(null);
  const [activeBin, setActiveBin] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setDetectedItem(null);
    setActiveBin(null);
    setProcessingProgress(20);

    try {
      // Capture frame
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUri = canvasRef.current.toDataURL('image/jpeg');
        
        setProcessingProgress(50);
        
        const result = await analyzeWaste(imageDataUri);
        
        setProcessingProgress(100);
        setDetectedItem(result);
        
        // Map AI result to our UI bins
        if (result.isWaste) {
          const matchedBin = fractions.find(f => f.id === result.wasteType);
          if (matchedBin) {
            setActiveBin(matchedBin.id);
          } else {
            // Fallback for general dry/wet if specific mismatch
            setActiveBin(result.wasteType.includes('Recyclable') ? 'Dry' : 'Wet');
          }
        }

        toast({
          title: result.isWaste ? "Item Identified" : "No Waste Detected",
          description: result.isWaste 
            ? `${result.itemName} detected as ${result.wasteType} waste.` 
            : "The object identified is not classified as waste.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Scanning Failed",
        description: "AI was unable to process the image. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">SmartSegregate™ AI</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <RotateCw className="w-3 h-3 animate-spin text-secondary" /> 
              Gemini-Flash Vision Core Active (1M+ Samples Trained)
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <Card className="rounded-[40px] overflow-hidden border-none bg-black aspect-video relative shadow-2xl">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover opacity-80" 
              autoPlay 
              muted 
              playsInline 
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
              <div className="w-full h-full border-2 border-white/10 rounded-[20px] relative">
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-primary shadow-[0_0_15px_rgba(66,133,244,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                )}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>

            {!(hasCameraPermission) && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10 backdrop-blur-sm">
                <div className="text-center space-y-4 p-8">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-white font-medium">Camera access required for AI scanning</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <Button 
                size="lg" 
                className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl gap-3"
                onClick={handleScan}
                disabled={isScanning || !hasCameraPermission}
              >
                {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                {isScanning ? "AI Processing..." : "Identify Waste"}
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="m3-card p-6 flex items-center gap-4 bg-primary/5 border-none">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Neural Engine</p>
                <p className="font-bold text-sm">Gemini Multimodal Vision</p>
              </div>
            </Card>
            <Card className="m3-card p-6 flex items-center gap-4 bg-secondary/5 border-none">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary">
                <RotateCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Bin Status</p>
                <p className="font-bold text-sm">{activeBin ? `Opening ${activeBin} Bin` : 'Locked / Ready'}</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <Card className="m3-card border-none shadow-lg space-y-6 p-8">
            <h3 className="text-xl font-bold font-headline flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" /> AI Insights
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-muted/30 border border-muted-foreground/10 min-h-[120px] flex flex-col justify-center text-center">
                {detectedItem ? (
                  <div className="space-y-3">
                    {detectedItem.isWaste ? (
                      <CheckCircle2 className="w-8 h-8 text-secondary mx-auto" />
                    ) : (
                      <XCircle className="w-8 h-8 text-destructive mx-auto" />
                    )}
                    <div>
                      <p className="text-lg font-bold">{detectedItem.itemName}</p>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
                        {Math.round(detectedItem.confidence * 100)}% Match
                      </Badge>
                    </div>
                    {detectedItem.isWaste && (
                      <div className="text-xs text-left mt-4 p-3 bg-white/50 rounded-xl border border-muted-foreground/5">
                        <p className="font-bold mb-1">Disposal Guide:</p>
                        <p className="text-muted-foreground leading-relaxed">{detectedItem.disposalMethod}</p>
                      </div>
                    )}
                  </div>
                ) : isScanning ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium animate-pulse">Running Neural Inference...</p>
                    <Progress value={processingProgress} className="h-1.5" />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">Point camera at item and tap "Identify Waste"</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-muted-foreground px-1">Bin Compartments</p>
                <div className="space-y-2">
                  {fractions.map((f) => (
                    <div 
                      key={f.id} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl transition-all border-2",
                        activeBin === f.id 
                          ? `border-${f.id === 'Dry' ? 'primary' : f.id === 'Wet' ? 'secondary' : 'purple-500'} bg-white shadow-md scale-[1.02]` 
                          : "border-transparent bg-muted/20 opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", f.color)}>
                          {f.icon}
                        </div>
                        <span className="font-bold text-sm">{f.label}</span>
                      </div>
                      {activeBin === f.id && (
                        <Badge className="bg-secondary text-white border-none animate-pulse">OPEN</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="m3-card bg-[#1E1B4B] text-white p-8 border-none overflow-hidden relative">
            <Trash2 className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 -rotate-12" />
            <div className="relative z-10 space-y-4">
              <h4 className="font-bold text-lg">Did you know?</h4>
              <p className="text-sm text-white/70">Properly segregated waste in Madurai is transformed into green energy and organic compost for local parks.</p>
              <Button variant="outline" className="w-full rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold" asChild>
                <a href="/credits">View Rewards</a>
              </Button>
            </div>
          </Card>
        </section>
      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
