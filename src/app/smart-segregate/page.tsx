"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
  XCircle,
  Monitor,
  Smartphone,
  Layers,
  Info,
  Send,
  History,
  Clock,
  FlaskConical,
  Leaf,
  Upload
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { analyzeWaste, type SmartWasteOutput } from "@/ai/flows/smart-waste-analysis";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Image from "next/image";
import { RelativeTime } from "@/components/relative-time";

const MADURAI_CENTER = { lat: 9.9252, lng: 78.1198 };

const fractions = [
  { id: 'Dry', label: 'Dry Waste', color: 'bg-blue-500', borderColor: 'border-blue-500', icon: <Boxes className="w-5 h-5" /> },
  { id: 'Wet', label: 'Wet/Organic', color: 'bg-green-500', borderColor: 'border-green-500', icon: <Zap className="w-5 h-5" /> },
  { id: 'E-waste', label: 'Electronic', color: 'bg-purple-500', borderColor: 'border-purple-500', icon: <Cpu className="w-5 h-5" /> }
];

export default function SmartSegregatePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [detectedItem, setDetectedItem] = useState<SmartWasteOutput | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [activeBin, setActiveBin] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({ type: "Detecting...", model: "M-SS-v2.4-RPi4" });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const historyQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "incidentReports"),
      where("userId", "==", user.uid),
      orderBy("submittedAt", "desc"),
      limit(20)
    );
  }, [db, user?.uid]);

  const { data: history, isLoading: isHistoryLoading } = useCollection(historyQuery);

  useEffect(() => {
    const initPage = async () => {
      const ua = navigator.userAgent;
      let type = "Desktop Client";
      if (/tablet|ipad|playbook|silk/i.test(ua)) type = "Tablet Node";
      else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) type = "Mobile Edge";
      
      setDeviceInfo(prev => ({ ...prev, type }));

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    initPage();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setDetectedItem(null);
    setLastImage(null);
    setActiveBin(null);
    setProcessingProgress(20);

    try {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUri = canvasRef.current.toDataURL('image/jpeg');
        await processImage(imageDataUri);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Industrial AI core failed to stabilize. Please try again." });
      setIsScanning(false);
      setProcessingProgress(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setDetectedItem(null);
    setLastImage(null);
    setActiveBin(null);
    setProcessingProgress(10);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageDataUri = reader.result as string;
      await processImage(imageDataUri);
    };
    reader.onerror = () => {
      toast({ variant: "destructive", title: "Upload Error", description: "Failed to read the selected file." });
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageDataUri: string) => {
    setLastImage(imageDataUri);
    setProcessingProgress(50);
    try {
      const result = await analyzeWaste(imageDataUri);
      setProcessingProgress(100);
      setDetectedItem(result);
      
      if (result.isWaste) {
        const matchedBin = fractions.find(f => f.id === result.wasteType);
        setActiveBin(matchedBin ? matchedBin.id : (result.wasteType.includes('Recyclable') ? 'Dry' : 'Wet'));
      }

      toast({
        title: result.isWaste ? "Item Identified" : "Analysis Complete",
        description: result.isWaste 
          ? `${result.itemName} detected with ${Math.round(result.confidence * 100)}% confidence.` 
          : "No waste item detected in primary focus.",
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "AI Core Unstable", description: "Neural inference failed. Check your connection." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReportToCorporation = async () => {
    if (!user || !db || !detectedItem || !lastImage) return;

    setIsReporting(true);
    const reportData = {
      userId: user.uid,
      description: `Industrial AI Report: ${detectedItem.itemName}. Material: ${detectedItem.materialAnalysis}. Impact: ${detectedItem.environmentalImpact}`,
      latitude: MADURAI_CENTER.lat + (Math.random() - 0.5) * 0.01,
      longitude: MADURAI_CENTER.lng + (Math.random() - 0.5) * 0.01,
      photoUrls: [lastImage],
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      isVerified: true,
      aiSuggestedCategory: detectedItem.wasteType,
      pointsAwarded: 50,
      serverTimestamp: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(db, "incidentReports"), reportData);
    toast({ title: "Report Syncing", description: "Industrial data and imagery being submitted to municipal authorities." });
    setIsReporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">SmartSegregate™ Industrial</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <RotateCw className="w-3 h-3 animate-spin text-secondary" /> 
              Gemini Vision Ultra Core Active • {deviceInfo.model}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <Card className="rounded-[40px] overflow-hidden border-none bg-black aspect-video relative shadow-2xl">
            {lastImage && !isScanning ? (
              <div className="absolute inset-0 z-20 bg-black">
                <Image src={lastImage} alt="Captured waste" fill className="object-contain" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full hover:bg-black/70"
                  onClick={() => { setLastImage(null); setDetectedItem(null); setActiveBin(null); }}
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover opacity-80" 
                autoPlay 
                muted 
                playsInline 
              />
            )}
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

            {hasCameraPermission === false && !lastImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10 backdrop-blur-sm p-6">
                <Alert variant="destructive" className="max-w-md bg-white/90 shadow-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>Enable camera access or upload a photo manually.</AlertDescription>
                </Alert>
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <Button 
                size="lg" 
                className="rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl gap-3"
                onClick={handleScan}
                disabled={isScanning || (hasCameraPermission === false && !lastImage)}
              >
                {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                {isScanning ? "Stabilizing AI Core..." : "Identify Waste"}
              </Button>
              
              <Button 
                size="lg" 
                variant="secondary"
                className="rounded-full h-14 px-8 bg-white hover:bg-muted text-primary font-bold text-lg shadow-xl gap-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
              >
                <Upload className="w-6 h-6" />
                Upload Photo
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="m3-card p-6 flex items-center gap-4 bg-primary/5 border-none shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                {deviceInfo.type.includes("Mobile") ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Platform Node</p>
                <p className="font-bold text-sm">{deviceInfo.type}</p>
              </div>
            </Card>
            <Card className="m3-card p-6 flex items-center gap-4 bg-secondary/5 border-none shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Core Model</p>
                <p className="font-bold text-sm">{deviceInfo.model}</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <Card className="m3-card border-none shadow-lg space-y-6 p-8 bg-card">
            <h3 className="text-xl font-bold font-headline flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" /> Neural Insights
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-muted/30 border border-muted-foreground/10 min-h-[120px] flex flex-col justify-center text-center">
                {detectedItem ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-xl font-bold">{detectedItem.itemName}</p>
                       <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                        {Math.round(detectedItem.confidence * 100)}% Conf
                      </Badge>
                    </div>

                    <div className="text-xs text-left space-y-4">
                      <div className="space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-primary uppercase tracking-widest text-[10px]">
                          <Info className="w-3.5 h-3.5" /> Technical Spec
                        </p>
                        <p className="text-muted-foreground leading-relaxed italic">{detectedItem.description}</p>
                      </div>

                      <div className="p-3 bg-white/50 rounded-2xl border border-muted-foreground/5 space-y-2">
                        <div className="space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-secondary uppercase tracking-widest text-[10px]">
                            <FlaskConical className="w-3.5 h-3.5" /> Material Analysis
                          </p>
                          <p className="text-muted-foreground">{detectedItem.materialAnalysis}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-secondary uppercase tracking-widest text-[10px]">
                            <Leaf className="w-3.5 h-3.5" /> Civic Impact
                          </p>
                          <p className="text-muted-foreground">{detectedItem.environmentalImpact}</p>
                        </div>
                      </div>
                      
                      {detectedItem.isWaste && (
                        <div className="pt-2 border-t border-muted/50 space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-secondary uppercase tracking-widest text-[10px]">
                            <Trash2 className="w-3.5 h-3.5" /> Disposal Protocol
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{detectedItem.disposalMethod}</p>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleReportToCorporation}
                      disabled={isReporting}
                      className="w-full mt-4 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold gap-2 py-6 shadow-md"
                    >
                      {isReporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      {isReporting ? "Syncing..." : "Sync with Corporation"}
                    </Button>
                  </div>
                ) : isScanning ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Neural Core Stabilizing...</p>
                    <Progress value={processingProgress} className="h-1.5" />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">Focus lens on urban sample or upload a photo</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-muted-foreground px-1">Active Compartments</p>
                <div className="space-y-2">
                  {fractions.map((f) => (
                    <div 
                      key={f.id} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl transition-all border-2",
                        activeBin === f.id 
                          ? cn("bg-white shadow-md scale-[1.02]", f.borderColor) 
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
                        <Badge className="bg-secondary text-white border-none animate-pulse">ACTIVE</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      <section className="space-y-6 pt-12">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                <History className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-bold font-headline">Neural Log History</h3>
          </div>
          <Badge variant="outline" className="rounded-full px-4 border-muted text-muted-foreground font-bold">
            {history?.length || 0} Samples
          </Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full h-14 bg-muted/50 rounded-[28px] p-1 mb-8 shadow-inner overflow-x-auto no-scrollbar">
            <TabsTrigger value="all" className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">All Logs</TabsTrigger>
            {fractions.map(f => (
              <TabsTrigger key={f.id} value={f.id} className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {f.label.split(' ')[0]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="Other" className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Others</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history?.map((scan) => (
                  <ScanHistoryCard key={scan.id} scan={scan} />
                ))}
                {!history?.length && !isHistoryLoading && <EmptyHistoryState />}
             </div>
          </TabsContent>

          {['Dry', 'Wet', 'E-waste', 'Other'].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history?.filter(s => (category === 'Other' ? !['Dry', 'Wet', 'E-waste'].includes(s.aiSuggestedCategory) : s.aiSuggestedCategory === category)).map((scan) => (
                    <ScanHistoryCard key={scan.id} scan={scan} />
                  ))}
                  {!history?.filter(s => (category === 'Other' ? !['Dry', 'Wet', 'E-waste'].includes(s.aiSuggestedCategory) : s.aiSuggestedCategory === category)).length && <EmptyHistoryState />}
               </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
      
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function ScanHistoryCard({ scan }: { scan: any }) {
  const categoryColor = fractions.find(f => f.id === scan.aiSuggestedCategory)?.color || "bg-muted";
  
  // Robust parsing of the AI-augmented description
  let itemName = "Analyzed Sample";
  if (scan.description?.includes("Industrial AI Report:")) {
    const parts = scan.description.split("Industrial AI Report:");
    if (parts[1]) {
      itemName = parts[1].split(".")[0]?.trim() || itemName;
    }
  } else if (scan.aiSuggestedCategory) {
    itemName = `${scan.aiSuggestedCategory} Discovery`;
  }

  return (
    <Card className="m3-card overflow-hidden p-0 border-none group hover:shadow-xl transition-all bg-card">
      <div className="relative h-48 w-full">
        <Image 
          src={scan.photoUrls?.[0] || "https://picsum.photos/seed/scan/400/300"} 
          alt="Scan evidence" 
          fill 
          className="object-cover transition-transform group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4">
          <Badge className={cn("text-white border-none px-3 py-1 font-bold rounded-lg shadow-lg", categoryColor)}>
            {scan.aiSuggestedCategory || "Verified"}
          </Badge>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
           <h4 className="font-bold text-base leading-tight truncate flex-1 text-foreground">
             {itemName}
           </h4>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
           <Clock className="w-3 h-3" />
           {scan.submittedAt ? <RelativeTime date={scan.submittedAt} /> : "Recently"}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
          {scan.description || "Historical data log from SmartSegregate industrial core."}
        </p>
      </div>
    </Card>
  );
}

function EmptyHistoryState() {
  return (
    <div className="col-span-full py-16 text-center space-y-4">
      <div className="w-20 h-20 rounded-[32px] bg-muted flex items-center justify-center mx-auto text-muted-foreground/30 shadow-inner">
        <History className="w-10 h-10" />
      </div>
      <div>
        <p className="font-bold text-lg">No data available</p>
        <p className="text-sm text-muted-foreground">Initiate a neural scan to build your civic history log.</p>
      </div>
    </div>
  );
}
