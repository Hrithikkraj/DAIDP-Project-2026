import React from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Calendar, Flame, Activity, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hello, Sarah</h1>
            <p className="text-slate-500 mt-1">Here is your daily skin summary.</p>
          </div>
          <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
            <Camera className="w-4 h-4 mr-2" />
            Start New Scan
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Overall Skin Score</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-2">78<span className="text-sm text-slate-400 font-normal">/100</span></div>
              <Progress value={78} className="h-2 bg-slate-100 [&>div]:bg-primary" />
              <p className="text-xs text-slate-500 mt-3">+4 points since last week</p>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Last Scan Result</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 mb-1">Mild Acne</div>
              <p className="text-sm text-slate-500 mb-3">Hydration levels are optimal.</p>
              <div className="inline-flex items-center text-xs font-medium text-secondary-foreground bg-secondary/30 px-2.5 py-1 rounded-full">
                Improving
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">Current Streak</CardTitle>
              <Flame className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">12<span className="text-sm text-slate-400 font-normal"> Days</span></div>
              <p className="text-sm text-slate-500">Consistent morning & night routine.</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Scans</h2>
            <Button variant="ghost" size="sm" className="text-primary font-medium hover:bg-primary/5">
              View All
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              { date: "Today, 8:30 AM", score: 78, status: "Mild Acne", hydration: "Good" },
              { date: "Oct 12, 9:15 AM", score: 76, status: "Moderate Acne", hydration: "Fair" },
              { date: "Oct 5, 8:45 AM", score: 74, status: "Moderate Acne", hydration: "Low" },
            ].map((scan, i) => (
              <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white">
                <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{scan.date}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>Score: {scan.score}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{scan.status}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}