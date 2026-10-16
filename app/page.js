import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Storefront from './Storefront';
import { getDbProducts, isDatabaseConfigured } from './lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Try cloud database (Supabase / Neon Postgres) first
  if (isDatabaseConfigured()) {
    try {
      const dbProducts = await getDbProducts();
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        return <Storefront products={dbProducts} />;
      }
    } catch (err) {
      console.warn("Cloud DB fetch in page.js fallback:", err.message);
    }
  }

  // 2. Fallback to reading bundled catalog (1 demo product)
  const productsDirectory = path.join(process.cwd(), 'content/products');
  let products = [];

  try {
    if (fs.existsSync(productsDirectory)) {
      const filenames = fs.readdirSync(productsDirectory);
      
      products = filenames
        .filter((filename) => filename.endsWith('.md'))
        .map((filename) => {
          const filePath = path.join(productsDirectory, filename);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContents);
          
          return {
            id: filename.replace('.md', ''),
            slug: filename.replace('.md', ''),
            ...data,
            description: data.description || content || '',
          };
        });
    }
  } catch (error) {
    console.error("Error reading products:", error);
  }

  return <Storefront products={products} />;
}