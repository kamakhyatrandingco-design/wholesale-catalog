import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { listFiles, getFile, putFile, deleteFile } from '@/app/lib/github';

const PRODUCTS_DIR = 'content/products';

// Helper to sanitize slug
function createSlug(title, sku) {
  const base = (title || sku || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return base || `product-${Date.now()}`;
}

// GET all products — reads from GitHub API (works on read-only serverless)
export async function GET() {
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

    return NextResponse.json({
      success: true,
      products: products.filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new product — commits a new .md file to the repo
export async function POST(req) {
  try {
    const product = await req.json();
    let slug = product.slug || createSlug(product.title, product.sku);
    const filePath = `${PRODUCTS_DIR}/${slug}.md`;

    // Check if slug already exists
    const existing = await getFile(filePath);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await saveProduct(slug, product);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update existing product — updates the .md file in the repo
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

    return await saveProduct(slug, product);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product — removes the .md file from the repo
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

    const filePath = `${PRODUCTS_DIR}/${id}.md`;
    const existing = await getFile(filePath);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product file not found' },
        { status: 404 }
      );
    }

    await deleteFile(
      filePath,
      existing.sha,
      `delete: remove product ${id} from catalog`
    );

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function saveProduct(slug, product) {
  const filePath = `${PRODUCTS_DIR}/${slug}.md`;

  const frontMatter = {
    title: product.title || 'Untitled Apparel',
    sku: product.sku || `KTC-${Date.now().toString().slice(-6)}`,
    category: product.category || 'Ethnic Wear',
    fabric: product.fabric || 'Cotton Blend',
    retail_price: Number(product.retail_price) || 0,
    wholesale_price: Number(product.wholesale_price) || 0,
    moq: Number(product.moq) || 30,
    sizes:
      Array.isArray(product.sizes) && product.sizes.length
        ? product.sizes
        : ['Free Size'],
    image:
      product.image ||
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    ai_model_image: product.ai_model_image || '',
    description: product.description || '',
    color_variants: Array.isArray(product.color_variants)
      ? product.color_variants
      : [],
  };

  const fileContent = matter.stringify(product.description || '', frontMatter);

  // Check if file already exists (to get sha for update)
  const existing = await getFile(filePath);
  const sha = existing ? existing.sha : null;
  const action = sha ? 'update' : 'add';
  const commitMessage = `${action}: ${frontMatter.title} (${frontMatter.sku}) in catalog`;

  await putFile(filePath, fileContent, commitMessage, sha);

  return NextResponse.json({
    success: true,
    message: 'Product saved successfully',
    product: { id: slug, slug, ...frontMatter },
  });
}
