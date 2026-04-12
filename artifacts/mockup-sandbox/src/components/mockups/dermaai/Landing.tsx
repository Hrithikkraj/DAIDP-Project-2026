import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Microscope, HeartPulse, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary flex flex-col overflow-hidden">
      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/50 backdrop-blur-md p-2.5 rounded-2xl text-primary shadow-sm border border-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-slate-800">DermaAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-full px-6">
            Log In
          </Button>
          <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
        {/* Background Image / Decorative */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <img 
              src="/__mockup/images/hero-bg.png" 
              alt="Soft elegant background" 
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-8">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-700">Clinically Validated & Bias-Aware AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
            AI-powered skin analysis <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-foreground">tailored to you.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Your personal digital dermatologist. We analyze your unique skin profile across all tones and types to provide clinical-grade insights and personalized routines.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Your Free Scan
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base border-slate-200 bg-white/50 backdrop-blur-md hover:bg-white text-slate-700">
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-24 px-6 bg-white/40 backdrop-blur-3xl border-y border-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Clinical precision in three steps</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Our technology adapts to your specific skin context, delivering results that actually matter for your daily routine.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            {[
              {
                icon: Camera,
                title: "1. Snap a Photo",
                desc: "Take a clear selfie. Our localized edge-AI ensures your photo never leaves your device for the initial scan."
              },
              {
                icon: Microscope,
                title: "2. Deep Analysis",
                desc: "We analyze 14 unique skin markers including hydration, pigmentation, and acne severity."
              },
              {
                icon: HeartPulse,
                title: "3. Personalized Routine",
                desc: "Get a morning and night protocol scientifically matched to your skin's exact needs."
              }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-white/60 shadow-sm border border-white/50 hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary mb-6 shadow-inner relative z-10 bg-white">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-slate-500 text-sm mt-auto relative z-10 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-slate-800">DermaAI</span>
            <span>© 2024</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Clinical Studies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}