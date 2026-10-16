/**
 * Unified Serverless Database Adapter for Kamakhya Trading Co (KTC)
 * 
 * Supports:
 *  1. Supabase (Free Tier PostgreSQL + REST / SDK)
 *     - Env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *     - Env: SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY)
 *  2. Neon / Serverless PostgreSQL
 *     - Env: DATABASE_URL (or POSTGRES_URL)
 * 
 * When database is connected:
 *  - Real-time cloud persistence for products across all devices & serverless cold starts.
 *  - Admin portal can add, update, and delete products without read-only filesystem issues.
 *  - Free tier: 100% free forever (500MB+ storage, 50,000+ monthly requests).
 * 
 * When database is not configured yet:
 *  - Graceful fallback to bundled catalog (1 demo product) with zero errors.
 */

import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';

// 1. Connection Detection
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn('[DB] Supabase initialization failed:', err.message);
  }
}

let neonSql = null;
if (DATABASE_URL && (DATABASE_URL.startsWith('postgres://') || DATABASE_URL.startsWith('postgresql://'))) {
  try {
    neonSql = neon(DATABASE_URL);
  } catch (err) {
    console.warn('[DB] Neon initialization failed:', err.message);
  }
}

export function isDatabaseConfigured() {
  return Boolean(supabaseClient || neonSql);
}

export function getDatabaseProvider() {
  if (supabaseClient) return 'supabase';
  if (neonSql) return 'neon';
  return 'local';
}

// 2. Demo Seed Product (1 truthful demo product)
export const DEMO_PRODUCT = {
  id: 'banarasi-silk-saree',
  slug: 'banarasi-silk-saree',
  title: 'Heritage Katan Banarasi Silk Saree',
  sku: 'KTC-ET-002',
  category: 'Ethnic Wear',
  fabric: 'Katan Silk Blend',
  retail_price: 2899,
  wholesale_price: 1450,
  moq: 20,
  sizes: ['Free Size'],
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
  ai_model_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
  description: 'Classic Varanasi woven katan silk saree embellished with antique gold zari kadwa motifs and contrast rich pallu. Sourced directly from Varanasi and Surat weaving mills at genuine wholesale rates. Includes 0.8m running designer unstitched blouse piece.',
  stock: 120,
  color_variants: [
    { color_name: 'Vermillion Red', hex_code: '#C21807' },
    { color_name: 'Peacock Teal', hex_code: '#005F73' },
    { color_name: 'Wine Maroon', hex_code: '#581845' },
    { color_name: 'Rani Pink', hex_code: '#E91E63' }
  ]
};

// 3. Helper to normalize database rows to standard product object
function normalizeProductRow(row) {
  if (!row) return null;
  
  let sizes = row.sizes;
  if (typeof sizes === 'string') {
    try { sizes = JSON.parse(sizes); } catch { sizes = [sizes]; }
  }
  if (!Array.isArray(sizes) || sizes.length === 0) sizes = ['Free Size'];

  let colorVariants = row.color_variants;
  if (typeof colorVariants === 'string') {
    try { colorVariants = JSON.parse(colorVariants); } catch { colorVariants = []; }
  }
  if (!Array.isArray(colorVariants)) colorVariants = [];

  return {
    id: String(row.id || row.slug),
    slug: String(row.slug || row.id),
    title: row.title || 'Untitled Apparel',
    sku: row.sku || `KTC-${Date.now().toString().slice(-6)}`,
    category: row.category || 'Ethnic Wear',
    fabric: row.fabric || 'Pure Cotton',
    retail_price: Number(row.retail_price) || 0,
    wholesale_price: Number(row.wholesale_price) || 0,
    moq: Number(row.moq) || 1,
    sizes,
    image: row.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    ai_model_image: row.ai_model_image || row.image || '',
    description: row.description || '',
    stock: row.stock !== undefined ? Number(row.stock) : 120,
    color_variants: colorVariants,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  };
}

// 4. Products Operations
export async function getDbProducts() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[DB:Supabase] Products query error:', error.message);
        return null;
      }

      if (!data || data.length === 0) {
        // Auto-seed demo product if table is empty
        await saveDbProduct(DEMO_PRODUCT);
        return [DEMO_PRODUCT];
      }

      return data.map(normalizeProductRow);
    } catch (err) {
      console.warn('[DB:Supabase] Error:', err.message);
      return null;
    }
  }

  if (neonSql) {
    try {
      const rows = await neonSql`SELECT * FROM products ORDER BY created_at DESC;`;
      if (!rows || rows.length === 0) {
        await saveDbProduct(DEMO_PRODUCT);
        return [DEMO_PRODUCT];
      }
      return rows.map(normalizeProductRow);
    } catch (err) {
      console.warn('[DB:Neon] Products query error:', err.message);
      return null;
    }
  }

  return null;
}

