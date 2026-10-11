import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { listFiles, getFile } from '@/app/lib/github';

const PRODUCTS_DIR = 'content/products';

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
          ...data,
          body: content,
        };
      })
    );

    return NextResponse.json(products.filter(Boolean));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load products: ' + error.message },
      { status: 500 }
    );
  }
}