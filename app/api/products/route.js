import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productsDir = path.join(process.cwd(), 'content/products');
    
    if (!fs.existsSync(productsDir)) {
      return NextResponse.json([]); 
    }

    const files = fs.readdirSync(productsDir);
    const products = files.filter(fn => fn.endsWith('.md')).map((fileName) => {
      const filePath = path.join(productsDir, fileName);
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products: " + error.message }, { status: 500 });
  }
}