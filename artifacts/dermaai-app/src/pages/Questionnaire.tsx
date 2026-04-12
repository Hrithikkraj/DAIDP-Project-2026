import { useState } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, CheckCircle2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface Step {
  id: string;
  question: string;
  hint: string;
  type: "radio" | "slider";
  options?: { id: string; label: string; emoji?: string }[];
  sliderLabels?: [string, string, string];
}

const STEPS: Step[] = [
  {
    id: "water",
    question: "How much water do you drink daily?",
    hint: "Hydration directly impacts your skin barrier and oil production.",
    type: "radio",
    options: [
      { id: "less-1", label: "Less than 1 Liter" },
      { id: "1-2", label: "1 – 2 Liters" },
      { id: "2-3", label: "2 – 3 Liters" },
      { id: "more-3", label: "More than 3 Liters" },
    ],
  },
  {
    id: "sleep",
    question: "Average hours of sleep per night?",
    hint: "Poor sleep elevates cortisol, triggering acne flares and slower healing.",
    type: "radio",
    options: [
      { id: "less-5", label: "Less than 5 hrs" },
      { id: "6-7", label: "6 – 7 hrs" },
      { id: "8-plus", label: "8+ hrs" },
    ],
  },
  {
    id: "stress",
    question: "What is your current stress level?",
    hint: "Cortisol heavily impacts sebum production and barrier inflammation.",
    type: "slider",
    sliderLabels: ["Very Low", "Moderate", "Very High"],
  },
  {
    id: "diet",
    question: "Which best describes your diet?",
    hint: "High-glycemic foods and dairy are linked to increased acne severity.",
    type: "radio",
    options: [
      { id: "balanced", label: "Balanced & Varied" },
      { id: "high-dairy", label: "High Dairy / Sugar" },
      { id: "plant-based", label: "Mostly Plant-Based" },
      { id: "fast-food", label: "Frequent Fast Food" },
    ],
  },
  {
    id: "exercise",
    question: "How often do you exercise?",
    hint: "Exercise improves circulation and lymphatic drainage, supporting skin health.",
    type: "radio",
    options: [
      { id: "never", label: "Rarely / Never" },
      { id: "1-2", label: "1 – 2x per week" },
      { id: "3-4", label: "3 – 4x per week" },
      { id: "daily", label: "Daily" },
    ],
  },
];

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [stressLevel, setStressLevel] = useState([50]);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useDermaToast();

  const current = STEPS[step];
  const isAnswered = current.type === "slider" || !!answers[current.id];
  const progress = ((step) / STEPS.length) * 100;
  const completedProgress = (step + (isAnswered ? 1 : 0)) / STEPS.length * 100;

  const handleNext = () => {
    if (!isAnswered) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else {
      setSubmitted(true);
      addToast("Profile updated successfully!", "success");
    }
  };

  const handleRadio = (value: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
  };

  if (submitted) {
    return (
      <AppLayout activeTab="profile">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2" aria-hidden>
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Updated!</h1>
            <p className="text-muted-foreground text-lg mt-2 max-w-md">Your lifestyle context has been incorporated into your AI profile for more accurate future scans.</p>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 w-full max-w-sm text-left space-y-2" role="list" aria-label="Your submitted answers">
            {STEPS.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm" role="listitem">
                <span className="text-muted-foreground">{s.question.replace("?", "")}</span>
                <span className="font-semibold">
                  {s.type === "slider" ? `${stressLevel[0]}%` : answers[s.id] || "–"}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard" className="mt-4 rounded-full px-8 h-12 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center font-medium" aria-label="Return to dashboard">
            Return to Dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeTab="profile">
      <div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-slate-100 dark:border-zinc-700 text-primary mb-1" aria-hidden>
            <ClipboardList className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lifestyle Context</h1>
          <p className="text-muted-foreground text-sm">This helps us personalize your routine — takes about 2 minutes.</p>
        </div>

        {/* Progress */}
        <div className="space-y-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Question ${step + 1} of ${STEPS.length}`}>
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-muted-foreground">Question {step + 1} of {STEPS.length}</span>
            <span className="text-primary">{Math.round(completedProgress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completedProgress}%` }} />
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300",
                i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-slate-200 dark:bg-zinc-700"
              )} aria-hidden />
            ))}
          </div>
        </div>

        {/* Question card */}
        <Card className="border-slate-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300" key={step}>
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <Label className="text-xl font-semibold">{current.question}</Label>
              <p className="text-sm text-muted-foreground">{current.hint}</p>
            </div>

            {current.type === "radio" && current.options && (
              <RadioGroup value={answers[current.id] as string || ""} onValueChange={handleRadio} className="grid gap-3" aria-label={current.question}>
                {current.options.map(opt => (
                  <div key={opt.id}>
                    <RadioGroupItem value={opt.id} id={`${current.id}-${opt.id}`} className="peer sr-only" />
                    <Label
                      htmlFor={`${current.id}-${opt.id}`}
                      className="flex items-center gap-3 rounded-xl border-2 border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary"
                    >
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        answers[current.id] === opt.id ? "border-primary bg-primary" : "border-slate-300 dark:border-zinc-600"
                      )} aria-hidden>
                        {answers[current.id] === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium text-sm">{opt.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {current.type === "slider" && (
              <div className="space-y-6 px-2">
                <div className="text-center">
                  <span className={cn("text-5xl font-bold transition-colors",
                    stressLevel[0] < 30 ? "text-green-500" : stressLevel[0] < 70 ? "text-primary" : "text-red-500"
                  )} aria-live="polite" aria-label={`Stress level: ${stressLevel[0]} out of 100`}>
                    {stressLevel[0]}
                  </span>
                  <span className="text-muted-foreground text-lg">/100</span>
                </div>
                <Slider
                  value={stressLevel}
                  max={100}
                  step={1}
                  onValueChange={setStressLevel}
                  aria-label="Stress level slider"
                  className={cn(
                    "[&>span:first-child]:bg-slate-100 dark:[&>span:first-child]:bg-zinc-700 [&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:w-7 [&_[role=slider]]:h-7 [&_[role=slider]]:shadow-md",
                    stressLevel[0] < 30 ? "[&>span>span]:bg-green-400 [&_[role=slider]]:border-green-400" :
                    stressLevel[0] < 70 ? "[&>span>span]:bg-primary [&_[role=slider]]:border-primary" :
                    "[&>span>span]:bg-red-400 [&_[role=slider]]:border-red-400"
                  )}
                />
                <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <span>Very Low</span><span>Moderate</span><span>Very High</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            className="rounded-full px-6 h-11 gap-2"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Go to previous question"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back
          </Button>
          <Button
            className={cn("rounded-full px-8 h-11 gap-2 shadow-md transition-all", isAnswered ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-slate-200 dark:bg-zinc-700 text-muted-foreground cursor-not-allowed")}
            onClick={handleNext}
            disabled={!isAnswered}
            aria-label={step === STEPS.length - 1 ? "Submit questionnaire" : "Go to next question"}
          >
            {step === STEPS.length - 1 ? "Submit" : "Next"}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
        </div>
        {!isAnswered && current.type !== "slider" && (
          <p className="text-center text-xs text-muted-foreground" role="alert">Please select an answer to continue.</p>
        )}
      </div>
    </AppLayout>
  );
}