export async function saveDbProduct(product) {
  const slug = product.slug || product.id || `product-${Date.now()}`;
  const id = product.id || slug;

  const payload = {
    id,
    slug,
    title: product.title || 'Untitled Apparel',
    sku: product.sku || `KTC-${Date.now().toString().slice(-6)}`,
    category: product.category || 'Ethnic Wear',
    fabric: product.fabric || 'Pure Cotton',
    retail_price: Number(product.retail_price) || 0,
    wholesale_price: Number(product.wholesale_price) || 0,
    moq: Number(product.moq) || 1,
    sizes: Array.isArray(product.sizes) ? product.sizes : ['Free Size'],
    image: product.image || DEMO_PRODUCT.image,
    ai_model_image: product.ai_model_image || product.image || '',
    description: product.description || '',
    stock: product.stock !== undefined ? Number(product.stock) : 120,
    color_variants: Array.isArray(product.color_variants) ? product.color_variants : [],
    updated_at: new Date().toISOString()
  };

  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase save error: ${error.message}`);
    }
    return normalizeProductRow(data || payload);
  }

  if (neonSql) {
    await neonSql`
      INSERT INTO products (
        id, slug, title, sku, category, fabric, retail_price, wholesale_price,
        moq, sizes, image, ai_model_image, description, stock, color_variants, updated_at
      ) VALUES (
        ${payload.id}, ${payload.slug}, ${payload.title}, ${payload.sku}, ${payload.category},
        ${payload.fabric}, ${payload.retail_price}, ${payload.wholesale_price}, ${payload.moq},
        ${JSON.stringify(payload.sizes)}, ${payload.image}, ${payload.ai_model_image},
        ${payload.description}, ${payload.stock}, ${JSON.stringify(payload.color_variants)},
        ${payload.updated_at}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        sku = EXCLUDED.sku,
        category = EXCLUDED.category,
        fabric = EXCLUDED.fabric,
        retail_price = EXCLUDED.retail_price,
        wholesale_price = EXCLUDED.wholesale_price,
        moq = EXCLUDED.moq,
        sizes = EXCLUDED.sizes,
        image = EXCLUDED.image,
        ai_model_image = EXCLUDED.ai_model_image,
        description = EXCLUDED.description,
        stock = EXCLUDED.stock,
        color_variants = EXCLUDED.color_variants,
        updated_at = EXCLUDED.updated_at;
    `;
    return payload;
  }

  throw new Error('No database configured');
}

export async function deleteDbProduct(id) {
  if (!id) return false;

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`);
    }
    return true;
  }

  if (neonSql) {
    await neonSql`
      DELETE FROM products WHERE id = ${id} OR slug = ${id};
    `;
    return true;
  }

  return false;
}

// 5. Customer Inquiries & Wholesale Quotes
export async function saveDbInquiry(inquiry) {
  const payload = {
    id: inquiry.id || `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    customer_name: inquiry.customer_name || inquiry.name || 'Anonymous Merchant',
    business_name: inquiry.business_name || '',
    phone: inquiry.phone || '',
    gstin: inquiry.gstin || '',
    purchase_mode: inquiry.purchase_mode || 'wholesale',
    items: inquiry.items || [],
    notes: inquiry.notes || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn('[DB:Supabase] Save inquiry warning:', error.message);
      return payload;
    }
    return data;
  }

  if (neonSql) {
    try {
      await neonSql`
        INSERT INTO inquiries (
          id, customer_name, business_name, phone, gstin, purchase_mode, items, notes, status, created_at
        ) VALUES (
          ${payload.id}, ${payload.customer_name}, ${payload.business_name}, ${payload.phone},
          ${payload.gstin}, ${payload.purchase_mode}, ${JSON.stringify(payload.items)},
          ${payload.notes}, ${payload.status}, ${payload.created_at}
        );
      `;
    } catch (err) {
      console.warn('[DB:Neon] Save inquiry warning:', err.message);
    }
    return payload;
  }

  return payload;
}
