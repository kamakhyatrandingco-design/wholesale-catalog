import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { listFiles, getFile } from '@/app/lib/github';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PRODUCTS_DIR = 'content/products';
const DELETED_REGISTRY_FILE = path.join(process.cwd(), 'content/deleted-products.json');

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

export async function GET() {
  const deletedSet = getDeletedIds();

  // Option A: If GITHUB_TOKEN is configured, fetch live from GitHub
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
            ...data,
            body: content,
          };
        })
      );

      const validProducts = products.filter(Boolean).filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
      if (validProducts.length > 0) {
        return NextResponse.json(validProducts);
      }
    } catch (err) {
      console.warn("GitHub fetch failed, falling back to local files:", err.message);
    }
  }

  // Option B: Fallback to reading bundled markdown files (always works on Netlify/Vercel)
  try {
    const localDir = path.join(process.cwd(), 'content/products');
    if (fs.existsSync(localDir)) {
      const files = fs.readdirSync(localDir);
      const products = files
        .filter((fn) => fn.endsWith('.md'))
        .map((fileName) => {
          const filePath = path.join(localDir, fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          return {
            id: fileName.replace('.md', ''),
            slug: fileName.replace('.md', ''),
            ...data,
            body: content,
          };
        })
        .filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
      return NextResponse.json(products);
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load products: ' + error.message },
      { status: 500 }
    );
  }
}