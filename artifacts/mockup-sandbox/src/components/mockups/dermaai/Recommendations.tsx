import React from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Info, Bookmark, ShoppingBag, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Recommendations() {
  const morningRoutine = [
    {
      step: 1,
      type: "Cleanser",
      name: "Gentle Hydrating Cleanser",
      desc: "Removes overnight impurities without stripping barrier.",
      image: "product-1.png",
      tags: ["Barrier Safe", "Non-foaming"]
    },
    {
      step: 2,
      type: "Treatment",
      name: "Niacinamide 10% Serum",
      desc: "Controls sebum and reduces redness around the jawline.",
      image: "product-6.png",
      tags: ["Soothing", "Pore Control"]
    },
    {
      step: 3,
      type: "Protection",
      name: "Lightweight Mineral SPF 50",
      desc: "Broad-spectrum protection tailored for acne-prone skin.",
      image: "product-4.png",
      tags: ["Non-comedogenic", "Matte Finish"]
    }
  ];

  const nightRoutine = [
    {
      step: 1,
      type: "Double Cleanse",
      name: "Oat Cleansing Balm",
      desc: "Breaks down SPF and excess sebum gently.",
      image: "product-3.png",
      tags: ["Emollient", "Fragrance Free"]
    },
    {
      step: 2,
      type: "Treatment",
      name: "BHA 2% Liquid Exfoliant",
      desc: "Unclogs pores and treats moderate acne (Use 3x week).",
      image: "product-2.png",
      tags: ["Active", "Exfoliant"]
    },
    {
      step: 3,
      type: "Moisturizer",
      name: "Ceramide Repair Cream",
      desc: "Restores moisture to dehydrated cheek areas.",
      image: "product-5.png",
      tags: ["Hydrating", "Barrier Repair"]
    }
  ];

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto w-full">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium hover:bg-primary/20 transition-colors">
            Custom Protocol
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Your Prescribed Routine</h1>
          <p className="text-slate-500 text-lg">Scientifically tailored to target your moderate acne and restore barrier hydration.</p>
        </div>

        <div className="flex justify-center">
           <Button className="rounded-full shadow-md bg-slate-900 hover:bg-slate-800 text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              Save Routine to Dashboard
           </Button>
        </div>

        {/* Morning Routine */}
        <div className="space-y-6 relative">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
              <Sun className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Morning Protocol</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {morningRoutine.map((product, i) => (
              <Card key={i} className="border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow group flex flex-col h-full overflow-hidden">
                <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 flex items-center justify-center">
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10">
                    {product.step}
                  </div>
                  <img src={`/__mockup/images/${product.image}`} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{product.type}</div>
                  <h3 className="font-bold text-slate-900 mb-2 leading-tight">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{product.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-50">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Night Routine */}
        <div className="space-y-6 relative pt-4">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500">
              <Moon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Night Protocol</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nightRoutine.map((product, i) => (
              <Card key={i} className="border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow group flex flex-col h-full overflow-hidden">
                <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 flex items-center justify-center">
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold z-10">
                    {product.step}
                  </div>
                  <img src={`/__mockup/images/${product.image}`} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">{product.type}</div>
                  <h3 className="font-bold text-slate-900 mb-2 leading-tight">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{product.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-50">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Bottom */}
        <div className="bg-primary/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/10 mt-8">
          <div className="flex items-start gap-4 max-w-xl">
             <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-primary shrink-0">
               <Info className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-semibold text-slate-900 mb-1">Important Note</h4>
               <p className="text-sm text-slate-600">Introduce new active ingredients slowly. Start the BHA exfoliant 1-2 times a week to assess tolerance before increasing frequency.</p>
             </div>
          </div>
          <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap w-full md:w-auto h-12 px-6">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop the Routine
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}