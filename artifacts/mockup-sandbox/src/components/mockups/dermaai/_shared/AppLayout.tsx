import React, { useState } from "react";
import { Menu, X, Sparkles, User, Home, Camera, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: "dashboard" | "scan" | "profile";
}

export function AppLayout({ children, activeTab }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "scan", label: "Skin Scan", icon: Camera },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">DermaAI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href="#"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  activeTab === link.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
             <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5">
                <LogOut className="w-5 h-5" />
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background border-b border-border animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href="#"
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl text-base font-medium transition-all",
                  activeTab === link.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </a>
            ))}
             <a
                href="#"
                className="flex items-center gap-3 p-4 rounded-2xl text-base font-medium text-destructive hover:bg-destructive/10 transition-all mt-auto"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}