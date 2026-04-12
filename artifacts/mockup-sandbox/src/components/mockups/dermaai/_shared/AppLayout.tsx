import React, { useState, useEffect, createContext, useContext } from "react";
import { Menu, X, Sparkles, User, Home, Camera, LogOut, Moon, Sun, Bell, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }
interface ToastCtx { addToast: (msg: string, type?: ToastType) => void; }
export const ToastContext = createContext<ToastCtx>({ addToast: () => {} });
export const useDermaToast = () => useContext(ToastContext);

function ToastList({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const colors = {
    success: "bg-white border-green-200 text-green-800",
    error: "bg-white border-red-200 text-red-800",
    info: "bg-white border-blue-200 text-blue-800",
  };
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-xs w-full pointer-events-none">
      {toasts.map(t => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={cn("flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-300", colors[t.type])}>
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-current opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: "dashboard" | "scan" | "profile";
}

export function AppLayout({ children, activeTab }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastCounter = 0;

  const addToast = (message: string, type: ToastType = "info") => {
    const id = ++toastCounter + Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "scan", label: "Skin Scan", icon: Camera },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className={cn("min-h-screen flex flex-col font-sans text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300", dark ? "dark bg-zinc-950" : "bg-background")}>
        <ToastList toasts={toasts} remove={removeToast} />

        {/* Navbar */}
        <header className={cn("sticky top-0 z-50 w-full border-b backdrop-blur-xl", dark ? "bg-zinc-950/90 border-zinc-800" : "bg-background/80 border-border/40")}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-semibold text-lg tracking-tight">DermaAI</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.id} href="#" aria-label={link.label}
                  className={cn("flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
                    activeTab === link.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-1">
              <button
                aria-label="Toggle dark mode"
                onClick={() => setDark(d => !d)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                aria-label="Notifications"
                onClick={() => addToast("No new notifications", "info")}
                className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button aria-label="Log out" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button className="md:hidden p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className={cn("md:hidden fixed inset-0 top-16 z-40 border-b animate-in fade-in slide-in-from-top-4", dark ? "bg-zinc-950 border-zinc-800" : "bg-background border-border")}>
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a key={link.id} href="#"
                  className={cn("flex items-center gap-3 p-4 rounded-2xl text-base font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    activeTab === link.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 p-4">
                <button onClick={() => setDark(d => !d)} className="flex items-center gap-3 text-base font-medium text-muted-foreground">
                  {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
              <a href="#" className="flex items-center gap-3 p-4 rounded-2xl text-base font-medium text-destructive hover:bg-destructive/10 transition-all mt-auto">
                <LogOut className="w-5 h-5" />
                Log Out
              </a>
            </nav>
          </div>
        )}

        <main className="flex-1 flex flex-col relative">
          <div className="container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </ToastContext.Provider>
  );
}
