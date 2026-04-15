import { useState, useEffect } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Flame, Activity, ChevronRight, CheckCircle2, ShieldCheck, BarChart2, History, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

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

// --- NEW: TypeScript interface for the Calendar ---
interface CalendarDay {
  dateStr: string;
  monthStr: string;
  count: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [userProfile, setUserProfile] = useState<any>(null);
  const { addToast } = useDermaToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const savedUser = localStorage.getItem("derma_user");
      if (!savedUser) {
        setLocation("/login");
        return;
      }

      const user = JSON.parse(savedUser);
      
      try {
        const res = await fetch(`http://127.0.0.1:8000/profile/${user.email}`);
        const data = await res.json();
        if (data.status === "success") {
          setUserProfile(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        addToast("Could not load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setLocation, addToast]);

  const history = userProfile?.history || [];
  const reversedHistory = [...history].reverse(); 
  const latestScan = reversedHistory[0];
  const hasHistory = history.length > 0;
  
  // --- LINE CHART DATA PREP ---
  const chartDataRaw = reversedHistory.slice(0, 6).reverse().map((scan: any) => ({
    label: scan.date,
    score: scan.score
  }));

  const displayChartData = hasHistory && chartDataRaw.length > 1 
    ? chartDataRaw 
    : [{ label: "Start", score: 0 }, { label: "Current", score: hasHistory ? chartDataRaw[0].score : 0 }];

  // FIXED: Expanded margins & padding so text labels do not get clipped
  const chartWidth = 650;
  const chartHeight = 140;
  const leftMargin = 55; 
  const rightMargin = 40;
  const yPadding = 45;   
  const plotWidth = chartWidth - leftMargin - rightMargin;
  
  const xStep = plotWidth / Math.max(1, displayChartData.length - 1);

  const chartPoints = displayChartData.map((d: any, i: number) => {
    const x = leftMargin + i * xStep;
    const y = yPadding + chartHeight - (d.score / 100) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = chartPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight + yPadding} L ${chartPoints[0].x} ${chartHeight + yPadding} Z`;

  const viewHistoricalScan = (scan: any) => {
    sessionStorage.setItem("derma_past_scan", JSON.stringify(scan));
    setLocation("/result");
  };

  // --- GITHUB CALENDAR DATA PREP ---
  const activityCounts: Record<string, number> = {};
  history.forEach((h: any) => {
    activityCounts[h.date] = (activityCounts[h.date] || 0) + 1;
  });

  // FIXED: Added the explicit CalendarDay[][] type to remove the ts(7034) warning
  const calendarWeeks: CalendarDay[][] = [];
  for (let i = 0; i < 52; i++) {
    const week: CalendarDay[] = [];
    for (let j = 0; j < 7; j++) {
      const daysAgo = 363 - (i * 7 + j); // Starts 1 year ago, ends today
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      week.push({ dateStr, monthStr, count: activityCounts[dateStr] || 0 });
    }
    calendarWeeks.push(week);
  }

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hello, {userProfile?.name?.split(' ')[0] || "there"}</h1>
            <p className="text-muted-foreground mt-1">Here is your daily skin summary.</p>
          </div>
          <Button 
            className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground" 
            onClick={() => {
              sessionStorage.removeItem("derma_past_scan");
              setLocation("/scan");
            }}
          >
            <Camera className="w-4 h-4 mr-2" aria-hidden />
            Start New Scan
          </Button>
        </div>

        {userProfile?.heritage && (
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Analysis optimized for your heritage ({userProfile.heritage.replace("-", " ")}).{" "}
              <span className="font-normal opacity-80">Results may vary across skin types.</span>
            </p>
          </div>
        )}

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

        {activeTab === "Overview" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {loading ? (
                <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
              ) : !hasHistory ? (
                <div className="col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-8 text-center text-muted-foreground">
                  <Camera className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-semibold text-foreground">No scans yet</h3>
                  <p className="text-sm">Complete your first scan to unlock your dashboard metrics.</p>
                </div>
              ) : (
                <>
                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Latest Skin Score</CardTitle>
                      <Activity className="w-4 h-4 text-primary" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{latestScan.score}<span className="text-sm text-muted-foreground font-normal">/100</span></div>
                      <Progress value={latestScan.score} className="h-2 bg-slate-100 [&>div]:bg-primary" />
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Clinical Verdict</CardTitle>
                      <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-1 capitalize">{latestScan.acneLevel}</div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium mt-2">Analyzed {latestScan.date}</Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-100 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
                      <Flame className="w-4 h-4 text-orange-400" aria-hidden />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{history.length}</div>
                      <p className="text-sm text-muted-foreground">Consistent tracking helps!</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Scans</h2>
                {hasHistory && (
                  <Button variant="ghost" size="sm" className="text-primary font-medium hover:bg-primary/5" onClick={() => setActiveTab("History")}>
                    View All
                  </Button>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : !hasHistory ? (
                <p className="text-sm text-muted-foreground">Your recent scans will appear here.</p>
              ) : (
                <div className="grid gap-3">
                  {reversedHistory.slice(0,3).map((scan: any, i: number) => (
                    <Card 
                      key={i} 
                      onClick={() => viewHistoricalScan(scan)}
                      className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-zinc-900"
                    >
                      <CardContent className="p-4 flex items-center justify-between" tabIndex={0}>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{scan.date}</h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <span>Score: {scan.score}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="capitalize">{scan.acneLevel}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "History" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-sm text-muted-foreground">Full scan history — {history.length} sessions recorded.</p>
            {!hasHistory && <p className="text-sm mt-4">No history available yet.</p>}
            
            {reversedHistory.map((scan: any, i: number) => (
              <Card 
                key={i} 
                onClick={() => viewHistoricalScan(scan)}
                className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-zinc-900"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{scan.date}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Score: {scan.score}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="capitalize">{scan.acneLevel}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Insights Tab (Bar Chart & GitHub Calendar) */}
        {activeTab === "Insights" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* --- SVG LINE CHART --- */}
            <Card className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">Skin Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto pb-2">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight + yPadding * 2}`} className="w-full h-auto min-w-[500px] overflow-visible text-primary">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Background Grid Lines (25, 50, 75, 100) */}
                    {[25, 50, 75, 100].map(val => {
                      const y = yPadding + chartHeight - (val / 100) * chartHeight;
                      return (
                        <g key={val}>
                          <line x1={leftMargin} y1={y} x2={chartWidth - rightMargin} y2={y} className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="1" />
                          <text x={leftMargin - 10} y={y + 3} fontSize="11" textAnchor="end" className="fill-slate-400">{val}</text>
                        </g>
                      );
                    })}

                    {/* Shaded Area */}
                    <path d={areaPath} fill="url(#areaGradient)" />
                    {/* Line path */}
                    <path d={linePath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Data Points & Labels */}
                    {chartPoints.map((p: any, i: number) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="currentColor" strokeWidth="2" className="dark:fill-zinc-900" />
                        <text x={p.x} y={p.y - 14} fontSize="12" fontWeight="bold" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200">{p.score > 0 ? p.score : ""}</text>
                        <text x={p.x} y={chartHeight + yPadding + 18} fontSize="11" textAnchor="middle" className="fill-slate-500">{p.label}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* --- GITHUB CALENDAR --- */}
            <Card className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">Scan Activity (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full overflow-x-auto pb-4">
                  
                  {/* FIXED: Pinned Y-Axis (Mon, Wed, Fri) aligned to grid rows */}
                  <div className="pt-[20px] pr-2 flex flex-col gap-[3px] text-[10px] text-muted-foreground font-medium shrink-0">
                    <div className="h-[11px]" />
                    <div className="h-[11px] flex items-center">Mon</div>
                    <div className="h-[11px]" />
                    <div className="h-[11px] flex items-center">Wed</div>
                    <div className="h-[11px]" />
                    <div className="h-[11px] flex items-center">Fri</div>
                    <div className="h-[11px]" />
                  </div>
                  
                  <div className="flex-1 min-w-max">
                    {/* Top Month Labels */}
                    <div className="flex h-[20px] text-[10px] text-muted-foreground font-medium relative">
                      {calendarWeeks.map((week, i) => {
                        const showMonth = i === 0 || week[0].monthStr !== calendarWeeks[i-1][0].monthStr;
                        return (
                          <div key={i} className="w-[14px] shrink-0 relative">
                            {showMonth && <span className="absolute top-0 left-0 whitespace-nowrap">{week[0].monthStr}</span>}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* 52x7 Box Grid */}
                    <div className="flex gap-[3px]">
                      {calendarWeeks.map((week, i) => (
                        <div key={i} className="flex flex-col gap-[3px]">
                          {week.map((day, j) => (
                            <div 
                              key={j} 
                              title={`${day.count} scans on ${day.dateStr}`} 
                              className={cn(
                                "w-[11px] h-[11px] rounded-[2px] transition-colors cursor-pointer hover:ring-1 hover:ring-primary/50", 
                                day.count === 0 ? "bg-slate-100 dark:bg-zinc-800" :
                                day.count === 1 ? "bg-primary/40" :
                                day.count === 2 ? "bg-primary/70" :
                                "bg-primary"
                              )} 
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground font-medium">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-slate-100 dark:bg-zinc-800" />
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-primary/40" />
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-primary/70" />
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-primary" />
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </AppLayout>
  );
}
