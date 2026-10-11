import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { listFiles, getFile } from '@/app/lib/github';

const PRODUCTS_DIR = 'content/products';

export async function GET() {
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

      const validProducts = products.filter(Boolean);
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
        });
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