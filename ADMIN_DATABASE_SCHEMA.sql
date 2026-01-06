-- Admin Panel Database Schema
-- Run this SQL in your Supabase SQL Editor to create tables for the admin panel

-- Products table (migrate from static JSON to database)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Electrolytes', 'Electrolytes + Caffeine')),
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  sku TEXT,
  rating DECIMAL(3, 2),
  reviews_count INTEGER DEFAULT 0,
  caffeine_mg INTEGER DEFAULT 0,
  servings INTEGER DEFAULT 15,
  summary TEXT,
  description TEXT,
  images JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  how_to_use JSONB DEFAULT '[]',
  ingredients JSONB DEFAULT '[]',
  nutrition_facts JSONB,
  active BOOLEAN DEFAULT true,
  inventory INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount codes table
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent DECIMAL(5, 2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcement banner table
CREATE TABLE IF NOT EXISTS public.announcement_banner (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  url TEXT,
  visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content settings table
CREATE TABLE IF NOT EXISTS public.content_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_cta_text TEXT,
  about_text TEXT,
  faq_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand settings table
CREATE TABLE IF NOT EXISTS public.brand_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  tagline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business settings table
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  support_email TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_facebook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products (admin can do everything, public can only read active products)
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (active = true);

-- Admin policies (you'll need to adjust these based on your admin auth method)
-- For now, we'll allow all authenticated users to manage products
-- In production, you should add proper admin role checks
CREATE POLICY "Authenticated users can manage products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for discount codes (public can view active codes, admin can manage)
CREATE POLICY "Public can view active discount codes"
  ON public.discount_codes FOR SELECT
  USING (active = true AND NOW() >= start_date AND NOW() <= end_date);

CREATE POLICY "Authenticated users can manage discount codes"
  ON public.discount_codes FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for announcement banner (public can view if visible, admin can manage)
CREATE POLICY "Public can view visible banner"
  ON public.announcement_banner FOR SELECT
  USING (visible = true);

CREATE POLICY "Authenticated users can manage banner"
  ON public.announcement_banner FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for content settings (public can view, admin can manage)
CREATE POLICY "Public can view content settings"
  ON public.content_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage content settings"
  ON public.content_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for brand settings (public can view, admin can manage)
CREATE POLICY "Public can view brand settings"
  ON public.brand_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage brand settings"
  ON public.brand_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Policies for business settings (public can view, admin can manage)
CREATE POLICY "Public can view business settings"
  ON public.business_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage business settings"
  ON public.business_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.announcement_banner
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.content_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.brand_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.business_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Migrate existing products from static data (optional - run this after creating the table)
-- You can manually insert products or create a migration script

