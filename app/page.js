'use client';
import { useState, useEffect } from 'react';
import WhatsAppButton from './components/WhatsAppButton';

function ProductCard({ product }) {
  const [activeImg, setActiveImg] = useState(product.image);
  // NEW: We added states to track if the AI is processing the image
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getRecoloredImage = (baseUrl, hexCode) => {
    if (!hexCode || !baseUrl.includes('cloudinary')) return baseUrl;
    const cleanHex = hexCode.replace('#', '');
    return baseUrl.replace('/upload/', `/upload/e_gen_recolor:prompt_clothing;to-color_${cleanHex}/`);
  };

  const handleColorChange = (hexCode) => {
    setIsLoading(true);
    setHasError(false);
    setActiveImg(getRecoloredImage(product.image, hexCode));
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-5 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      
      {/* NEW: Image Container with Loading Spinner overlay */}
      <div className="relative w-full h-[400px] mb-6 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        
        {/* The Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-semibold text-gray-700 animate-pulse">Applying AI Color...</p>
          </div>
        )}

        {/* The Image */}
        <img 
          src={hasError ? product.image : activeImg} 
          alt={product.title} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
      
      {/* Color Selection Buttons */}
      {product.color_variants && (
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Colors</p>
          <div className="flex gap-3">
            {product.color_variants.map(variant => (
              <button 
                key={variant.color_name} 
                onClick={() => handleColorChange(variant.hex_code)}
                className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400`}
                style={{ backgroundColor: variant.hex_code || '#f3f4f6', borderColor: '#e5e7eb' }}
                title={variant.color_name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Details (Forced dark text for readability) */}
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.title}</h2>
      <p className="text-sm text-gray-500 mb-4 font-medium">SKU: {product.sku}</p>
      
      <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 border border-gray-100 rounded-lg">
        <span className="font-extrabold text-2xl text-gray-900">₹{product.price}<span className="text-sm font-normal text-gray-500">/pc</span></span>
        <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">MOQ: {product.moq} Sets</span>
      </div>
      
      <WhatsAppButton title={product.title} sku={product.sku} moq={product.moq} />
    </div>
  );
}

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Replaced the flower image with a sample fashion image
    setProducts([
      {
        title: "Heavy Silk Kurti Demo", 
        sku: "SK-102", 
        price: 1200, 
        moq: 12,
        image: "https://res.cloudinary.com/demo/image/upload/v1/docs/casual-jacket.jpg",
        color_variants: [
          { color_name: "Original", hex_code: "" },
          { color_name: "Deep Blue", hex_code: "#1a5276" },
          { color_name: "Ruby Pink", hex_code: "#E91E63" }
        ]
      }
    ]);
  }, []);

  return (
    // Forced a clean light background for the whole page
    <main className="min-h-screen bg-slate-50 text-gray-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            {process.env.NEXT_PUBLIC_SHOP_NAME || "Wholesale Portal"}
          </h1>
          <p className="text-lg text-gray-500 font-medium">Exclusive B2B Catalog & Ordering</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}