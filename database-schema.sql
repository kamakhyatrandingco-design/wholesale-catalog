-- ==============================================================================
-- Kamakhya Trading Co (KTC) - Free Serverless PostgreSQL / Supabase Schema
-- Run this script in the Supabase SQL Editor
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

-- 3. Customer Sign-ups & Buyer Directory Table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gstin TEXT,
    account_type TEXT DEFAULT 'retail',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 4. Seed Initial Demo Product (Only 1 real demo item, no fake mill claims)
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
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    retail_price = EXCLUDED.retail_price,
    wholesale_price = EXCLUDED.wholesale_price,
    moq = EXCLUDED.moq;

-- 5. Enable Row Level Security (RLS) & Allow Clean API Access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Full access products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Full access products" ON products FOR ALL USING (true);

-- Inquiries Policies
DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Full access inquiries" ON inquiries;
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Full access inquiries" ON inquiries FOR ALL USING (true);

-- Customers Policies
DROP POLICY IF EXISTS "Public read customers" ON customers;
DROP POLICY IF EXISTS "Full access customers" ON customers;
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Full access customers" ON customers FOR ALL USING (true);
