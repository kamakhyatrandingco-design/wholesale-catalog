import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

const PRODUCTS_DIR = path.join(process.cwd(), 'content/products');

// Helper to sanitize slug
function createSlug(title, sku) {
  const base = (title || sku || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return base || `product-${Date.now()}`;
}

// GET all products
export async function GET() {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(PRODUCTS_DIR);
    const products = files
      .filter((f) => f.endsWith('.md'))
      .map((fileName) => {
        const filePath = path.join(PRODUCTS_DIR, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          id: fileName.replace('.md', ''),
          slug: fileName.replace('.md', ''),
          ...data,
          description: data.description || content || '',
        };
      });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new product
export async function POST(req) {
  try {
    const product = await req.json();
    const slug = product.slug || createSlug(product.title, product.sku);
    const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      // If slug exists, append timestamp
      const uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      return saveProduct(uniqueSlug, product);
    }

    return saveProduct(slug, product);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update existing product
export async function PUT(req) {
  try {
    const product = await req.json();
    const slug = product.id || product.slug;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Product slug/id is required" }, { status: 400 });
    }

    return saveProduct(slug, product);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Product id is required" }, { status: 400 });
    }

    const filePath = path.join(PRODUCTS_DIR, `${id}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: "Product deleted successfully" });
    }

    return NextResponse.json({ success: false, error: "Product file not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function saveProduct(slug, product) {
  osEnsureDir(PRODUCTS_DIR);
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);

  const frontMatter = {
    title: product.title || 'Untitled Apparel',
    sku: product.sku || `KTC-${Date.now().toString().slice(-6)}`,
    category: product.category || 'Ethnic Wear',
    fabric: product.fabric || 'Cotton Blend',
    retail_price: Number(product.retail_price) || 0,
    wholesale_price: Number(product.wholesale_price) || 0,
    moq: Number(product.moq) || 30,
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['Free Size'],
    image: product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    ai_model_image: product.ai_model_image || '',
    description: product.description || '',
    color_variants: Array.isArray(product.color_variants) ? product.color_variants : [],
  };

  const fileContent = matter.stringify(product.description || '', frontMatter);
  fs.writeFileSync(filePath, fileContent, 'utf8');

  return NextResponse.json({
    success: true,
    message: "Product saved successfully",
    product: { id: slug, slug, ...frontMatter },
  });
}

function osEnsureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
