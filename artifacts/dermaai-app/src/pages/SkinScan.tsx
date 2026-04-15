import { useState, useRef, useEffect } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, ShieldCheck, Loader2, Focus, ScanFace, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function SkinScan() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  
  // --- Camera State ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { addToast } = useDermaToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- FIXED: Attach stream AFTER the video element renders ---
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isCameraActive, mediaStream]);

  // --- Camera Functions ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      addToast("Could not access camera. Please check your browser permissions.", "error");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Handle mirroring so the captured image matches what the user saw
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            handleFileSelect(file);
            stopCamera();
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  // --- File Handling ---
  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      addToast("Image must be smaller than 10MB", "error");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanStep(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- API Analysis ---
  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setScanStep(1); // Uploading...

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setScanStep(2); // Analyzing...
      const data = await response.json();
      
      setTimeout(() => {
        setScanStep(3); // Finishing...
        
        setTimeout(() => {
          const inferenceData = data.analysis;
          sessionStorage.setItem("derma_live_scan", JSON.stringify(inferenceData));
          sessionStorage.removeItem("derma_past_scan");

          addToast("Analysis complete!", "success");
          setIsScanning(false);
          setLocation("/result"); 
        }, 800);
      }, 1500);

    } catch (error) {
      console.error("Analysis failed:", error);
      addToast("Failed to reach the analysis engine. Ensure backend is running.", "error");
      setIsScanning(false);
      setScanStep(0);
    }
  };

  return (
    <AppLayout activeTab="scan">
      <div className="space-y-6 max-w-3xl mx-auto w-full pb-12">
        
        <div className="text-center space-y-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2">
            <ScanFace className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Skin Analysis</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Take a clear, well-lit photo of your face without makeup or glasses for the most accurate clinical evaluation.
          </p>
        </div>

        {/* --- In-App Camera Overlay --- */}
        {isCameraActive && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <h3 className="text-white font-semibold">Align your face</h3>
              <button onClick={stopCamera} className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }} // Mirror effect for front camera
              />
              
              {/* Target Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[70%] max-w-sm aspect-[3/4] border-2 border-dashed border-white/50 rounded-[3rem] relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-50">
                    <Focus className="w-12 h-12 text-white mb-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-black flex justify-center items-center pb-safe">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 active:scale-95 transition-transform"
              >
                <div className="w-full h-full bg-white rounded-full" />
              </button>
            </div>
          </div>
        )}

        <Card className="border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardContent className="p-6 sm:p-8">
            {!previewUrl ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-3xl bg-slate-50/50 dark:bg-zinc-800/50">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
                <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
                  JPEG or PNG up to 10MB. Ensure good lighting and a neutral expression.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button onClick={startCamera} className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2">
                    <Camera className="w-4 h-4" />
                    Use Camera
                  </Button>
                  <Button onClick={handleUploadClick} variant="outline" className="w-full rounded-full h-12 gap-2 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </Button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 shadow-inner">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-90" />
                  
                  {!isScanning && (
                    <button onClick={clearSelection} className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors" aria-label="Remove image">
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 border-4 border-t-primary border-primary/20 rounded-full animate-spin" />
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-md">
                          <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Analyzing Profile</h3>
                      <div className="flex flex-col gap-2 w-full max-w-xs text-sm font-medium text-white/70">
                        <div className="flex items-center gap-3">
                          {scanStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                          <span className={scanStep >= 1 ? "text-white" : ""}>Uploading secure image...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {scanStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : scanStep === 1 ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <div className="w-4 h-4" />}
                          <span className={scanStep >= 2 ? "text-white" : scanStep === 1 ? "text-white" : ""}>Running clinical models...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {scanStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : scanStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <div className="w-4 h-4" />}
                          <span className={scanStep >= 3 ? "text-white" : scanStep === 2 ? "text-white" : ""}>Generating action plan...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isScanning && (
                  <Button onClick={runAnalysis} className="w-full rounded-full h-14 text-base font-medium shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Analyze My Skin
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground font-medium">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Your photos are processed securely and never shared.</span>
        </div>
      </div>
    </AppLayout>
  );
}
