export type Product = {
  id: string;                 // 'coconut-citrus'
  name: string;               // 'Coconut Citrus'
  category: 'Electrolytes' | 'Electrolytes + Caffeine';
  price: number;              // 10
  rating?: number;            // 4.9
  reviewsCount?: number;      // 1247
  caffeineMg: number;         // 0 or 40
  servings: number;           // 15 per tin
  summary: string;            // 1–2 line blurb
  images: string[];           // main image first; use existing assets or placeholders
  badges?: string[];          // e.g., 'No Artificial Flavors', 'Sugar-Free'
  description: string;        // long description
  benefits: string[];         // bullets
  howToUse: string[];         // steps
  ingredients: string[];      // list
  nutritionFacts?: { [k: string]: string | number }; // optional key/value table
  slug: string;               // same as id
};





