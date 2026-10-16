import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { listFiles, getFile } from '@/app/lib/github';
import { getDbProducts, isDatabaseConfigured } from '@/app/lib/db';

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

  // Tier 1: Cloud Database (Supabase / Neon Postgres) - Real-time & persistent across all devices
  if (isDatabaseConfigured()) {
    try {
      const dbProducts = await getDbProducts();
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        const filtered = dbProducts.filter(p => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
        return NextResponse.json(filtered);
      }
    } catch (dbErr) {
      console.warn('[API/products] Cloud database fetch fallback:', dbErr.message);
    }
  }

  // Tier 2: GitHub API (if GITHUB_TOKEN is configured)
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

  // Tier 3: Bundled Markdown Files (Always works on initial deployment with 1 demo product)
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