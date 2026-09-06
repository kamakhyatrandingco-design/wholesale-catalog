'use client';
import { useState } from 'react';

// CENTRALIZED WHATSAPP ROUTING
const WHATSAPP_NUMBER = "916350626582"; // ⚠️ REPLACE WITH YOUR ACTUAL NUMBER
const openWhatsApp = (message) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

const mockProducts = [
  {
    id: 1,
    title: "Premium Heavyweight Oversized Tee",
    sku: "TSHIRT-BLK-001",
    price: 499,
    moq: 50,
    category: "Oversized Fits",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", 
    colors: [
      { name: "Arctic White", hex: "#FFFFFF" },
      { name: "Midnight Black", hex: "#222222" },
      { name: "Olive Drab", hex: "#4B5320" },
      { name: "Dusty Rose", hex: "#DCAE96" }
    ]
  },
  {
    id: 2,
    title: "Luxury Drop-Shoulder Hoodie",
    sku: "HOODIE-LUX-099",
    price: 1150,
    moq: 30,
    category: "Winter Wear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    colors: [
      { name: "Stone Grey", hex: "#888B8D" },
      { name: "Navy Blue", hex: "#000080" }
    ]
  },
  {
    id: 3,
    title: "Classic Denim Trucker Jacket",
    sku: "JCKT-DNM-404",
    price: 850,
    moq: 20,
    category: "Denim",
    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0efa?auto=format&fit=crop&q=80&w=800",
    colors: [
      { name: "Vintage Wash", hex: "#759CB9" },
      { name: "Charcoal", hex: "#36454F" }
    ]
  },
  {
    id: 4,
    title: "Textured Knit Polo Shirt",
    sku: "POLO-KNT-777",
    price: 550,
    moq: 100,
    category: "Premium Knits",
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80&w=800",
    colors: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Forest Green", hex: "#228B22" }
    ]
  }
];

const CATEGORIES = ["All Collection", "Oversized Fits", "Winter Wear", "Premium Knits", "Denim"];

export default function Storefront() {
  const [selectedColors, setSelectedColors] = useState({});
  const [activeCategory, setActiveCategory] = useState("All Collection");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = activeCategory === "All Collection" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrder = (product) => {
    const activeColorIndex = selectedColors[product.id] || 0;
    const color = product.colors[activeColorIndex];
    const message = `Hi Kamakhya Trading Co!\n\nI want to order:\n*${product.title}*\nSKU: ${product.sku}\nColor: ${color.name}\nPrice: ₹${product.price}/pc\nMOQ: ${product.moq} pcs\n\nPlease send me an invoice.`;
    openWhatsApp(message);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 relative">
      
      {/* FLOATING WHATSAPP SUPPORT BUTTON */}
      <button 
        onClick={() => openWhatsApp("Hi! I have a general inquiry about your wholesale catalog.")}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1EBE5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
        title="Chat with us"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* TOP NAVBAR (Glassmorphism) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => {setActiveCategory("All Collection"); setSearchQuery("");}}>
              <span className="font-black text-2xl tracking-tighter uppercase">Kamakhya <span className="text-gray-400">B2B</span></span>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input 
                  type="text"
                  placeholder="Search by SKU or Product Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-full py-2.5 px-5 text-sm transition-all outline-none border-2"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-2.5 text-gray-400 hover:text-black">✕</button>
                )}
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex space-x-6 items-center font-semibold text-sm tracking-wide">
              <a href="#" className="text-black hover:text-gray-500 transition-colors">Catalog</a>
              <a href="mailto:contact@yourdomain.com" className="text-gray-500 hover:text-black transition-colors">Bulk Pricing</a>
              <button onClick={() => openWhatsApp("I'd like to partner with Kamakhya Trading Co.")} className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-black text-white py-20 px-6 sm:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" alt="Fashion Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center mt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 uppercase">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Inventory</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-light">
            Premium B2B wholesale apparel. Direct from the manufacturer. Uncompromising quality, unbeatable margins.
          </p>
        </div>
      </div>

      {/* DYNAMIC CATEGORY FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide text-sm font-bold text-gray-400 uppercase tracking-widest">
          {CATEGORIES.map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Empty State / No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">We couldn't find any products matching your search criteria.</p>
            <button onClick={() => {setSearchQuery(""); setActiveCategory("All Collection");}} className="mt-6 text-black underline font-semibold">Clear Filters</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => {
            const activeColorIndex = selectedColors[product.id] || 0;
            const activeColor = product.colors[activeColorIndex];

            return (
              <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => handleOrder(product)}>
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-black uppercase tracking-wider rounded-sm shadow-sm">
                    MOQ: {product.moq}
                  </div>
                  <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  {/* Instant Colorizer */}
                  <div className="absolute inset-0 z-10 transition-colors duration-300 mix-blend-multiply opacity-80 pointer-events-none" style={{ backgroundColor: activeColor.hex === '#FFFFFF' ? 'transparent' : activeColor.hex }} />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-3">
                      {product.colors.length} Colors
                    </p>
                    <div className="flex space-x-2 flex-wrap gap-y-2">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={(e) => { e.stopPropagation(); setSelectedColors({ ...selectedColors, [product.id]: idx }); }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${activeColorIndex === idx ? 'border-black scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{product.sku}</p>
                  
                  <div className="mt-auto flex items-end justify-between mb-6">
                    <div>
                      <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 ml-1 font-semibold">/ pc</span>
                    </div>
                  </div>

                  <button onClick={() => handleOrder(product)} className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}