import React, { useState } from "react";
import { AppLayout, useDermaToast } from "./_shared/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Info, Bookmark, ShoppingBag, ChevronDown, ChevronUp, CheckCircle2, XCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type Budget = "All" | "Budget" | "Premium";
type Sensitivity = "All" | "Sensitive" | "Standard";

interface Product {
  step: number; type: string; name: string; desc: string; image: string;
  tags: string[]; budget: "Budget" | "Premium"; sensitive: boolean;
  recommended: boolean; reason: string;
}

const morningRoutine: Product[] = [
  { step: 1, type: "Cleanser", name: "Gentle Hydrating Cleanser", desc: "Removes overnight impurities without stripping barrier.", image: "product-1.png", tags: ["Barrier Safe", "Non-foaming"], budget: "Budget", sensitive: true, recommended: true, reason: "Fragrance-free formula suitable for your moderate acne profile. Maintains your skin's natural pH while gently removing impurities." },
  { step: 2, type: "Treatment", name: "Niacinamide 10% Serum", desc: "Controls sebum and reduces redness around the jawline.", image: "product-6.png", tags: ["Soothing", "Pore Control"], budget: "Budget", sensitive: true, recommended: true, reason: "Clinically proven to reduce sebum production by 52% in 8 weeks. Ideal for your jawline inflammation pattern." },
  { step: 3, type: "Protection", name: "Lightweight Mineral SPF 50", desc: "Broad-spectrum protection tailored for acne-prone skin.", image: "product-4.png", tags: ["Non-comedogenic", "Matte Finish"], budget: "Premium", sensitive: true, recommended: true, reason: "Zinc oxide base doubles as an anti-inflammatory barrier. Essential for preventing post-inflammatory hyperpigmentation." },
];

const nightRoutine: Product[] = [
  { step: 1, type: "Double Cleanse", name: "Oat Cleansing Balm", desc: "Breaks down SPF and excess sebum gently.", image: "product-3.png", tags: ["Emollient", "Fragrance Free"], budget: "Premium", sensitive: true, recommended: true, reason: "Colloidal oat soothes your compromised barrier while emulsifying sunscreen. Avoids disrupting your skin microbiome." },
  { step: 2, type: "Treatment", name: "BHA 2% Liquid Exfoliant", desc: "Unclogs pores and treats moderate acne (Use 3x week).", image: "product-2.png", tags: ["Active", "Exfoliant"], budget: "Budget", sensitive: false, recommended: true, reason: "Salicylic acid is oil-soluble — it penetrates into pores to dissolve the debris causing your moderate acne clusters." },
  { step: 3, type: "Moisturizer", name: "Ceramide Repair Cream", desc: "Restores moisture to dehydrated cheek areas.", image: "product-5.png", tags: ["Hydrating", "Barrier Repair"], budget: "Premium", sensitive: true, recommended: true, reason: "Ceramide 1, 3 & 6-II complex matches your skin's natural lipid ratio. Directly addresses the dehydration detected on outer cheeks." },
];

