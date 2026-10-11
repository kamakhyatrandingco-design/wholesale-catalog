import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Storefront from './Storefront';

export default function Home() {
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