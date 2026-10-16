import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { listFiles, getFile, putFile, deleteFile } from '@/app/lib/github';
import { getDbProducts, saveDbProduct, deleteDbProduct, isDatabaseConfigured, getDatabaseProvider } from '@/app/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PRODUCTS_DIR = 'content/products';
const LOCAL_PRODUCTS_DIR = path.join(process.cwd(), 'content/products');
const DELETED_REGISTRY_FILE = path.join(process.cwd(), 'content/deleted-products.json');

// Persistent deleted products tracking
function getDeletedIds() {
  try {
    if (fs.existsSync(DELETED_REGISTRY_FILE)) {
      const raw = fs.readFileSync(DELETED_REGISTRY_FILE, 'utf8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

function recordDeletedId(id) {
  try {
    const set = getDeletedIds();
    set.add(id);
    fs.writeFileSync(DELETED_REGISTRY_FILE, JSON.stringify(Array.from(set), null, 2), 'utf8');
  } catch {}
}

function removeDeletedId(id) {
  try {
    const set = getDeletedIds();
    set.delete(id);
    fs.writeFileSync(DELETED_REGISTRY_FILE, JSON.stringify(Array.from(set), null, 2), 'utf8');
  } catch {}
}

// Helper to sanitize slug
function createSlug(title, sku) {
  const base = (title || sku || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return base || `product-${Date.now()}`;
}

// GET all products: Cloud DB first -> GitHub API second -> Local file fallback third
export async function GET() {
  const deletedSet = getDeletedIds();

  // Tier 1: Cloud Database (Supabase / Neon Postgres)
  if (isDatabaseConfigured()) {
    try {
      const dbProducts = await getDbProducts();
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        const valid = dbProducts.filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
        return NextResponse.json({
          success: true,
          provider: getDatabaseProvider(),
          products: valid
        });
      }
    } catch (dbErr) {
      console.warn("[Admin API] Cloud database fetch error:", dbErr.message);
    }
  }

  // Tier 2: GitHub API
  if (process.env.GITHUB_TOKEN) {
    try {
      const files = await listFiles(PRODUCTS_DIR);
      const mdFiles = files.filter((f) => f.name.endsWith('.md'));

      const products = await Promise.all(
        mdFiles.map(async (file) => {
          const result = await getFile(file.path);
          if (!result) return null;

          const { data, content } = matter(result.content);
          return {
            id: file.name.replace('.md', ''),
            slug: file.name.replace('.md', ''),
            _sha: result.sha,
            ...data,
            description: data.description || content || '',
          };
        })
      );

      const validProducts = products.filter(Boolean).filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
      if (validProducts.length > 0) {
        return NextResponse.json({
          success: true,
          provider: 'github',
          products: validProducts
        });
      }
    } catch (err) {
      console.warn("GitHub admin products fetch failed, using local fallback:", err.message);
    }
  }

  // Tier 3: Local fallback (works on dev and read-only serverless bundles with 1 demo product)
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_DIR)) {
      const files = fs.readdirSync(LOCAL_PRODUCTS_DIR);
      const products = files
        .filter((f) => f.endsWith('.md'))
        .map((fileName) => {
          const filePath = path.join(LOCAL_PRODUCTS_DIR, fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          return {
            id: fileName.replace('.md', ''),
            slug: fileName.replace('.md', ''),
            ...data,
            description: data.description || content || '',
          };
        })
        .filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));

      return NextResponse.json({
        success: true,
        provider: 'local',
        products
      });
    }
    return NextResponse.json({ success: true, provider: 'local', products: [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(req) {
  try {
    const product = await req.json();
    let slug = product.slug || createSlug(product.title, product.sku);

    return await handleSave(slug, product);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update existing product
export async function PUT(req) {
  try {
    const product = await req.json();
    const slug = product.id || product.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Product slug/id is required' },
        { status: 400 }
      );
    }

    return await handleSave(slug, product);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required' },
        { status: 400 }
      );
    }

    // 1. Record in persistent deleted registry
    recordDeletedId(id);

    // 2. Delete from Cloud Database (Supabase / Neon Postgres)
    let dbDeleted = false;
    if (isDatabaseConfigured()) {
      try {
        dbDeleted = await deleteDbProduct(id);
      } catch (dbErr) {
        console.warn("[Admin API] DB delete error:", dbErr.message);
      }
    }

    // 3. Try GitHub API if configured
    let gitDeleted = false;
    if (process.env.GITHUB_TOKEN) {
      try {
        const filePath = `${PRODUCTS_DIR}/${id}.md`;
        const existing = await getFile(filePath);
        if (existing) {
          await deleteFile(filePath, existing.sha, `delete: remove product ${id} from catalog`);
          gitDeleted = true;
        }
      } catch (err) {
        console.warn("GitHub delete failed:", err.message);
      }
    }

    // 4. Local file deletion fallback
    try {
      const localFilePath = path.join(LOCAL_PRODUCTS_DIR, `${id}.md`);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (fsErr) {
      console.warn("Local filesystem delete note:", fsErr.message);
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
      dbDeleted,
      gitDeleted,
      message: `Product '${id}' removed permanently from catalog.`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handleSave(slug, product) {
  // If product was previously deleted, unblock it
  removeDeletedId(slug);
  if (product.id) removeDeletedId(product.id);

  const frontMatter = {
    title: product.title || 'Untitled Apparel',
    sku: product.sku || `KTC-${Date.now().toString().slice(-6)}`,
    category: product.category || 'Ethnic Wear',
    fabric: product.fabric || 'Cotton Blend',
    retail_price: Number(product.retail_price) || 0,
    wholesale_price: Number(product.wholesale_price) || 0,
    moq: Number(product.moq) || 1,
    sizes:
      Array.isArray(product.sizes) && product.sizes.length
        ? product.sizes
        : ['Free Size'],
    image:
      product.image ||
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    ai_model_image: product.ai_model_image || product.image || '',
    description: product.description || '',
    stock: product.stock !== undefined ? Number(product.stock) : 120,
    color_variants: Array.isArray(product.color_variants)
      ? product.color_variants
      : [],
  };

  const productObject = { id: slug, slug, ...frontMatter };

  // Tier 1: Cloud Database (Supabase / Neon Postgres)
  let savedToDb = false;
  if (isDatabaseConfigured()) {
    try {
      const saved = await saveDbProduct(productObject);
      savedToDb = true;
      return NextResponse.json({
        success: true,
        savedToDb: true,
        provider: getDatabaseProvider(),
        message: 'Product saved successfully to Cloud Database!',
        product: saved || productObject
      });
    } catch (dbErr) {
      console.warn("[Admin API] Database save failed, attempting fallbacks:", dbErr.message);
    }
  }

  // Tier 2: GitHub API commit
  const fileContent = matter.stringify(product.description || '', frontMatter);
  if (process.env.GITHUB_TOKEN) {
    try {
      const filePath = `${PRODUCTS_DIR}/${slug}.md`;
      const existing = await getFile(filePath);
      const sha = existing ? existing.sha : null;
      const action = sha ? 'update' : 'add';
      const commitMessage = `${action}: ${frontMatter.title} (${frontMatter.sku}) in catalog`;

      await putFile(filePath, fileContent, commitMessage, sha);

      return NextResponse.json({
        success: true,
        gitSynced: true,
        message: 'Product saved and committed to GitHub repository!',
        product: productObject,
      });
    } catch (err) {
      console.warn("GitHub commit failed, trying local save:", err.message);
    }
  }

  // Tier 3: Local filesystem write (if writable)
  try {
    if (!fs.existsSync(LOCAL_PRODUCTS_DIR)) {
      fs.mkdirSync(LOCAL_PRODUCTS_DIR, { recursive: true });
    }
    const localFilePath = path.join(LOCAL_PRODUCTS_DIR, `${slug}.md`);
    fs.writeFileSync(localFilePath, fileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Product saved successfully to catalog',
      product: productObject,
    });
  } catch (fsErr) {
    // If read-only filesystem (EROFS on Netlify/Vercel) and no database configured:
    return NextResponse.json({
      success: true,
      clientSync: true,
      message: 'Product saved to active browser catalog! (Tip: Connect free Supabase DB for instant cloud sync)',
      product: productObject,
    });
  }
}
