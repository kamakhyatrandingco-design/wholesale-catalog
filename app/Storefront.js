'use client';

import { useState, useMemo, useEffect } from 'react';

const WHATSAPP_NUMBER = "916350626582";
const SHOP_NAME = "Kamakhya Trading Co";

// High definition curated model photography for each category
const CATEGORY_MODEL_FALLBACKS = {
  "Ethnic Wear": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
  "Western Wear": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
  "Girls Partywear": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
  "Bridal": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
  "Loungewear": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
  "Default": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000"
};

export default function Storefront({ products = [] }) {
  // State for selections and filters
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseMode, setPurchaseMode] = useState("wholesale"); // 'wholesale' | 'retail'
  const [aiViewModel, setAiViewModel] = useState({}); // toggle product view: catalog vs ai model
  const [sortBy, setSortBy] = useState("default");

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Bulk Purchase Order (PO) Bag / Quote Drawer
  const [quoteItems, setQuoteItems] = useState([]);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // AI Try-On Studio Modal
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [studioSelectedProduct, setStudioSelectedProduct] = useState(null);
  const [studioModelType, setStudioModelType] = useState("traditional");
  const [isGeneratingTryon, setIsGeneratingTryon] = useState(false);
  const [tryonResultImage, setTryonResultImage] = useState(null);

  const CATEGORIES = [
    "All Collections",
    "Ethnic Wear",
    "Western Wear",
    "Girls Partywear",
    "Bridal",
    "Loungewear"
  ];

  // Initialize defaults for studio
  useEffect(() => {
    if (products.length > 0 && !studioSelectedProduct) {
      setStudioSelectedProduct(products[0]);
    }
  }, [products, studioSelectedProduct]);

  // AI Natural Language Search & Filter Logic
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // 1. Natural Language Price Extraction (e.g., 'under 800', 'below 1000', '< 600')
    let maxPrice = Infinity;
    const priceMatch = query.match(/(?:under|below|<|less than|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // Clean query text without the price constraint phrase
    const cleanQuery = query.replace(/(?:under|below|<|less than|max)\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '').trim();

    const filtered = products.filter((product) => {
      // Category match
      const matchesCategory =
        activeCategory === "All Collections" || product.category === activeCategory;

      // Price filter based on current mode
      const currentPrice = purchaseMode === 'wholesale'
        ? Number(product.wholesale_price || 0)
        : Number(product.retail_price || product.wholesale_price || 0);
      const matchesPrice = currentPrice <= maxPrice;

      // Keyword / Intent matching (Title, SKU, Category, Fabric, Sizes, Color Names)
      const colorNames = (product.color_variants || []).map(c => c.color_name).join(' ');
      const searchableText = `${product.title || ''} ${product.sku || ''} ${product.category || ''} ${product.fabric || ''} ${(product.sizes || []).join(' ')} ${colorNames}`.toLowerCase();
      
      const words = cleanQuery ? cleanQuery.split(/\s+/).filter(Boolean) : [];
      const matchesKeywords = words.length === 0 || words.every(word => searchableText.includes(word));

      return matchesCategory && matchesPrice && matchesKeywords;
    });

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const pA = purchaseMode === 'wholesale' ? (a.wholesale_price || 0) : (a.retail_price || a.wholesale_price || 0);
        const pB = purchaseMode === 'wholesale' ? (b.wholesale_price || 0) : (b.retail_price || b.wholesale_price || 0);
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const pA = purchaseMode === 'wholesale' ? (a.wholesale_price || 0) : (a.retail_price || a.wholesale_price || 0);
        const pB = purchaseMode === 'wholesale' ? (b.wholesale_price || 0) : (b.retail_price || b.wholesale_price || 0);
        return pB - pA;
      });
    } else if (sortBy === "moq-low") {
      filtered.sort((a, b) => (a.moq || 1) - (b.moq || 1));
    }

    return filtered;
  }, [products, searchQuery, activeCategory, purchaseMode, sortBy]);

  // Helper to get image source for product
  const getProductImage = (product, isAi) => {
    if (isAi) {
      if (product.ai_model_image) return product.ai_model_image;
      return CATEGORY_MODEL_FALLBACKS[product.category] || CATEGORY_MODEL_FALLBACKS.Default;
    }
    return product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800";
  };

  // Bulk Quote item management
  const addToQuote = (product, e) => {
    if (e) e.stopPropagation();
    const isWholesale = purchaseMode === 'wholesale';
    const activeColorIndex = selectedColors[product.id] || 0;
    const colors = product.color_variants || [];
    const color = colors[activeColorIndex]?.color_name || 'Standard';
    const size = selectedSizes[product.id] || product.sizes?.[0] || 'Free Size';
    const price = isWholesale ? (product.wholesale_price || 0) : (product.retail_price || product.wholesale_price || 0);
    const moq = isWholesale ? (product.moq || 30) : 1;

    setQuoteItems((prev) => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.color === color && item.size === size && item.isWholesale === isWholesale
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += moq;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          sku: product.sku,
          image: getProductImage(product, false),
          color,
          size,
          price,
          quantity: moq,
          isWholesale,
          moq,
        }
      ];
    });

    setIsQuoteDrawerOpen(true);
  };

  const updateQuoteQuantity = (index, delta) => {
    setQuoteItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const step = item.isWholesale ? (item.moq || 10) : 1;
      const newQty = item.quantity + (delta * step);
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      item.quantity = newQty;
      return updated;
    });
  };

  const removeQuoteItem = (index) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalQuotePieces = quoteItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalQuoteAmount = quoteItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  // Generate WhatsApp Master Purchase Order
  const generateMasterPOText = () => {
    let msg = `Namaste Kamakhya Trading Co! 🙏\n\nI want to place a *Bulk Wholesale Order*:\n\n📋 *PURCHASE ORDER BREAKDOWN:*\n`;
    quoteItems.forEach((item, idx) => {
      msg += `\n${idx + 1}. *${item.title}* (${item.sku})\n   • Variant: Color: ${item.color} | Size: ${item.size}\n   • Qty: ${item.quantity} pcs @ ₹${item.price}/pc = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });
    msg += `\n-------------------------\n📊 *Total Items:* ${quoteItems.length} SKUs\n📦 *Total Quantity:* ${totalQuotePieces} pcs\n💰 *Estimated Subtotal:* ₹${totalQuoteAmount.toLocaleString('en-IN')}\n\n*Buyer Details:*\nShop / Boutique Name:\nCity / State:\nTransport Choice:\n\nPlease confirm stock availability and send the official GST proforma invoice.`;
    return msg;
  };

  const handleSendMasterPO = () => {
    const text = generateMasterPOText();
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPO = () => {
    const text = generateMasterPOText();
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  // AI Try-On Studio Simulation
  const handleGenerateTryon = async () => {
    if (!studioSelectedProduct) return;
    setIsGeneratingTryon(true);
    setTryonResultImage(null);

    try {
      const response = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: studioSelectedProduct.image,
          modelImage: CATEGORY_MODEL_FALLBACKS[studioSelectedProduct.category] || CATEGORY_MODEL_FALLBACKS.Default,
          garmentDescription: `${studioSelectedProduct.title} - ${studioSelectedProduct.category}`,
        })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setTryonResultImage(data.imageUrl);
      } else {
        setTryonResultImage(CATEGORY_MODEL_FALLBACKS[studioSelectedProduct.category]);
      }
    } catch (err) {
      setTryonResultImage(CATEGORY_MODEL_FALLBACKS[studioSelectedProduct.category] || CATEGORY_MODEL_FALLBACKS.Default);
    } finally {
      setIsGeneratingTryon(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 relative">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">
              KAMAKHYA TRADING CO • B2B Direct Factory Wholesale & Manufacturing
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>⚡ Pan-India Transport Dispatch</span>
            <span className="hidden md:inline">• GST Invoicing</span>
            <span>• Direct WhatsApp: <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold">+91 63506 26582</a></span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer flex flex-col"
              onClick={() => { setActiveCategory("All Collections"); setSearchQuery(""); }}
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight uppercase text-black">
                  Kamakhya
                </span>
                <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-900 text-white rounded-sm">
                  Trading Co
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-500">
                Women's & Girls' Apparel Wholesale B2B
              </span>
            </div>

            {/* Desktop Mode Toggle & Actions */}
            <div className="flex items-center gap-3">
              
              {/* Wholesale vs Retail Mode Toggle */}
              <div className="bg-gray-100 p-1 rounded-full flex items-center border border-gray-200 shadow-inner">
                <button
                  onClick={() => setPurchaseMode('wholesale')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    purchaseMode === 'wholesale'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Wholesale (Bulk)
                </button>
                <button
                  onClick={() => setPurchaseMode('retail')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    purchaseMode === 'retail'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Retail (Single)
                </button>
              </div>

              {/* AI Try-On Studio Button */}
              <button
                onClick={() => {
                  setIsAiStudioOpen(true);
                  if (products.length > 0 && !studioSelectedProduct) {
                    setStudioSelectedProduct(products[0]);
                  }
                }}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors shadow-xs"
              >
                <span>✨</span>
                <span>AI Try-On Studio</span>
              </button>

              {/* Bulk PO Quote Bag Trigger */}
              <button
                onClick={() => setIsQuoteDrawerOpen(true)}
                className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-black text-white transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline">Bulk PO</span>
                {quoteItems.length > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {quoteItems.length}
                  </span>
                )}
              </button>

              {/* Admin Portal Link */}
              <a
                href="/admin/index.html"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex text-xs font-bold px-3 py-2 text-gray-500 hover:text-black border border-gray-200 hover:border-gray-400 rounded-xl transition-all"
                title="Open Admin Portal (Sveltia CMS)"
              >
                Admin
              </a>
            </div>

          </div>
        </div>
      </nav>

      {/* 3. HERO BANNER */}
      <div className="relative bg-neutral-950 text-white py-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
            alt="Wholesale Apparel"
            className="w-full h-full object-cover filter brightness-75"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-4 uppercase tracking-widest">
            <span>🏭 Direct Factory Manufacturing</span>
            <span>•</span>
            <span>Boutiques & Retailers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase leading-tight">
            Premium Women & Girls <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-white">Apparel Wholesale</span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            Direct mill rates on Kurtis, Lehengas, Western Tops & Girls Partywear. Low MOQs, live WhatsApp ordering, and AI on-model preview catalog.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-neutral-300">
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-emerald-400">✓</span> Factory MOQ Rates
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-emerald-400">✓</span> Sample Single Pieces
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-emerald-400">✓</span> All-India Transport
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-emerald-400">✓</span> Instant WhatsApp PO
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI NATURAL LANGUAGE SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 sm:p-2.5 flex items-center gap-2">
          <span className="pl-3 pr-1 text-purple-600 font-black text-sm flex items-center gap-1.5 flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden sm:inline">AI Search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search intent: 'Ethnic under 1000', 'Partywear', 'Kurti below 700'..."
            className="w-full px-2 py-1.5 text-sm text-gray-800 focus:outline-none placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-gray-400 hover:text-black font-bold px-2 py-1 flex-shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* AI Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center text-xs">
          {[
            "Ethnic under 1000",
            "Girls Partywear",
            "Western Wear",
            "Bulk sets under 600",
            "Free Size"
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setSearchQuery(prompt)}
              className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 rounded-full border border-gray-200 transition-colors shadow-xs active:scale-95 flex items-center gap-1 font-medium"
            >
              <span>✨</span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. MODE EXPLANATION & CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${purchaseMode === 'wholesale' ? 'bg-black' : 'bg-emerald-500'}`}></div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                Current Catalog Mode: <span className="uppercase font-black text-black">{purchaseMode}</span>
              </div>
              <p className="text-xs text-gray-500">
                {purchaseMode === 'wholesale'
                  ? 'Showing bulk wholesale rate per piece & MOQ requirements for trade buyers.'
                  : 'Showing single-piece retail rate for individual sampling & retail purchases.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs text-gray-500 font-semibold">
              Sort by:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="moq-low">Lowest MOQ First</option>
            </select>
          </div>

        </div>
      </div>

      {/* 6. CATEGORIES BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200">
        <div className="flex space-x-6 overflow-x-auto pb-3 scrollbar-hide text-xs font-bold text-gray-400 uppercase tracking-widest">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === category
                  ? 'text-black border-b-2 border-black pb-2 font-black'
                  : 'hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 7. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Results Counter & Active Filter Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 font-semibold">
          <div>
            Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> {purchaseMode} product lots
            {activeCategory !== "All Collections" && <span> in <span className="text-black font-bold">{activeCategory}</span></span>}
            {searchQuery && <span> matching "<span className="text-black font-bold">{searchQuery}</span>"</span>}
          </div>
          {(activeCategory !== "All Collections" || searchQuery) && (
            <button
              onClick={() => { setActiveCategory("All Collections"); setSearchQuery(""); }}
              className="text-indigo-600 hover:text-indigo-800 font-bold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <span className="text-4xl mb-3 block">👗</span>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No garments matched your filter</h3>
            <p className="text-gray-500 text-xs max-w-md mx-auto mb-6">
              Try broadening your AI search query, selecting another category, or reset filters to see all apparel.
            </p>
            <button
              onClick={() => { setActiveCategory("All Collections"); setSearchQuery(""); }}
              className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const isWholesale = purchaseMode === 'wholesale';
              const wholesalePrice = Number(product.wholesale_price || 0);
              const retailPrice = Number(product.retail_price || product.wholesale_price || 0);
              const displayPrice = isWholesale ? wholesalePrice : retailPrice;
              const displayMoq = isWholesale ? (product.moq || 30) : 1;

              // Retailer Margin Calculation
              const marginAmount = retailPrice > wholesalePrice ? (retailPrice - wholesalePrice) : 0;
              const marginPercent = wholesalePrice > 0 ? Math.round((marginAmount / wholesalePrice) * 100) : 0;

              const colors = product.color_variants || [];
              const activeColorIndex = selectedColors[product.id] || 0;
              const activeColor = colors[activeColorIndex];

              const sizes = product.sizes || [];
              const activeSize = selectedSizes[product.id] || sizes[0] || 'Free Size';

              const isAiView = !!aiViewModel[product.id];
              const defaultImage = getProductImage(product, false);
              const aiModelImage = getProductImage(product, true);
              const currentImageSrc = isAiView ? aiModelImage : defaultImage;

              // Single item WhatsApp order URL
              const productMessage = `Namaste Kamakhya Trading Co! 🙏\n\nI want to place an order from your catalog:\n\n📦 *Product:* ${product.title} (${isWholesale ? 'Wholesale Lot' : 'Retail Piece'})\n🏷️ *SKU:* ${product.sku}\n🎨 *Color:* ${activeColor ? activeColor.color_name : 'Default'}\n📏 *Size:* ${activeSize}\n💰 *Price:* ₹${displayPrice}/pc\n🔢 *Order Quantity:* ${displayMoq} pcs\n\nPlease confirm stock availability and share dispatch details.`;
              const productWaUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(productMessage)}`;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  
                  {/* PRODUCT IMAGE & BADGES */}
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                    
                    {/* MOQ & Mode Badge */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
                      <span className="bg-black/90 text-white backdrop-blur-sm px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md shadow-xs">
                        {isWholesale ? `MOQ: ${displayMoq} pcs` : 'Single Piece'}
                      </span>
                      {isWholesale && marginAmount > 0 && (
                        <span className="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-md shadow-xs">
                          Save {marginPercent}% Bulk
                        </span>
                      )}
                    </div>

                    {/* AI Model View Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAiViewModel({ ...aiViewModel, [product.id]: !isAiView });
                      }}
                      className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm transition-transform active:scale-95 shadow-md border border-gray-200"
                      title="Toggle AI Model Look"
                    >
                      <span className="text-purple-600">✨</span>
                      <span>{isAiView ? 'Catalog Shoot' : 'AI Model Look'}</span>
                    </button>

                    {/* Image Element */}
                    <img
                      src={currentImageSrc}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Instant Color Tint (active only in flat catalog view) */}
                    {!isAiView && activeColor && (
                      <div
                        className="absolute inset-0 z-10 mix-blend-multiply opacity-80 pointer-events-none transition-colors duration-300"
                        style={{ backgroundColor: activeColor.hex_code === '#FFFFFF' ? 'transparent' : activeColor.hex_code }}
                      />
                    )}

                    {/* Quick View Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                      <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Click for Quick View
                      </span>
                    </div>

                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="p-5 flex flex-col flex-grow">
                    
                    {/* Sizes Selection */}
                    {sizes.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Sizes
                        </div>
                        <div className="flex space-x-1.5 flex-wrap gap-y-1">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                              className={`px-2.5 py-0.5 text-[11px] font-bold border rounded-md transition-all ${
                                activeSize === size
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Colors</span>
                          <span className="text-gray-600 font-semibold">{activeColor?.color_name}</span>
                        </div>
                        <div className="flex space-x-1.5 flex-wrap">
                          {colors.map((color, idx) => (
                            <button
                              key={color.color_name}
                              onClick={() => setSelectedColors({ ...selectedColors, [product.id]: idx })}
                              className={`w-5 h-5 rounded-full border transition-transform ${
                                activeColorIndex === idx
                                  ? 'border-black scale-125 shadow-xs ring-1 ring-black'
                                  : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.hex_code }}
                              title={color.color_name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Title & SKU */}
                    <div className="cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 hover:text-black">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 mb-3">
                        <span className="text-[11px] text-gray-400 font-mono">{product.sku}</span>
                        {product.fabric && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-1.5 py-0.5 rounded">
                            {product.fabric}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="mt-auto pt-3 border-t border-gray-100 mb-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-gray-900">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-500 ml-1 font-semibold">/ pc</span>
                        </div>
                        {isWholesale && retailPrice > wholesalePrice && (
                          <div className="text-right">
                            <span className="text-xs text-gray-400 line-through">
                              ₹{retailPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[10px] font-bold text-emerald-600">
                              MRP: ₹{retailPrice}
                            </span>
                          </div>
                        )}
                      </div>

                      {isWholesale && marginAmount > 0 && (
                        <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center justify-between">
                          <span>Boutique Margin:</span>
                          <span className="font-bold">+₹{marginAmount}/pc ({marginPercent}%)</span>
                        </div>
                      )}
                    </div>

                    {/* Action CTAs: Direct WhatsApp & Add to Bulk Quote */}
                    <div className="flex flex-col gap-2">
                      <a
                        href={productWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-2.5 px-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-xs text-xs"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Order on WhatsApp</span>
                      </a>

                      <button
                        onClick={(e) => addToQuote(product, e)}
                        className="w-full bg-gray-100 hover:bg-black hover:text-white text-gray-800 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>+</span>
                        <span>Add to Bulk PO</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 8. B2B TRUST & WHOLESALE POLICY SECTION */}
      <section className="bg-white border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest border border-purple-200">
              Manufacturer Guarantee
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-3 uppercase tracking-tight">
              Why Boutiques & Wholesalers Partner with Us
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Transparent factory pricing, quality checked fabrics, and seamless WhatsApp communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
            
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-4">
                🏭
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Direct Mill Rates</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Zero agent commissions or middlemen margins. You buy straight from the apparel manufacturing source.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-4">
                ✨
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">AI Model Catalog</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Flip between flat shoots and AI Model previews to see real drape, fall, and silhouette on fashion mannequins.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-4">
                📦
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Low MOQ Flexibility</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Start with accessible minimum quantities (30–50 pcs) or order single retail sample pieces to inspect finish.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-4">
                🚚
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Pan-India Transport</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bale packing and trusted transport dispatches to all states with door delivery and tracking slips.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. BULK PURCHASE ORDER (PO) SLIDE-OVER DRAWER */}
      {isQuoteDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsQuoteDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-neutral-900 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <div>
                    <h3 className="font-bold text-base leading-tight">Bulk Purchase Order</h3>
                    <p className="text-[11px] text-gray-400">Assemble multi-item order for WhatsApp invoicing</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQuoteDrawerOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {quoteItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <span className="text-4xl block mb-2">🛍️</span>
                    <p className="text-sm font-semibold text-gray-600">Your bulk quote is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Tap "+ Add to Bulk PO" on products to build a quotation.</p>
                  </div>
                ) : (
                  quoteItems.map((item, idx) => (
                    <div key={`${item.id}-${item.color}-${item.size}-${idx}`} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                            <button onClick={() => removeQuoteItem(idx)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{item.sku}</span>
                          <div className="flex gap-2 text-[10px] text-gray-600 font-medium mt-1">
                            <span>Color: <b>{item.color}</b></span>
                            <span>Size: <b>{item.size}</b></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs font-black text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-gray-500"> (₹{item.price}/pc)</span>
                          </span>

                          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            <button
                              onClick={() => updateQuoteQuantity(idx, -1)}
                              className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-l"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuoteQuantity(idx, 1)}
                              className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Actions */}
              {quoteItems.length > 0 && (
                <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Total SKUs:</span>
                      <span className="font-bold text-gray-900">{quoteItems.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Pieces (Quantity):</span>
                      <span className="font-bold text-gray-900">{totalQuotePieces} pcs</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>Estimated Subtotal:</span>
                      <span>₹{totalQuoteAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 italic">
                    * Transport freight & GST will be added to the final proforma invoice upon confirmation.
                  </p>

                  <button
                    onClick={handleSendMasterPO}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Send Purchase Order on WhatsApp</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyPO}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                    >
                      {copiedQuote ? '✓ PO Copied!' : '📋 Copy PO Text'}
                    </button>
                    <button
                      onClick={() => setQuoteItems([])}
                      className="text-xs text-red-600 hover:underline px-3 font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 10. PRODUCT QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setQuickViewProduct(null)} />
          
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-lg p-2"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={getProductImage(quickViewProduct, aiViewModel[quickViewProduct.id])}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setAiViewModel({ ...aiViewModel, [quickViewProduct.id]: !aiViewModel[quickViewProduct.id] })}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs"
                >
                  ✨ {aiViewModel[quickViewProduct.id] ? 'Catalog View' : 'AI Model View'}
                </button>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-2 mb-1">{quickViewProduct.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mb-4">{quickViewProduct.sku}</p>

                  <div className="space-y-2 text-xs text-gray-600 mb-6 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Fabric:</span>
                      <span className="font-bold text-gray-800">{quickViewProduct.fabric || 'Premium Quality'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Wholesale Lot MOQ:</span>
                      <span className="font-bold text-gray-800">{quickViewProduct.moq || 30} pieces</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Available Sizes:</span>
                      <span className="font-bold text-gray-800">{(quickViewProduct.sizes || []).join(', ') || 'Free Size'}</span>
                    </div>
                    {quickViewProduct.description && (
                      <div className="pt-2 border-t border-gray-200 text-gray-600 text-xs">
                        {quickViewProduct.description}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gray-900">
                        ₹{purchaseMode === 'wholesale' ? quickViewProduct.wholesale_price : (quickViewProduct.retail_price || quickViewProduct.wholesale_price)}
                      </span>
                      <span className="text-xs text-gray-500">/ piece</span>
                    </div>
                    {purchaseMode === 'wholesale' && (
                      <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
                        Retail MRP: ₹{quickViewProduct.retail_price || quickViewProduct.wholesale_price} (High margin item)
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
                      `Namaste Kamakhya Trading Co! 🙏\n\nI want to order: *${quickViewProduct.title}* (${quickViewProduct.sku})\nMode: ${purchaseMode === 'wholesale' ? 'Wholesale Lot' : 'Retail'}\nPrice: ₹${quickViewProduct.wholesale_price}/pc\nQty: ${quickViewProduct.moq || 30} pcs\n\nPlease share dispatch timeline.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    <span>Order Directly on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      addToQuote(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                  >
                    + Add to Bulk Purchase Order
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* 11. AI TRY-ON STUDIO MODAL */}
      {isAiStudioOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsAiStudioOpen(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
            <button
              onClick={() => setIsAiStudioOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-lg p-2"
            >
              ✕
            </button>

            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200">
                ✨ AI Virtual Try-On Studio
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">
                Visualize Catalog Garments on AI Models
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Zero studio fees. Preview how your wholesale inventory drapes on digital fashion mannequins in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* Garment Selector */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    1. Select Garment to Try On:
                  </label>
                  <select
                    value={studioSelectedProduct?.id || ""}
                    onChange={(e) => {
                      const found = products.find(p => p.id === e.target.value);
                      if (found) {
                        setStudioSelectedProduct(found);
                        setTryonResultImage(null);
                      }
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.sku}) - {p.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    2. Choose Fashion Mannequin Style:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'traditional', label: 'Ethnic Model', icon: '🥻' },
                      { id: 'western', label: 'Western Model', icon: '👗' },
                      { id: 'party', label: 'Partywear', icon: '✨' },
                    ].map(style => (
                      <button
                        key={style.id}
                        onClick={() => setStudioModelType(style.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          studioModelType === style.id
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="block text-base mb-1">{style.icon}</span>
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateTryon}
                  disabled={isGeneratingTryon}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
                >
                  {isGeneratingTryon ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Simulating AI Neural Drape...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate AI Model Fit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Result Preview Screen */}
              <div className="relative aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-gray-200">
                {isGeneratingTryon ? (
                  <div className="text-center p-6 text-white space-y-3">
                    <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-xs font-bold tracking-wide">AI Generative Engine Active</div>
                    <p className="text-[10px] text-gray-400">Rendering high-resolution fabric texture & lighting...</p>
                  </div>
                ) : (
                  <img
                    src={
                      tryonResultImage ||
                      studioSelectedProduct?.ai_model_image ||
                      CATEGORY_MODEL_FALLBACKS[studioSelectedProduct?.category] ||
                      CATEGORY_MODEL_FALLBACKS.Default
                    }
                    alt="AI Try-on Result"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-sm text-white p-2 rounded-xl text-[10px] flex items-center justify-between">
                  <span className="font-semibold truncate">
                    {studioSelectedProduct?.title}
                  </span>
                  <span className="text-emerald-400 font-bold flex-shrink-0">
                    Photorealistic Preview
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 12. FLOATING WHATSAPP & PO CART TRIGGERS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        
        {/* Floating Bulk PO Bag Pill */}
        {quoteItems.length > 0 && (
          <button
            onClick={() => setIsQuoteDrawerOpen(true)}
            className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-neutral-700 transition-all hover:scale-105 active:scale-95 animate-fade-in"
          >
            <span>📦</span>
            <span>Review Bulk PO ({quoteItems.length})</span>
            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px]">
              ₹{totalQuoteAmount.toLocaleString('en-IN')}
            </span>
          </button>
        )}

        {/* Floating Direct WhatsApp Button */}
        <a
          href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Namaste Kamakhya Trading Co! I want to inquire about bulk wholesale catalogs and factory rates.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1EBE5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white"
          aria-label="Direct WhatsApp Contact"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

      </div>

      {/* 13. FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-black text-xl text-white tracking-wider uppercase">
              Kamakhya <span className="text-neutral-500">Trading Co</span>
            </span>
            <p className="text-neutral-500 text-xs mt-1">
              Direct factory manufacturing & wholesale supply for women & girls apparel.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-neutral-300 font-semibold">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-white">
              WhatsApp Support
            </a>
            <a href="/admin/index.html" target="_blank" rel="noreferrer" className="hover:text-white">
              Admin Portal (CMS)
            </a>
            <button onClick={() => setIsAiStudioOpen(true)} className="hover:text-white">
              AI Try-On Studio
            </button>
          </div>

          <div className="text-neutral-500 text-[11px] text-center md:text-right">
            © {new Date().getFullYear()} Kamakhya Trading Co. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}