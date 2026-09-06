'use client';
import { useState } from 'react';

const WHATSAPP_NUMBER = "916350626582";

export default function Storefront({ products }) {
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeCategory, setActiveCategory] = useState("All Collection");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseMode, setPurchaseMode] = useState("wholesale"); // 'wholesale' or 'retail'

  const CATEGORIES = ["All Collection", "Ethnic Wear", "Western Wear", "Girls Partywear", "Bridal", "Loungewear"];

  // Filter products based on live CMS data
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All Collection" || product.category === activeCategory;
    const matchesSearch = (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 relative">
      
      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi Kamakhya Trading Co! I have an inquiry.")}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1EBE5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => {setActiveCategory("All Collection"); setSearchQuery("");}}>
              <span className="font-black text-2xl tracking-tighter uppercase">Kamakhya <span className="text-gray-400">B2B</span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-black text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" alt="Fashion" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center mt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 uppercase">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Inventory</span>
          </h1>
        </div>
      </div>

      {/* RETAIL vs WHOLESALE TOGGLE SWITCH */}
      <div className="flex justify-center mt-10 mb-4 px-4">
        <div className="bg-gray-200 p-1.5 rounded-full flex space-x-1 shadow-inner">
          <button 
            onClick={() => setPurchaseMode('retail')}
            className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${purchaseMode === 'retail' ? 'bg-white shadow-md text-black scale-105' : 'text-gray-500 hover:text-black'}`}
          >
            Retail (Single Piece)
          </button>
          <button 
            onClick={() => setPurchaseMode('wholesale')}
            className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${purchaseMode === 'wholesale' ? 'bg-black shadow-md text-white scale-105' : 'text-gray-500 hover:text-black'}`}
          >
            Wholesale (Bulk Order)
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide text-sm font-bold text-gray-400 uppercase tracking-widest">
          {CATEGORIES.map(category => (
            <button 
              key={category} onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Add products in your Admin Portal to see them here!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => {
            const isWholesale = purchaseMode === 'wholesale';
            const displayPrice = isWholesale ? product.wholesale_price : (product.retail_price || product.wholesale_price);
            const displayMoq = isWholesale ? (product.moq || 1) : 1;
            
            const colors = product.color_variants || [];
            const activeColorIndex = selectedColors[product.id] || 0;
            const activeColor = colors[activeColorIndex];

            const sizes = product.sizes || [];
            const activeSize = selectedSizes[product.id] || sizes[0];
            
            const imageSrc = product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800";

            const productMessage = `Hi Kamakhya Trading Co!\n\nI want to place a *${isWholesale ? 'Wholesale' : 'Retail'} Order*:\n\n*${product.title}*\nSKU: ${product.sku}\nColor: ${activeColor ? activeColor.color_name : 'Default'}\nSize: ${activeSize || 'Standard'}\nPrice: ₹${displayPrice}/pc\nQuantity: ${displayMoq} pcs\n\nPlease send me an invoice.`;
            const productWaUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(productMessage)}`;

            return (
              <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                
                {/* IMAGE */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-black uppercase tracking-wider rounded-sm shadow-sm">
                    {isWholesale ? `MOQ: ${displayMoq}` : 'Single Piece'}
                  </div>
                  <img src={imageSrc} alt={product.title} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  {activeColor && (
                    <div className="absolute inset-0 z-10 transition-colors duration-300 mix-blend-multiply opacity-80 pointer-events-none" style={{ backgroundColor: activeColor.hex_code === '#FFFFFF' ? 'transparent' : activeColor.hex_code }} />
                  )}
                </div>

                {/* DETAILS */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  {/* SIZES */}
                  {sizes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex space-x-2 flex-wrap gap-y-2">
                        {sizes.map(size => (
                          <button 
                            key={size} onClick={(e) => { e.stopPropagation(); setSelectedSizes({ ...selectedSizes, [product.id]: size }); }}
                            className={`px-3 py-1 text-xs font-bold border rounded-md transition-all ${activeSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COLORS */}
                  {colors.length > 0 && (
                    <div className="mb-4 flex space-x-2 flex-wrap gap-y-2">
                      {colors.map((color, idx) => (
                        <button
                          key={color.color_name} onClick={(e) => { e.stopPropagation(); setSelectedColors({ ...selectedColors, [product.id]: idx }); }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${activeColorIndex === idx ? 'border-black scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                          style={{ backgroundColor: color.hex_code }} title={color.color_name}
                        />
                      ))}
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{product.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{product.sku}</p>
                  
                  <div className="mt-auto flex items-end justify-between mb-6">
                    <div>
                      <span className="text-2xl font-black text-gray-900">₹{displayPrice}</span>
                      <span className="text-sm text-gray-500 ml-1 font-semibold">/ pc</span>
                    </div>
                  </div>

                  <a href={productWaUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 shadow-lg">
                    <span>Order on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}