// Products to avoid
const avoidProducts = [
  { name: "Heavy Coconut Oil Moisturizer", reason: "Comedogenic rating of 4/5 — will worsen jawline acne." },
  { name: "Alcohol-based Toners", reason: "Strips barrier, increases sebum as compensation." },
];

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow group flex flex-col h-full overflow-hidden">
      <div className="relative aspect-square bg-slate-50 dark:bg-zinc-800 overflow-hidden p-6 flex items-center justify-center">
        <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold z-10" aria-label={`Step ${product.step}`}>
          {product.step}
        </div>
        <Badge className={cn("absolute top-3 right-3 text-[10px] font-semibold border px-2", product.budget === "Budget" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800" : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800")}>
          {product.budget}
        </Badge>
        <img src={`/__mockup/images/${product.image}`} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">{product.type}</div>
        <h3 className="font-bold text-sm mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 flex-1">{product.desc}</p>
        {product.sensitive && (
          <div className="flex items-center gap-1 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden />
            <span className="text-[11px] text-green-700 dark:text-green-400 font-medium">Sensitivity Safe</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-muted-foreground px-2 py-0.5 rounded-md">{tag}</span>
          ))}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded mt-auto"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Hide" : "Show"} why this product is recommended`}
        >
          <Info className="w-3.5 h-3.5" aria-hidden />
          Why this product?
          {expanded ? <ChevronUp className="w-3 h-3" aria-hidden /> : <ChevronDown className="w-3 h-3" aria-hidden />}
        </button>
        {expanded && (
          <div className="mt-2 text-xs text-muted-foreground bg-primary/5 dark:bg-primary/10 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {product.reason}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Recommendations() {
  const [budget, setBudget] = useState<Budget>("All");
  const [sensitivity, setSensitivity] = useState<Sensitivity>("All");
  const { addToast } = useDermaToast();

  const filter = (products: Product[]) =>
    products.filter(p =>
      (budget === "All" || p.budget === budget) &&
      (sensitivity === "All" || (sensitivity === "Sensitive" ? p.sensitive : true))
    );

  const filteredMorning = filter(morningRoutine);
  const filteredNight = filter(nightRoutine);

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto w-full">

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">Custom Protocol</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Prescribed Routine</h1>
          <p className="text-muted-foreground text-lg">Scientifically tailored to target your moderate acne and restore barrier hydration.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="w-4 h-4" aria-hidden />
            Filter by:
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {(["All", "Budget", "Premium"] as Budget[]).map(b => (
                <Button key={b} size="sm" variant={budget === b ? "default" : "outline"} className={cn("rounded-full h-8 text-xs px-3", budget === b ? "bg-primary text-primary-foreground" : "border-slate-200")} onClick={() => setBudget(b)} aria-pressed={budget === b}>
                  {b}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["All", "Sensitive", "Standard"] as Sensitivity[]).map(s => (
                <Button key={s} size="sm" variant={sensitivity === s ? "default" : "outline"} className={cn("rounded-full h-8 text-xs px-3", sensitivity === s ? "bg-blue-600 text-white border-0" : "border-slate-200")} onClick={() => setSensitivity(s)} aria-pressed={sensitivity === s}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Morning Routine */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-500" aria-hidden>
              <Sun className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Morning Protocol</h2>
          </div>
          {filteredMorning.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="font-medium">No products match your filters.</p>
              <p className="text-sm mt-1">Try adjusting the budget or sensitivity settings above.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMorning.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
          )}
        </div>

        {/* Night Routine */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500" aria-hidden>
              <Moon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Night Protocol</h2>
          </div>
          {filteredNight.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="font-medium">No products match your filters.</p>
              <p className="text-sm mt-1">Try adjusting the budget or sensitivity settings above.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNight.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
          )}
        </div>

        {/* Products to Avoid */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" aria-hidden />
            Products to Avoid
          </h3>
          {avoidProducts.map((p, i) => (
            <Card key={i} className="border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4 flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-semibold text-sm text-red-800 dark:text-red-200">{p.name}</p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{p.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action bar */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 border border-primary/10">
          <div className="flex items-start gap-4 max-w-xl">
            <div className="mt-1 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-sm text-primary shrink-0" aria-hidden>
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Start slowly with actives</h4>
              <p className="text-sm text-muted-foreground">Introduce the BHA exfoliant 1-2x per week first to assess tolerance before increasing frequency.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button className="rounded-full shadow-md bg-zinc-900 hover:bg-zinc-800 text-white h-12 px-5 flex-1 md:flex-none" onClick={() => addToast("Routine saved to your dashboard!", "success")} aria-label="Save routine to dashboard">
              <Bookmark className="w-4 h-4 mr-2" aria-hidden />
              Save Routine
            </Button>
            <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-5 flex-1 md:flex-none" onClick={() => addToast("Opening product shop...", "info")} aria-label="Shop the recommended routine">
              <ShoppingBag className="w-4 h-4 mr-2" aria-hidden />
              Shop Routine
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
