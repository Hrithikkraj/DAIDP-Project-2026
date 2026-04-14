import { useState } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, Droplets, Activity, CheckCircle2, Eye, EyeOff, ShieldAlert, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

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
  const [compareMode, setCompareMode] = useState(false);
  const { addToast } = useDermaToast();
  
  const imageSrc = uploadedImageUrl || "https://images.unsplash.com/photo-1549416878-b9ca95e26922?q=80&w=2127&auto=format&fit=crop";

  // --- DATA EXTRACTION FROM NEW ENSEMBLE PIPELINE ---
  const apiData = scanResult || {};
  
  const skinType = apiData.final_skin_type || "Balanced";
  const detectedConditions: string[] = apiData.detected_conditions || [];
  const severityScore = apiData.severity_score || 0;
  const clinicalVerdict = apiData.clinical_verdict || "Clear";
  
  // Define appropriate severity thresholds.
  const CONCERNING_SEVERITY_MIN = 1.5; // Start of Moderate
  const GENERAL_CONCERN_LABEL = "Clinical Concern Identified";

  // Condition display logic, incorporating the safety net override.
  let conditionsText;

  if (severityScore < CONCERNING_SEVERITY_MIN) {
    // LOW SEVERITY RULE: Proceed with normal mapping.
    conditionsText = detectedConditions.length > 0
      ? detectedConditions.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
      : "Normal / Clear";
  } else {
    // HIGH SEVERITY RULE (Moderate or Severe).
    if (detectedConditions.length > 0) {
      // High severity + identified concerns. (e.g., severe acne)
      conditionsText = detectedConditions.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
    } else {
      // High severity + NO specified concerns. This is the malignant fix case!
      conditionsText = GENERAL_CONCERN_LABEL;
    }
  }

  // Check if we need to show the medical advisory warning
  const needsMedicalAdvisory = ["Moderate", "Severe"].includes(clinicalVerdict);

  // Map severity score (approx 0 to 4) to a 100-point skin health score
  const skinScore = Math.max(0, Math.min(100, Math.round(100 - (severityScore * 25))));

  return (
    <AppLayout activeTab="scan">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto w-full">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Results</h1>
            <p className="text-muted-foreground mt-1">Just now • Primary AI pipeline active</p>
          </div>
          <Link href="/recommendation" className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground group inline-flex h-10 items-center justify-center px-4 py-2 font-medium">
            View Routine
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
          </Link>
        </div>

        {/* Dynamic Medical Advisory Banner */}
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
          {/* Image & Hotspots */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{compareMode ? "Before / After Comparison" : "Analyzed Image"}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs gap-1.5" onClick={() => setShowHighlights(v => !v)} aria-label={showHighlights ? "Hide acne highlights" : "Show acne highlights"}>
                  {showHighlights ? <EyeOff className="w-3.5 h-3.5" aria-hidden /> : <Eye className="w-3.5 h-3.5" aria-hidden />}
                  {showHighlights ? "Hide" : "Show"} Highlights
                </Button>
                <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs" onClick={() => setCompareMode(v => !v)} aria-label={compareMode ? "Show single view" : "Show before/after comparison"}>
                  {compareMode ? "Single View" : "Before / After"}
                </Button>
              </div>
            </div>

            {!compareMode ? (
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 group">
                <img src={imageSrc} alt="Analyzed face" className="w-full h-auto aspect-[3/4] object-cover object-center" />
                {showHighlights && (detectedConditions.length > 0 || severityScore >= CONCERNING_SEVERITY_MIN) && (
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
            ) : (
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-zinc-700">
                  <div className="relative">
                    <img src={imageSrc} alt="Before treatment" className="w-full aspect-[3/4] object-cover opacity-80 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <Badge className="bg-zinc-900/80 text-white border-0 text-xs">Before</Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <img src={imageSrc} alt="After treatment" className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <Badge className="bg-primary/90 text-white border-0 text-xs">Target Goal</Badge>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-white/60 pointer-events-none" aria-hidden />
              </div>
            )}
          </div>

          {/* Analysis Details */}
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
                Based on our ensemble analysis, your base profile is classified as <strong className="capitalize">{skinType}</strong>. 
                Broader clinical metrics identified <strong>{conditionsText.toLowerCase()}</strong>, 
                with a severity index calculated at <strong>{severityScore.toFixed(2)}</strong>.
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Droplets, color: "bg-blue-50 dark:bg-blue-950/20 text-blue-500", title: "Base Profile", desc: `Classified as ${skinType}.` },
                { icon: Activity, color: "bg-purple-50 dark:bg-purple-950/20 text-purple-500", title: "Key Conditions", desc: `${conditionsText}.` },
                { icon: ShieldAlert, color: "bg-orange-50 dark:bg-orange-950/20 text-orange-500", title: "Clinical Verdict", desc: `Rated as ${clinicalVerdict}.` },
                { icon: AlertTriangle, color: "bg-red-50 dark:bg-red-950/20 text-red-500", title: "Severity Index", desc: `Raw score: ${severityScore.toFixed(2)}` },
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
                    `Adjust your routine to accommodate a ${skinType} base.`,
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

            <Link href="/recommendation" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md group h-12 flex items-center justify-center font-medium" aria-label="Save results to dashboard" onClick={() => addToast("Routine saved to your dashboard!", "success")}>
              Save Results &amp; View Routine
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
