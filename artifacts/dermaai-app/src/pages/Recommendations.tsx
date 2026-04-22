import { useState, useEffect } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Bookmark, ExternalLink, Sparkles, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

type ApiProduct = {
  "Skin type": string;
  "Product": string;
  "Concern": string;
  "product_url": string;
  "product_pic": string;
};

function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <Card className="border-slate-100 shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow group flex flex-col h-full overflow-hidden">
      <div className="relative aspect-square bg-slate-50 dark:bg-zinc-800 overflow-hidden p-4 flex items-center justify-center">
        <img 
          src={product.product_pic} 
          alt={product.Product}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop";
          }}
        />
        <Badge className="absolute top-3 right-3 text-[10px] font-semibold border px-2 bg-white/90 text-primary dark:bg-zinc-900/90 backdrop-blur-sm">
          {product["Skin type"]}
        </Badge>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
          Target: {product.Concern}
        </div>
        <h3 className="font-bold text-sm mb-3 leading-tight line-clamp-2">{product.Product}</h3>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
          <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" className="w-full text-xs h-9 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Product
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Recommendations() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasScan, setHasScan] = useState<boolean>(true); 
  const { addToast } = useDermaToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // --- FIXED: Check sessionStorage for either live or historical data ---
        const liveScan = sessionStorage.getItem("derma_live_scan");
        const pastScan = sessionStorage.getItem("derma_past_scan");
        const savedData = liveScan || pastScan;
        
        if (!savedData) {
          setHasScan(false);
          setLoading(false);
          return;
        }

        setHasScan(true);
        const parsedData = JSON.parse(savedData);
        
        // Grab the unified base skin type (Handles both live format and historical format)
        const skinType = parsedData.final_skin_type || parsedData.hydration || "balanced";
        
        // Determine the primary concern
        let concern = "";
        if (parsedData.detected_conditions && parsedData.detected_conditions.length > 0) {
          concern = parsedData.detected_conditions[0];
        } else if (parsedData.acneLevel && parsedData.acneLevel !== "Clear") {
          // Fallback for historical data that only has clinical verdict saved
          concern = "acne";
        }
        
        // Grab confidence (default to high if viewing a historical scan)
        const confidence = parsedData.raw_model_data?.Skin_Type_ResNet50?.data?.confidence || 0.85;

        const response = await fetch("http://127.0.0.1:8000/recommend/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skin_type: skinType,
            concern: concern,
            confidence: confidence
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch recommendations from server");
        }
        
        if (data.status === "success") {
          setProducts(data.recommendations);
        } else {
          throw new Error(data.detail || "Unknown error occurred");
        }

      } catch (err: any) {
        console.error("Recommendation engine error:", err);
        setError(err.message);
        addToast("Could not load recommendations. Ensure the backend is running.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [addToast]);

  return (
    <AppLayout activeTab="recommendation">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto w-full">

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">AI Product Matching</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Recommended Products</h1>
          <p className="text-muted-foreground text-lg">Curated skincare formulas clinically matched to your latest scan results.</p>
        </div>

        {/* Empty State for New Users */}
        {!hasScan && !loading && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm mt-8 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No Scan Data Found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Complete your first AI skin scan to unlock personalized product recommendations tailored to your unique profile.
            </p>
            <Link href="/scan" className="inline-flex items-center justify-center rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-medium transition-colors">
              <Camera className="w-4 h-4 mr-2" aria-hidden />
              Start First Scan
            </Link>
          </div>
        )}

        {/* Patch Test Advisory */}
        {hasScan && !loading && !error && products.length > 0 && (
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-5 flex items-start gap-4 max-w-3xl mx-auto shadow-sm">
            <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-sm text-primary shrink-0" aria-hidden>
              <Info className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-sm mb-1 text-slate-900 dark:text-slate-100">Patch test new products</h4>
              <p className="text-sm text-muted-foreground">Always test a small amount of new formulas on your jawline for 24 hours before applying to your entire face.</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p>Cross-referencing your skin profile with our database...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-8 text-center text-red-600 dark:text-red-400">
            <p className="font-semibold mb-2">We ran into an issue finding your products.</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {hasScan && !loading && !error && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500" aria-hidden>
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Top Matches For You</h2>
              <Badge variant="secondary" className="ml-auto">{products.length} Items Found</Badge>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="font-medium">No exact matches found for your specific profile.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => <ProductCard key={i} product={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
