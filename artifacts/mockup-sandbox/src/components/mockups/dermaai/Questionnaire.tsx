import React, { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ClipboardList, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Questionnaire() {
  const [stressLevel, setStressLevel] = useState([50]);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AppLayout activeTab="profile">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Updated</h1>
          <p className="text-slate-500 text-lg max-w-md">Your lifestyle factors have been incorporated into your AI profile for more accurate future scans.</p>
          <Button className="mt-8 rounded-full px-8 h-12 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeTab="profile">
      <div className="max-w-2xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 text-primary mb-2">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lifestyle Context</h1>
          <p className="text-slate-500">Help the AI understand external factors affecting your skin health.</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          
          <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
            <div className="h-1.5 w-full bg-slate-50">
              <div className="h-full bg-primary w-[20%]"></div>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <Label className="text-lg font-semibold text-slate-900">How much water do you drink daily?</Label>
              <RadioGroup defaultValue="2-3" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { id: "less-1", label: "Less than 1 Liter" },
                  { id: "1-2", label: "1 - 2 Liters" },
                  { id: "2-3", label: "2 - 3 Liters" },
                  { id: "more-3", label: "More than 3 Liters" },
                ].map((option) => (
                  <div key={option.id}>
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <span className="font-medium text-sm">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
            <div className="h-1.5 w-full bg-slate-50">
              <div className="h-full bg-primary w-[40%]"></div>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <Label className="text-lg font-semibold text-slate-900">Average hours of sleep per night?</Label>
              <RadioGroup defaultValue="6-7" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { id: "less-5", label: "< 5 hours" },
                  { id: "6-7", label: "6 - 7 hours" },
                  { id: "8-plus", label: "8+ hours" },
                ].map((option) => (
                  <div key={option.id}>
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-secondary-foreground peer-data-[state=checked]:bg-secondary/20 peer-data-[state=checked]:text-secondary-foreground cursor-pointer transition-all"
                    >
                      <span className="font-medium text-sm">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
             <div className="h-1.5 w-full bg-slate-50">
              <div className="h-full bg-primary w-[60%]"></div>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <Label className="text-lg font-semibold text-slate-900">Current Stress Level</Label>
                <p className="text-sm text-slate-500 mt-1 mb-6">Cortisol heavily impacts sebum production and inflammation.</p>
              </div>
              
              <div className="px-2">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  onValueChange={setStressLevel}
                  className={cn(
                    "[&>span:first-child]:bg-slate-100 [&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6",
                    stressLevel[0] < 30 ? "[&>span>span]:bg-green-400 [&_[role=slider]]:border-green-400" :
                    stressLevel[0] < 70 ? "[&>span>span]:bg-primary [&_[role=slider]]:border-primary" :
                    "[&>span>span]:bg-red-400 [&_[role=slider]]:border-red-400"
                  )}
                />
                <div className="flex justify-between items-center mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <span>Very Low</span>
                  <span>Moderate</span>
                  <span>Very High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
             <div className="h-1.5 w-full bg-slate-50">
              <div className="h-full bg-primary w-[80%]"></div>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <Label className="text-lg font-semibold text-slate-900">Dietary focus</Label>
              <p className="text-sm text-slate-500 mb-4">Select the option that best describes your diet.</p>
              <RadioGroup defaultValue="balanced" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "balanced", label: "Balanced & Varied" },
                  { id: "high-dairy", label: "High Dairy / Sugar" },
                  { id: "plant-based", label: "Mostly Plant-Based" },
                  { id: "fast-food", label: "Frequent Fast Food" },
                ].map((option) => (
                  <div key={option.id}>
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <span className="font-medium text-sm">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground group w-full sm:w-auto">
              Save Profile Updates
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

      </div>
    </AppLayout>
  );
}