'use client';
import { useState, useEffect } from 'react';
import WhatsAppButton from './components/WhatsAppButton';

// FIX: We moved the individual product into its own component so React can track its state properly.
function ProductCard({ product }) {
  const [activeImg, setActiveImg] = useState(product.image);

  const getRecoloredImage = (baseUrl, hexCode) => {
    if (!hexCode || !baseUrl.includes('cloudinary')) return baseUrl;
    const cleanHex = hexCode.replace('#', '');
    return baseUrl.replace('/upload/', `/upload/e_gen_recolor:prompt_clothing;to-color_${cleanHex}/`);
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <img src={activeImg} alt={product.title} className="w-full h-96 object-cover rounded-lg mb-4" />
      
      {product.color_variants && (
        <div className="flex gap-3 mb-4">
          {product.color_variants.map(variant => (
            <button 
              key={variant.color_name} 
              onClick={() => setActiveImg(getRecoloredImage(product.image, variant.hex_code))}
              className="w-8 h-8 rounded-full border-2 shadow-sm"
              style={{ backgroundColor: variant.hex_code || '#ddd' }}
              title={variant.color_name}
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
      
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
        <span className="font-bold text-lg">₹{product.price}/pc</span>
        <span className="text-sm font-medium text-red-600">MOQ: {product.moq} Sets</span>
      </div>
      
      <WhatsAppButton title={product.title} sku={product.sku} moq={product.moq} />
    </div>
  );
}

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([
      {
        title: "Heavy Silk Kurti Demo", 
        sku: "SK-102", 
        price: 1200, 
        moq: 12,
        image: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
        color_variants: [
          { color_name: "Original", hex_code: "" },
          { color_name: "Extracted Blue Swatch", hex_code: "#1a5276" },
          { color_name: "Extracted Pink Swatch", hex_code: "#E91E63" }
        ]
      }
    ]);
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">{process.env.NEXT_PUBLIC_SHOP_NAME || "Wholesale Portal"}</h1>
        <p className="text-gray-600 mt-2">B2B Wholesale Portal</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </main>
  );
}