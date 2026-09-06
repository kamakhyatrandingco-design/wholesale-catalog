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
      
      products = filenames.map((filename) => {
        const filePath = path.join(productsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          id: filename.replace('.md', ''),
          ...data,
        };
      });
    }
  } catch (error) {
    console.error("Error reading products:", error);
  }

  return <Storefront products={products} />;
}