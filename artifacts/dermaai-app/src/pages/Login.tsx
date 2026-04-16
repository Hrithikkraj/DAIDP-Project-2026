import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("derma_user", JSON.stringify(data.user));
      setLocation("/dashboard");

    } catch (error: any) {
      alert(error.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* NEW: Explicit Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-md py-2 px-4 rounded-full border border-slate-200 hover:bg-white shadow-sm">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/30 blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-3xl opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary mb-6">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Log in to view your latest skin analysis.</p>
        </div>

        <Card className="p-6 sm:p-8 border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-3xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@example.com" className="pl-10 bg-white border-slate-200 focus-visible:ring-primary rounded-xl h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 bg-white border-slate-200 focus-visible:ring-primary rounded-xl h-11" required />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-12 text-base font-medium shadow-md bg-primary hover:bg-primary/90 text-primary-foreground group">
              {isLoading ? "Logging in..." : (<>Log In<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>)}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-2">
              Don't have an account? <Link href="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
