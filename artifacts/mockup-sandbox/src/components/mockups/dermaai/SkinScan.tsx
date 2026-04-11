import React, { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UploadCloud, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SkinScan() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsLoading] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);

  const handleSimulateScan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setImageCaptured(true);
    }, 2000);
  };

  return (
    <AppLayout activeTab="scan">
      <div className="max-w-2xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scan Your Skin</h1>
          <p className="text-slate-500">Take a clear, makeup-free photo in good lighting for the most accurate analysis.</p>
        </div>

        {!imageCaptured ? (
          <Card 
            className={cn(
              "border-2 border-dashed transition-all duration-200 overflow-hidden bg-white/50 backdrop-blur-sm",
              isDragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <CardContent className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              
              {isUploading ? (
                <div className="flex flex-col items-center space-y-6 animate-in fade-in">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    {/* Gentle pulsing rings */}
                    <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">Analyzing your skin...</h3>
                    <p className="text-sm text-slate-500">Evaluating 14 clinical markers</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Camera className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">Take a photo or upload</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Drag and drop your image here, or click to browse. JPEG, PNG up to 10MB.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-4">
                    <Button 
                      className="rounded-full px-8 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                      onClick={handleSimulateScan}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-8 bg-white w-full sm:w-auto"
                      onClick={handleSimulateScan}
                    >
                      <UploadCloud className="w-4 h-4 mr-2 text-slate-500" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-100 shadow-sm overflow-hidden bg-white animate-in zoom-in-95 duration-500">
            <div className="relative aspect-[4/3] bg-slate-100 w-full overflow-hidden">
              <img 
                src="/__mockup/images/face-sample.png" 
                alt="Captured scan" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-sm drop-shadow-md">Image quality: Excellent</span>
                </div>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full" onClick={() => setImageCaptured(false)}>
                  Retake
                </Button>
              </div>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Make sure you are makeup-free</p>
                  <p className="text-amber-700/80">Makeup can obscure key skin markers. If you are wearing makeup, please clean your face and retake for best results.</p>
                </div>
              </div>
              
              <Button className="w-full rounded-full h-14 text-base font-semibold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground group">
                Generate Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
}

// Temporary internal icons
import { CheckCircle2, ArrowRight } from "lucide-react";