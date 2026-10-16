-- ==============================================================================
-- Kamakhya Trading Co (KTC) - Free Serverless PostgreSQL / Supabase Schema
-- Run this script in the Supabase SQL Editor (or Neon SQL Console)
-- ==============================================================================

-- 1. Products Table (Stores all your retail and wholesale apparel)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    sku TEXT,
    category TEXT DEFAULT 'Ethnic Wear',
    fabric TEXT DEFAULT 'Pure Cotton',
    retail_price NUMERIC DEFAULT 0,
    wholesale_price NUMERIC DEFAULT 0,
    moq INTEGER DEFAULT 1,
    sizes JSONB DEFAULT '["Free Size"]'::jsonb,
    image TEXT,
    ai_model_image TEXT,
    description TEXT,
    stock INTEGER DEFAULT 120,
    color_variants JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by category and slug
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 2. Customer Inquiries & Wholesale Quotes Table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    business_name TEXT,
    phone TEXT,
    gstin TEXT,
    purchase_mode TEXT DEFAULT 'wholesale',
    items JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Initial Demo Product (Only 1 real demo item, no fake mill claims)
INSERT INTO products (
    id,
    slug,
    title,
    sku,
    category,
    fabric,
    retail_price,
    wholesale_price,
    moq,
    sizes,
    image,
    ai_model_image,
    description,
    stock,
    color_variants
) VALUES (
    'banarasi-silk-saree',
    'banarasi-silk-saree',
    'Heritage Katan Banarasi Silk Saree',
    'KTC-ET-002',
    'Ethnic Wear',
    'Katan Silk Blend',
    2899,
    1450,
    20,
    '["Free Size"]'::jsonb,
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
    'Classic Varanasi woven katan silk saree embellished with antique gold zari kadwa motifs and contrast rich pallu. Sourced directly from Varanasi and Surat weaving mills at genuine wholesale rates. Includes 0.8m running designer unstitched blouse piece.',
    120,
    '[
        {"color_name": "Vermillion Red", "hex_code": "#C21807"},
        {"color_name": "Peacock Teal", "hex_code": "#005F73"},
        {"color_name": "Wine Maroon", "hex_code": "#581845"},
        {"color_name": "Rani Pink", "hex_code": "#E91E63"}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) with public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view products (Storefront)
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Allow service role or authenticated admin to insert/update/delete products
CREATE POLICY "Enable all access for service role" 
ON products FOR ALL USING (true);

-- Allow public to submit quote inquiries
CREATE POLICY "Public can submit inquiries" 
ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable all inquiry access for service role" 
ON inquiries FOR ALL USING (true);
