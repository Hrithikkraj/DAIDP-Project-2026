import { useState, useEffect } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Flame, Activity, ChevronRight, CheckCircle2, TrendingUp, TrendingDown, ShieldCheck, BarChart2, History, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { mockUser, mockHistory } from "@/lib/mockData";

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
  const [, setLocation] = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const weeklyData = [
    { label: "Mar 1", score: 70 },
    { label: "Mar 5", score: 91 },
    { label: "Mar 12", score: 74 },
    { label: "Mar 20", score: 78 },
    { label: "Mar 28", score: 77 },
    { label: "Apr 5", score: 64 },
  ];

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hello, {mockUser.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1">Here is your daily skin summary.</p>
          </div>
          <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setLocation("/scan")}>
            <Camera className="w-4 h-4 mr-2" aria-hidden />
            Start New Scan
          </Button>
        </div>

        {/* Skin tone bias indicator */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            Analysis optimized for your skin tone &amp; region (Type IV).{" "}
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
                      <div className="text-3xl font-bold mb-2">64<span className="text-sm text-muted-foreground font-normal">/100</span></div>
                      <Progress value={64} className="h-2 bg-slate-100 [&>div]:bg-primary" aria-label="Skin score 64 out of 100" />
                      <p className="text-xs text-muted-foreground mt-3">-14 points since last week</p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Last Scan Result</CardTitle>
                      <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-1">Moderate Acne</div>
                      <p className="text-sm text-muted-foreground mb-3">Hydration levels are low.</p>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs font-medium">Declining</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                      <Flame className="w-4 h-4 text-orange-400" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">1<span className="text-sm text-muted-foreground font-normal"> Days</span></div>
                      <p className="text-sm text-muted-foreground">Inconsistent routine.</p>
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
                  {mockHistory.slice(0,3).map((scan, i) => (
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
                              <span>{scan.acneLevel}</span>
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
            <p className="text-sm text-muted-foreground">Full scan history — {mockHistory.length} sessions recorded.</p>
            {mockHistory.map((scan, i) => (
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
                        <span>{scan.acneLevel}</span>
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
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs font-medium">-14 pts recently</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Bar chart using CSS */}
                <div className="flex items-end gap-3 h-40 mt-2" role="img" aria-label="Skin score bar chart">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs font-semibold text-muted-foreground">{d.score}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-700 hover:from-primary/80 hover:to-primary/40 cursor-pointer"
                        style={{ height: `${Math.max(5, ((d.score - 50) / 50) * 100)}%` }}
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
                { label: "Acne Severity", value: "Mild → Moderate", change: "Worsening", color: "text-orange-600" },
                { label: "Hydration Index", value: "Fair → Low", change: "-2 levels", color: "text-orange-600" },
                { label: "Overall Trend", value: "Downward", change: "-12.4%", color: "text-orange-600" },
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
