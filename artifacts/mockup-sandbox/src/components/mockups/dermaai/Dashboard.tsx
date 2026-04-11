import React, { useState, useEffect } from "react";
import { AppLayout, useDermaToast } from "./_shared/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Flame, Activity, ChevronRight, CheckCircle2, TrendingUp, TrendingDown, ShieldCheck, BarChart2, History, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <Card className="border-slate-100 shadow-sm bg-white/60">
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-2 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse mt-3" />
      </CardContent>
    </Card>
  );
}

const TABS = ["Overview", "History", "Insights"] as const;
type Tab = typeof TABS[number];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { addToast } = useDermaToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const scans = [
    { date: "Today, 8:30 AM", score: 78, status: "Mild Acne", trend: "up", hydration: "Good" },
    { date: "Oct 12, 9:15 AM", score: 76, status: "Moderate Acne", trend: "down", hydration: "Fair" },
    { date: "Oct 5, 8:45 AM", score: 74, status: "Moderate Acne", trend: "down", hydration: "Low" },
    { date: "Sep 28, 10:00 AM", score: 72, status: "Severe Acne", trend: "down", hydration: "Low" },
    { date: "Sep 20, 8:20 AM", score: 70, status: "Severe Acne", trend: "down", hydration: "Low" },
  ];

  const weeklyData = [
    { label: "Sep 20", score: 70 },
    { label: "Sep 28", score: 72 },
    { label: "Oct 5", score: 74 },
    { label: "Oct 12", score: 76 },
    { label: "Oct 19", score: 77 },
    { label: "Oct 24", score: 78 },
  ];

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hello, Sarah</h1>
            <p className="text-muted-foreground mt-1">Here is your daily skin summary.</p>
          </div>
          <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => addToast("Redirecting to scan...", "info")}>
            <Camera className="w-4 h-4 mr-2" aria-hidden />
            Start New Scan
          </Button>
        </div>

        {/* Skin tone bias indicator */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            Analysis optimized for your skin tone &amp; region (South Asian • Type IV).{" "}
            <span className="font-normal opacity-80">Results may vary across skin types.</span>
            <button className="ml-2 underline hover:no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded">Edit profile</button>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-2xl w-fit" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeTab === tab ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "Overview" && <LayoutDashboard className="w-3.5 h-3.5" />}
              {tab === "History" && <History className="w-3.5 h-3.5" />}
              {tab === "Insights" && <BarChart2 className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {loading ? (
                <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
              ) : (
                <>
                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Overall Skin Score</CardTitle>
                      <Activity className="w-4 h-4 text-primary" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">78<span className="text-sm text-muted-foreground font-normal">/100</span></div>
                      <Progress value={78} className="h-2 bg-slate-100 [&>div]:bg-primary" aria-label="Skin score 78 out of 100" />
                      <p className="text-xs text-muted-foreground mt-3">+4 points since last week</p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Last Scan Result</CardTitle>
                      <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-1">Mild Acne</div>
                      <p className="text-sm text-muted-foreground mb-3">Hydration levels are optimal.</p>
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs font-medium">Improving</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                      <Flame className="w-4 h-4 text-orange-400" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">12<span className="text-sm text-muted-foreground font-normal"> Days</span></div>
                      <p className="text-sm text-muted-foreground">Consistent morning &amp; night routine.</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent (compact) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Scans</h2>
                <Button variant="ghost" size="sm" className="text-primary font-medium hover:bg-primary/5" onClick={() => setActiveTab("History")}>
                  View All
                </Button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid gap-3">
                  {scans.slice(0,3).map((scan, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-zinc-900">
                      <CardContent className="p-4 flex items-center justify-between" tabIndex={0} role="button" aria-label={`Scan from ${scan.date}`}>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors" aria-hidden>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{scan.date}</h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <span>Score: {scan.score}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden />
                              <span>{scan.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {scan.trend === "up" ? <TrendingUp className="w-4 h-4 text-green-500" aria-label="Improving" /> : <TrendingDown className="w-4 h-4 text-red-400" aria-label="Declining" />}
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "History" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-sm text-muted-foreground">Full scan history — 5 sessions recorded.</p>
            {scans.map((scan, i) => (
              <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-zinc-900">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors" aria-hidden>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{scan.date}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Score: {scan.score}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden />
                        <span>{scan.status}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden />
                        <span>Hydration: {scan.hydration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs font-medium", scan.trend === "up" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-600 border-red-200")}>
                      {scan.trend === "up" ? "Improving" : "Worsening"}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "Insights" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Skin Score Trend</CardTitle>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-medium">+8 pts over 5 weeks</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Bar chart using CSS */}
                <div className="flex items-end gap-3 h-40 mt-2" role="img" aria-label="Skin score bar chart over 6 weeks">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs font-semibold text-muted-foreground">{d.score}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-700 hover:from-primary/80 hover:to-primary/40 cursor-pointer"
                        style={{ height: `${((d.score - 65) / 20) * 100}%` }}
                        title={`${d.label}: ${d.score}`}
                      />
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{d.label.split(" ")[0]}<br/>{d.label.split(" ")[1]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Acne Severity", value: "Moderate → Mild", change: "Improving", color: "text-green-600" },
                { label: "Hydration Index", value: "Low → Good", change: "+3 levels", color: "text-blue-600" },
                { label: "Overall Trend", value: "Upward", change: "+11.4%", color: "text-primary" },
              ].map((s, i) => (
                <Card key={i} className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900">
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{s.label}</p>
                    <p className="text-base font-bold">{s.value}</p>
                    <p className={cn("text-sm font-medium mt-1", s.color)}>{s.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
