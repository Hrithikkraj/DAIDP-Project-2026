import React from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, Droplets, Sun, Activity, CheckCircle2 } from "lucide-react";

export default function AnalysisResult() {
  return (
    <AppLayout activeTab="scan">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Results</h1>
            <p className="text-slate-500 mt-1">Oct 24, 2024 • AI Confidence: 94%</p>
          </div>
          <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground group">
            View Routine
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image & Hotspots */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-white group">
              <img 
                src="/__mockup/images/face-sample.png" 
                alt="Analyzed face" 
                className="w-full h-auto aspect-[3/4] object-cover object-center"
              />
              
              {/* CSS Hotspot Overlay 1 */}
              <div className="absolute top-[45%] left-[25%] w-[15%] h-[12%] rounded-full border-2 border-red-400 bg-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.5)] animate-pulse"></div>
              {/* CSS Hotspot Overlay 2 */}
              <div className="absolute top-[50%] right-[30%] w-[12%] h-[10%] rounded-full border-2 border-red-400 bg-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.5)] animate-pulse" style={{ animationDelay: "1s" }}></div>
              {/* CSS Hotspot Overlay 3 */}
              <div className="absolute top-[30%] left-[45%] w-[20%] h-[8%] rounded-full border-2 border-primary bg-primary/20 shadow-[0_0_15px_rgba(139,175,139,0.5)]"></div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Overall Score</span>
                  <span className="text-xl font-bold text-primary">78<span className="text-sm text-slate-500 font-normal">/100</span></span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-900">Clinical Summary</CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium px-3 py-1">
                    Moderate Acne
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                Our analysis detects moderate inflammatory acne clustered around the lower cheeks and jawline. This pattern often correlates with hormonal fluctuations or barrier impairment. Skin hydration appears optimal in the T-zone but shows slight dehydration on the outer perimeter. Pigmentation is even across the board.
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-500 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Inflammation</h4>
                    <p className="text-sm text-slate-500">Elevated around jawline. Needs soothing ingredients.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Hydration</h4>
                    <p className="text-sm text-slate-500">Balanced T-Zone, but dry cheeks detected.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Sun Damage</h4>
                    <p className="text-sm text-slate-500">Minimal visible UV damage. Keep using SPF.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Texture</h4>
                    <p className="text-sm text-slate-500">Smooth overall, minor congestion near chin.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-100 shadow-sm bg-secondary/10 border-secondary/20">
              <CardContent className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-foreground" />
                  Recommended Action Plan
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground mt-1.5 shrink-0"></span>
                    <span>Introduce a gentle BHA (Salicylic Acid) exfoliant 2x a week to clear congestion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground mt-1.5 shrink-0"></span>
                    <span>Focus on barrier repair using Ceramides to soothe inflammation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground mt-1.5 shrink-0"></span>
                    <span>Avoid heavy occlusive creams on the jawline area.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}