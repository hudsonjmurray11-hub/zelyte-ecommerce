// Admin panel types

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  todayOrders: number;
  thisWeekOrders: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    inventory: number;
  }>;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  category: 'Electrolytes' | 'Electrolytes + Caffeine';
  price: number;
  cost?: number;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
  caffeineMg: number;
  servings: number;
  summary: string;
  description: string;
  images: string[];
  badges?: string[];
  benefits: string[];
  howToUse: string[];
  ingredients: string[];
  nutritionFacts?: { [key: string]: string | number };
  active: boolean;
  inventory: number;
}

export interface DiscountCode {
  id?: string;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  max_uses?: number;
  current_uses: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementBanner {
  id?: string;
  text: string;
  url?: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentSettings {
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_text: string;
  about_text: string;
  faq_items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BrandSettings {
  logo_url: string;
  primary_color: string;
  tagline: string;
}

export interface BusinessSettings {
  support_email: string;
  social_instagram?: string;
  social_twitter?: string;
  social_facebook?: string;
}

