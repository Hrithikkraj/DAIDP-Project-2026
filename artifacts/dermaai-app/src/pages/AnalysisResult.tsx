import { useState } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, Droplets, Activity, CheckCircle2, Eye, EyeOff, ShieldAlert, HeartPulse, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter"; 

interface HotspotProps { top: string; left: string; size: string; color: string; label: string; delay?: string; }
function Hotspot({ top, left, size, color, label, delay }: HotspotProps) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className={cn("absolute rounded-full border-2 cursor-pointer group", color)} style={{ top, left, width: size, height: size, animationDelay: delay }}
      onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}
      onClick={() => setShowTip(v => !v)}
      role="button" aria-label={label} tabIndex={0}
      onKeyDown={e => e.key === "Enter" && setShowTip(v => !v)}
    >
      {showTip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" aria-hidden />
        </div>
      )}
    </div>
  );
}

export default function AnalysisResult({ uploadedImageUrl, scanResult }: { uploadedImageUrl: string | null, scanResult: any }) {
  const [showHighlights, setShowHighlights] = useState(true);
  const { addToast } = useDermaToast();
  const [, setLocation] = useLocation(); 
  
  const pastScanRaw = typeof window !== 'undefined' ? sessionStorage.getItem("derma_past_scan") : null;
  const pastScan = pastScanRaw ? JSON.parse(pastScanRaw) : null;
  const isViewMode = !!pastScan;

  const liveScanRaw = typeof window !== 'undefined' ? sessionStorage.getItem("derma_live_scan") : null;
  const liveScan = liveScanRaw ? JSON.parse(liveScanRaw) : null;

  // --- UPDATE THIS LINE TO CHECK liveScan first ---
  const apiData = scanResult || liveScan || {};
  
  const imageSrc = isViewMode 
    ? pastScan.image_url 
    : (apiData.image_url || uploadedImageUrl || "https://images.unsplash.com/photo-1549416878-b9ca95e26922?q=80&w=2127&auto=format&fit=crop");

  const skinType = isViewMode ? pastScan.hydration : (apiData.final_skin_type || "Balanced");
  const clinicalVerdict = isViewMode ? pastScan.acneLevel : (apiData.clinical_verdict || "Clear");
  const severityScore = apiData.severity_score || 0; 
  const skinScore = isViewMode ? pastScan.score : Math.max(0, Math.min(100, Math.round(100 - (severityScore * 25))));
  
  const CONCERNING_SEVERITY_MIN = 1.5; 
  const GENERAL_CONCERN_LABEL = "Clinical Concern Identified";

  let conditionsText = "Normal / Clear";
  
  if (isViewMode) {
    conditionsText = ["Mild", "Moderate", "Severe"].includes(clinicalVerdict) ? GENERAL_CONCERN_LABEL : "Normal / Clear";
  } else {
    const detectedConditions: string[] = apiData.detected_conditions || [];
    if (severityScore < CONCERNING_SEVERITY_MIN) {
      conditionsText = detectedConditions.length > 0
        ? detectedConditions.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
        : "Normal / Clear";
    } else {
      if (detectedConditions.length > 0) {
        conditionsText = detectedConditions.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
      } else {
        conditionsText = GENERAL_CONCERN_LABEL;
      }
    }
  }

  const needsMedicalAdvisory = ["Moderate", "Severe"].includes(clinicalVerdict);

  return (
    <AppLayout activeTab="scan">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto w-full">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Results</h1>
            <p className={cn("mt-1 flex items-center gap-1.5", isViewMode ? "text-amber-600 dark:text-amber-500 font-medium" : "text-muted-foreground")}>
              {isViewMode ? (
                <><History className="w-4 h-4" /> Historical Record • Analyzed on {pastScan.date}</>
              ) : (
                "Just now • Primary AI pipeline active"
              )}
            </p>
          </div>
          
          {!isViewMode && (
            <Button 
              className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground group inline-flex h-10 items-center justify-center px-4 py-2 font-medium"
              onClick={() => setLocation("/recommendation")}
            >
              View Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
            </Button>
          )}
        </div>

        {needsMedicalAdvisory && (
          <div className="flex items-start gap-3 px-4 py-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <HeartPulse className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-sm text-red-800 dark:text-red-200 font-semibold mb-1">
                Medical Advisory Recommended
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 opacity-90">
                Our models detected a <strong>{clinicalVerdict.toLowerCase()}</strong> severity level in your scan. While our AI provides general skincare recommendations, we strongly advise consulting with a certified dermatologist or healthcare professional for a formal diagnosis and treatment plan to ensure optimal skin health.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Analyzed Image</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs gap-1.5" onClick={() => setShowHighlights(v => !v)} aria-label={showHighlights ? "Hide highlights" : "Show highlights"}>
                  {showHighlights ? <EyeOff className="w-3.5 h-3.5" aria-hidden /> : <Eye className="w-3.5 h-3.5" aria-hidden />}
                  {showHighlights ? "Hide" : "Show"} Highlights
                </Button>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 group">
              <img src={imageSrc} alt="Analyzed face" className="w-full h-auto aspect-[3/4] object-cover object-center" />
              {showHighlights && (conditionsText !== "Normal / Clear") && (
                <div aria-label="Skin condition highlights overlay">
                  <Hotspot top="44%" left="22%" size="14%" color="border-red-400 bg-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.5)] animate-pulse" label="Detected concern zone" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/50 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Visual Health Index</span>
                  <span className="text-xl font-bold text-primary">{skinScore}<span className="text-sm text-muted-foreground font-normal">/100</span></span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={skinScore} aria-valuemin={0} aria-valuemax={100} aria-label="Overall skin score">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${skinScore}%`}} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <Card className="border-slate-100 shadow-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-slate-50 dark:border-zinc-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-xl">Clinical Breakdown</CardTitle>
                  <Badge variant="outline" className={cn("font-medium px-3 py-1 capitalize", 
                    clinicalVerdict === "Clear" ? "bg-green-50 text-green-700 border-green-200" :
                    clinicalVerdict === "Mild" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    "bg-orange-50 text-orange-700 border-orange-200"
                  )} role="status">
                    {clinicalVerdict} Verdict
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-muted-foreground leading-relaxed text-sm">
                {/* --- CHANGED: Replaced 'base profile' with 'core skin type' --- */}
                Based on our ensemble analysis, your core skin type is classified as <strong className="capitalize">{skinType}</strong>. 
                Broader clinical metrics identified <strong>{conditionsText.toLowerCase()}</strong>, 
                with a calculated score index of <strong>{skinScore}/100</strong>.
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                // --- CHANGED: Replaced Title to 'Skin Type' ---
                { icon: Droplets, color: "bg-blue-50 dark:bg-blue-950/20 text-blue-500", title: "Skin Type", desc: `Base profile: ${skinType}.` },
                { icon: Activity, color: "bg-purple-50 dark:bg-purple-950/20 text-purple-500", title: "Key Conditions", desc: `${conditionsText}.` },
                { icon: ShieldAlert, color: "bg-orange-50 dark:bg-orange-950/20 text-orange-500", title: "Clinical Verdict", desc: `Rated as ${clinicalVerdict}.` },
                { icon: AlertTriangle, color: "bg-red-50 dark:bg-red-950/20 text-red-500", title: "Health Index", desc: `Score: ${skinScore}/100` },
              ].map((item, i) => (
                <Card key={i} className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={cn("p-2 rounded-xl shrink-0", item.color)} aria-hidden>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden />
                  Recommended Action Plan
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                  {[
                    // --- CHANGED: 'accommodate a combination base' -> 'accommodate a combination skin type' ---
                    `Adjust your routine to accommodate a ${skinType.toLowerCase()} skin type.`,
                    needsMedicalAdvisory ? `Ensure daily SPF use is prioritized.` : `Maintain barrier health with gentle hydration.`,
                    needsMedicalAdvisory ? `Strictly avoid harsh actives until a medical consult.` : "Introduce targeted actives as tolerance allows.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {isViewMode ? (
              <Button 
                variant="outline"
                className="w-full rounded-full h-12 text-base shadow-sm font-medium group" 
                onClick={() => {
                  sessionStorage.removeItem("derma_past_scan");
                  setLocation("/dashboard"); 
                }}
              >
                Return to Dashboard
              </Button>
            ) : (
              <Button 
                className="w-full rounded-full h-12 text-base shadow-md bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center font-medium group" 
                aria-label="Save results to dashboard" 
                onClick={async () => {
                  const savedUser = localStorage.getItem("derma_user");
                  if (savedUser) {
                    const user = JSON.parse(savedUser);
                    
                    try {
                      await fetch("http://127.0.0.1:8000/history/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: user.email,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          score: skinScore,
                          acneLevel: clinicalVerdict,
                          hydration: skinType,
                          trend: "up", 
                          image_url: apiData.image_url
                        })
                      });
                    } catch (e) {
                      console.error("Failed to save history", e);
                    }
                  }
                  
                  addToast("Results saved to your dashboard!", "success");
                  setLocation("/recommendation"); 
                }}
              >
                Save Results &amp; View Products
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Button>
            )}
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
