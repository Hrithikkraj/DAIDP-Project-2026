import { useState, useEffect } from "react";
import { AppLayout, useDermaToast } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Info, Bookmark, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Defining the shape of the data coming from your FastAPI backend
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
        {/* Render the actual product image from the CSV */}
        <img 
          src={product.product_pic} 
          alt={product.Product}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
          onError={(e) => {
            // Fallback if the URL in the CSV is broken
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
  const { addToast } = useDermaToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. Retrieve the saved inference data
        const savedData = localStorage.getItem("derma_scan_result");
        
        // Default values just in case user bypassed the scan page
        let skinType = "balanced"; 
        let confidence = 0.80;
        let concern = "acne"; // Default concern, you can make this dynamic later!

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          const resnetData = parsedData.Skin_Type_ResNet50?.data;
          
          if (resnetData) {
            skinType = resnetData.predicted_class;
            confidence = resnetData.confidence;
          }
        }

        // 2. Call your new FastAPI endpoint
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
  }, []);

  return (
    <AppLayout activeTab="recommendation">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto w-full">

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">Custom Protocol</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Prescribed Routine</h1>
          <p className="text-muted-foreground text-lg">Scientifically tailored to your latest scan results using our clinical database.</p>
        </div>

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
        {!loading && !error && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500" aria-hidden>
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
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

        {/* Action bar */}
        {!loading && !error && products.length > 0 && (
          <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 border border-primary/10 mt-10">
            <div className="flex items-start gap-4 max-w-xl">
              <div className="mt-1 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-sm text-primary shrink-0" aria-hidden>
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Patch test new products</h4>
                <p className="text-sm text-muted-foreground">Always test a small amount of new formulas on your jawline for 24 hours before applying to your entire face.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button className="rounded-full shadow-md bg-zinc-900 hover:bg-zinc-800 text-white h-12 px-8 w-full md:w-auto" onClick={() => addToast("Routine saved to your dashboard!", "success")} aria-label="Save routine to dashboard">
                <Bookmark className="w-4 h-4 mr-2" aria-hidden />
                Save Routine
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
