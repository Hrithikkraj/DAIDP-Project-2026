import { useState, useRef } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UploadCloud, RefreshCw, AlertCircle, WifiOff, ImageOff, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { mockResult } from "@/lib/mockData";

type ErrorType = "too-large" | "bad-format" | "no-face" | "blurry" | "network" | null;
type ScanState = "idle" | "analyzing" | "done";

const STEPS = [
  "Uploading image...",
  "Processing facial data...",
  "Detecting acne markers...",
  "Generating personalized results...",
];

export default function SkinScan({ setUploadedImageUrl, setScanResult }: { setUploadedImageUrl: (url: string|null) => void, setScanResult: (res: any) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [imageCaptured, setImageCaptured] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDone, setStepDone] = useState<boolean[]>([false, false, false, false]);
  const { addToast } = useDermaToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const runAnalysis = () => {
    setScanState("analyzing");
    setCurrentStep(0);
    setStepDone([false, false, false, false]);

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        setStepDone(prev => {
          const n = [...prev];
          if (i > 0) n[i - 1] = true;
          return n;
        });
      }, i * 700);
    });

    setTimeout(() => {
      setStepDone([true, true, true, true]);
      setScanState("done");
      addToast("Analysis complete! Results are ready.", "success");
      setScanResult(mockResult);
      if(localImageUrl) setUploadedImageUrl(localImageUrl);
    }, STEPS.length * 700 + 400);
  };

  const triggerError = (type: ErrorType) => {
    setErrorType(type);
    setScanState("idle");
    setImageCaptured(false);
    if (type === "too-large") addToast("File too large. Maximum 10MB allowed.", "error");
    if (type === "bad-format") addToast("Unsupported format. Please use JPEG or PNG.", "error");
    if (type === "no-face") addToast("No face detected. Please try a clearer photo.", "error");
    if (type === "blurry") addToast("Image is too blurry. Please retake in better lighting.", "error");
  };

  const reset = () => {
    setImageCaptured(false);
    setLocalImageUrl(null);
    setScanState("idle");
    setErrorType(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalImageUrl(url);
      setImageCaptured(true);
    }
  };

  return (
    <AppLayout activeTab="scan">
      <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Scan Your Skin</h1>
          <p className="text-muted-foreground">Take a clear, makeup-free photo in good lighting for the most accurate analysis.</p>
        </div>

        {/* Error States */}
        {errorType === "too-large" && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 animate-in fade-in">
            <CardContent className="p-5 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden />
              <div className="flex-1">
                <p className="font-semibold text-red-800 dark:text-red-200">File too large</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Your file exceeds the 10MB limit. Please compress your image and try again.</p>
                <Button size="sm" variant="outline" className="mt-3 border-red-300 text-red-700 hover:bg-red-100 rounded-full" onClick={reset}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {errorType === "bad-format" && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 animate-in fade-in">
            <CardContent className="p-5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden />
              <div className="flex-1">
                <p className="font-semibold text-amber-800 dark:text-amber-200">Unsupported format</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Please upload a JPEG or PNG file. WEBP, HEIC, and BMP are not yet supported.</p>
                <Button size="sm" variant="outline" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 rounded-full" onClick={reset}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {errorType === "no-face" && (
          <Card className="border-slate-200 bg-slate-50 dark:bg-zinc-800/50 animate-in fade-in">
            <CardContent className="p-5 flex flex-col items-center text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-lg">No face detected</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Make sure your face is centered, well-lit, and free of obstructions like sunglasses or masks.</p>
              </div>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={reset}>
                <Camera className="w-4 h-4 mr-2" aria-hidden />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
        {errorType === "blurry" && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 animate-in fade-in">
            <CardContent className="p-5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden />
              <div className="flex-1">
                <p className="font-semibold text-amber-800 dark:text-amber-200">Image too blurry</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Ensure you are in a well-lit area and hold the camera steady. Avoid backlit environments.</p>
                <Button size="sm" variant="outline" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 rounded-full" onClick={reset}>Retake Photo</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {errorType === "network" && (
          <Card className="border-slate-200 bg-white dark:bg-zinc-900 animate-in fade-in">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <WifiOff className="w-10 h-10 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-semibold text-lg">Network Error</p>
                <p className="text-sm text-muted-foreground mt-1">Could not connect to the analysis server. Check your connection and retry.</p>
              </div>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { setErrorType(null); runAnalysis(); }}>
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main scan area (only show when no active error) */}
        {!errorType && (
          <>
            {!imageCaptured ? (
              <Card
                role="region"
                aria-label="Image upload area"
                className={cn("border-2 border-dashed transition-all duration-200 overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm",
                  isDragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  setIsDragging(false); 
                  if(e.dataTransfer.files?.[0]) {
                    const url = URL.createObjectURL(e.dataTransfer.files[0]);
                    setLocalImageUrl(url);
                    setImageCaptured(true); 
                  }
                }}
              >
                <CardContent className="p-12 flex flex-col items-center justify-center text-center min-h-[360px]">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner" aria-hidden>
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Take a photo or upload</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">Drag and drop your image here, or click to browse. JPEG, PNG up to 10MB.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
                      <Button className="rounded-full px-8 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} aria-label="Open camera">
                        <Camera className="w-4 h-4 mr-2" aria-hidden />
                        Open Camera
                      </Button>
                      <Button variant="outline" className="rounded-full px-8 bg-white dark:bg-zinc-800 w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} aria-label="Browse files">
                        <UploadCloud className="w-4 h-4 mr-2 text-muted-foreground" aria-hidden />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Analysis loading */}
                {scanState === "analyzing" && (
                  <Card className="border-slate-100 shadow-sm overflow-hidden bg-white dark:bg-zinc-900 animate-in fade-in">
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-8">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                          <RefreshCw className="w-10 h-10 text-primary animate-spin" aria-hidden />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-10" aria-hidden />
                      </div>
                      <div className="w-full max-w-xs space-y-3" role="status" aria-live="polite" aria-label="Analysis progress">
                        {STEPS.map((step, i) => (
                          <div key={i} className={cn("flex items-center gap-3 text-sm transition-all duration-300",
                            i < currentStep ? "text-muted-foreground" : i === currentStep ? "text-foreground font-medium" : "text-muted-foreground/40"
                          )}>
                            {stepDone[i] ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" aria-hidden />
                            ) : i === currentStep ? (
                              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" aria-hidden />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted shrink-0" aria-hidden />
                            )}
                            {step}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Image preview + analyze */}
                {scanState === "idle" && (
                  <Card className="border-slate-100 shadow-sm overflow-hidden bg-white dark:bg-zinc-900 animate-in zoom-in-95 duration-500">
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-zinc-800 w-full overflow-hidden">
                      <img src={localImageUrl || ""} alt="Captured scan preview" className="w-full h-full object-cover object-center" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden />
                          <span className="font-medium text-sm drop-shadow-md">Image quality: Excellent</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full" onClick={reset} aria-label="Retake photo">Retake</Button>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-white dark:bg-zinc-900">
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3 mb-6" role="alert">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          <p className="font-medium mb-1">Make sure you are makeup-free</p>
                          <p className="opacity-80">Makeup can obscure key skin markers. For best results, cleanse your face before scanning.</p>
                        </div>
                      </div>
                      <Button className="w-full rounded-full h-14 text-base font-semibold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground group" onClick={runAnalysis} aria-label="Start skin analysis">
                        Analyze My Skin
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Done state */}
                {scanState === "done" && (
                  <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 animate-in fade-in zoom-in-95 duration-500">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center" aria-hidden>
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Analysis Complete!</h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">Your results are ready. AI confidence: 87%</p>
                      </div>
                      <Button className="rounded-full px-8 bg-green-600 hover:bg-green-700 text-white shadow-md group mt-2" aria-label="View analysis results" onClick={() => setLocation("/result")}>
                        View Results
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Simulated error triggers (demo controls) */}
            {!imageCaptured && (
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <p className="w-full text-center text-xs text-muted-foreground">Simulate error states:</p>
                {([["too-large", "File Too Large"], ["bad-format", "Bad Format"], ["no-face", "No Face"], ["blurry", "Blurry"], ["network", "Network Error"]] as [ErrorType, string][]).map(([type, label]) => (
                  <Button key={type} variant="outline" size="sm" className="rounded-full text-xs h-8 border-dashed" onClick={() => triggerError(type)} aria-label={`Simulate ${label} error`}>
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
