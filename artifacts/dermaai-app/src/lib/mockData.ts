export const mockUser = { name: "Alex Johnson", email: "alex@example.com", skinType: "Combination", joinDate: "2026-01-15" };

export const mockResult = { acneLevel: "Moderate", confidence: 87, regions: ["Forehead", "Left cheek", "Jawline"], skinScore: 64, hydration: "Low", oiliness: "High" };

export const mockHistory = [
  { id: 1, date: "2026-04-05", acneLevel: "Moderate", score: 64, trend: "up", hydration: "Good" },
  { id: 2, date: "2026-03-20", acneLevel: "Mild", score: 78, trend: "down", hydration: "Fair" },
  { id: 3, date: "2026-03-05", acneLevel: "Clear", score: 91, trend: "down", hydration: "Low" },
];

export const morningProducts = [
  { step: 1, type: "Cleanser", name: "Gentle Hydrating Cleanser", desc: "Removes impurities without stripping barrier.", image: "product-1.png", tags: ["Barrier Safe", "Fragrance Free"], budget: "Budget" as const, sensitive: true, recommended: true, reason: "Fragrance-free formula suitable for your moderate acne profile. Maintains your skin's natural pH while gently removing impurities." },
  { step: 2, type: "Treatment", name: "Niacinamide 10% Serum", desc: "Controls sebum and reduces redness.", image: "product-6.png", tags: ["Soothing", "Pore Control"], budget: "Budget" as const, sensitive: true, recommended: true, reason: "Clinically proven to reduce sebum production by 52% in 8 weeks. Ideal for your jawline inflammation pattern." },
  { step: 3, type: "Protection", name: "Lightweight Mineral SPF 50", desc: "Broad-spectrum, non-comedogenic.", image: "product-4.png", tags: ["Non-comedogenic", "Matte Finish"], budget: "Premium" as const, sensitive: true, recommended: true, reason: "Zinc oxide base doubles as an anti-inflammatory barrier. Essential for preventing post-inflammatory hyperpigmentation." },
];

export const eveningProducts = [
  { step: 1, type: "Double Cleanse", name: "Oat Cleansing Balm", desc: "Breaks down SPF and excess sebum.", image: "product-3.png", tags: ["Emollient", "Fragrance Free"], budget: "Premium" as const, sensitive: true, recommended: true, reason: "Colloidal oat soothes your compromised barrier while emulsifying sunscreen. Avoids disrupting your skin microbiome." },
  { step: 2, type: "Treatment", name: "BHA 2% Liquid Exfoliant", desc: "Unclogs pores (use 3x/week).", image: "product-2.png", tags: ["Active", "Exfoliant"], budget: "Budget" as const, sensitive: false, recommended: true, reason: "Salicylic acid is oil-soluble — it penetrates into pores to dissolve the debris causing your moderate acne clusters." },
  { step: 3, type: "Moisturizer", name: "Ceramide Repair Cream", desc: "Restores moisture to dehydrated areas.", image: "product-5.png", tags: ["Hydrating", "Barrier Repair"], budget: "Premium" as const, sensitive: true, recommended: true, reason: "Ceramide 1, 3 & 6-II complex matches your skin's natural lipid ratio. Directly addresses the dehydration detected on outer cheeks." },
];

export const avoidProducts = [
  { name: "Heavy Coconut Oil Moisturizer", reason: "Comedogenic rating of 4/5 — will worsen jawline acne." },
  { name: "Alcohol-based Toners", reason: "Strips barrier, increases sebum as compensation." },
];
