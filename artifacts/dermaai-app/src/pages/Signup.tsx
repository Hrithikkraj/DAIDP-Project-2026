import { useState } from "react";
import { Sparkles, Mail, Lock, User, Globe, Droplets, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/30 blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-3xl opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary mb-6 hover:shadow-md transition-all cursor-pointer">
            <Sparkles className="w-7 h-7" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create your profile</h1>
          <p className="text-slate-500">Join DermaAI to start your personalized skin journey.</p>
        </div>

        <Card className="p-6 sm:p-8 border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-3xl">
          <form className="space-y-6" onSubmit={handleSignup}>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="name" placeholder="Sarah Jenkins" className="pl-10 bg-white border-slate-200 focus-visible:ring-primary rounded-xl h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" placeholder="sarah@example.com" className="pl-10 bg-white border-slate-200 focus-visible:ring-primary rounded-xl h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 bg-white border-slate-200 focus-visible:ring-primary rounded-xl h-11" required />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Personalize Your AI</h3>
              <p className="text-xs text-slate-500 mb-4">Help our bias-aware AI understand your unique context.</p>

              <div className="space-y-2">
                <Label className="text-slate-700">Primary Skin Concern</Label>
                <Select required>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl h-11">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder="Select skin type..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oily">Oily / Acne-Prone</SelectItem>
                    <SelectItem value="dry">Dry / Flaky</SelectItem>
                    <SelectItem value="combo">Combination</SelectItem>
                    <SelectItem value="sensitive">Sensitive / Redness</SelectItem>
                    <SelectItem value="aging">Fine Lines / Aging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Heritage / Region</Label>
                <Select required>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl h-11">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder="Select region for tailored insights..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east-asian">East Asian</SelectItem>
                    <SelectItem value="south-asian">South Asian</SelectItem>
                    <SelectItem value="southeast-asian">South Asian / Indian</SelectItem>
                    <SelectItem value="black-african">Black / African</SelectItem>
                    <SelectItem value="black-caribbean">Black / Caribbean</SelectItem>
                    <SelectItem value="hispanic-latino">Hispanic / Latino</SelectItem>
                    <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                    <SelectItem value="white-european">White / European</SelectItem>
                    <SelectItem value="indigenous">Indigenous</SelectItem>
                    <SelectItem value="mixed">Mixed / Multiracial</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl h-12 text-base font-medium shadow-md bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              {isLoading ? "Creating Profile..." : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-2">
              Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
