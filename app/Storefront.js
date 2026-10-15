'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import TopAnnouncement from './components/layout/TopAnnouncement';
import LuxuryNavbar from './components/layout/LuxuryNavbar';
import MobileBottomDock from './components/layout/MobileBottomDock';
import StorefrontFooter from './components/layout/StorefrontFooter';
import EditorialHero from './components/catalog/EditorialHero';
import CatalogControlBar from './components/catalog/CatalogControlBar';
import ProductCard from './components/catalog/ProductCard';
import WholesaleLineSheet from './components/catalog/WholesaleLineSheet';
import ProductQuickView from './components/catalog/ProductQuickView';
import BulkPoDrawer from './components/order/BulkPoDrawer';
import BoutiqueRoiCalculator from './components/BoutiqueRoiCalculator';
import AiChatbot from './components/AiChatbot';
import UserAuthModal from './components/UserAuthModal';
import NewUserGuide from './components/NewUserGuide';

const WHATSAPP_NUMBER = "916350626582";

function subscribeCustomProducts(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getCustomProductsSnapshot() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('ktc_custom_products') || '';
  } catch {
    return '';
  }
}

function getDeletedProductsSnapshot() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('ktc_deleted_products') || '';
  } catch {
    return '';
  }
}

function getServerSnapshot() {
  return '';
}

export default function Storefront({ products = [] }) {
  // 1. Core Selection and Filter State
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseMode, setPurchaseMode] = useState("wholesale"); // 'wholesale' | 'retail'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'linesheet'
  const [sortBy, setSortBy] = useState("default");

  // 2. Interactive Modals State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState(null);

  // 3. Web Speech API Voice Search
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const startVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is supported in Chrome, Edge, Safari, and mobile browsers.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsVoiceListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsVoiceListening(false);
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
    } catch {
      setIsVoiceListening(false);
    }
  };

  const CATEGORIES = [
    "All Collections",
    "Ethnic Wear",
    "Western Wear",
    "Girls Partywear",
    "Bridal",
    "Loungewear"
  ];

  // 4. Reactive Sync with LocalStorage Admin Changes
  const customProductsRaw = useSyncExternalStore(
    subscribeCustomProducts,
    getCustomProductsSnapshot,
    getServerSnapshot
  );

  const deletedProductsRaw = useSyncExternalStore(
    subscribeCustomProducts,
    getDeletedProductsSnapshot,
    getServerSnapshot
  );

  const liveProducts = useMemo(() => {
    let deletedSet = new Set();
    if (deletedProductsRaw) {
      try {
        const arr = JSON.parse(deletedProductsRaw);
        if (Array.isArray(arr)) deletedSet = new Set(arr);
      } catch {}
    }

    const map = new Map();
    // 1. Add server products that are NOT deleted
    products.forEach(p => {
      const key = p.id || p.slug;
      if (!deletedSet.has(key) && !deletedSet.has(p.id) && !deletedSet.has(p.slug)) {
        map.set(key, p);
      }
    });

    // 2. Add or overwrite custom products that are NOT deleted
    if (customProductsRaw) {
      try {
        const custom = JSON.parse(customProductsRaw);
        if (Array.isArray(custom)) {
          custom.forEach(p => {
            const key = p.id || p.slug;
            if (!deletedSet.has(key) && !deletedSet.has(p.id) && !deletedSet.has(p.slug)) {
              map.set(key, p);
            }
          });
        }
      } catch {}
    }

    return Array.from(map.values());
  }, [products, customProductsRaw, deletedProductsRaw]);

  // 5. Natural Language Search & Sorting Engine
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Natural language price detection (e.g. 'under 800', 'below 1000')
    let maxPrice = Infinity;
    const priceMatch = query.match(/(?:under|below|<|less than|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    const cleanQuery = query.replace(/(?:under|below|<|less than|max)\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '').trim();

    const filtered = liveProducts.filter((product) => {
      // Category match
      const matchesCategory =
        activeCategory === "All Collections" || product.category === activeCategory;

      // Price filter based on current mode
      const currentPrice = purchaseMode === 'wholesale'
        ? Number(product.wholesale_price || 0)
        : Number(product.retail_price || product.wholesale_price || 0);
      const matchesPrice = currentPrice <= maxPrice;

      // Keyword / Intent matching
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
  }, [liveProducts, searchQuery, activeCategory, purchaseMode, sortBy]);

  // 6. Bulk Quote Bag Management
  const addToQuote = (product, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const isWholesale = purchaseMode === 'wholesale';
    const activeColorIndex = selectedColors[product.id] || 0;
    const colors = product.color_variants || [];
    const color = product.selectedColor || colors[activeColorIndex]?.color_name || 'Standard';
    const size = product.selectedSize || selectedSizes[product.id] || product.sizes?.[0] || 'Free Size';
    const price = isWholesale ? (product.wholesale_price || 0) : (product.retail_price || product.wholesale_price || 0);
    const moq = product.customQty || (isWholesale ? (product.moq || 30) : 1);

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
          image: product.image || (product.color_variants?.[activeColorIndex]?.image) || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
          color,
          size,
          price,
          quantity: moq,
          isWholesale,
          moq: isWholesale ? (product.moq || 30) : 1,
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

  const totalQuoteAmount = quoteItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const resetAllFilters = () => {
    setActiveCategory("All Collections");
    setSearchQuery("");
    setSortBy("default");
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-neutral-900 relative selection:bg-neutral-900 selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <TopAnnouncement
        whatsappNumber={WHATSAPP_NUMBER}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 2. MAIN LUXURY NAVBAR */}
      <LuxuryNavbar
        purchaseMode={purchaseMode}
        setPurchaseMode={setPurchaseMode}
        quoteItemCount={quoteItems.length}
        quoteTotalAmount={totalQuoteAmount}
        onOpenCart={() => setIsQuoteDrawerOpen(true)}
        onOpenCalculator={() => setIsRoiModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onResetFilters={resetAllFilters}
      />

      {/* 3. EDITORIAL HERO & LOOKBOOK SHOWCASE */}
      <EditorialHero
        productCount={liveProducts.length}
        onExploreCatalog={scrollToCatalog}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* 4. CATALOG SEARCH, VOICE, CATEGORIES & VIEW SWITCHER */}
      <CatalogControlBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isVoiceListening={isVoiceListening}
        onStartVoiceSearch={startVoiceSearch}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        purchaseMode={purchaseMode}
        totalResults={filteredProducts.length}
        onResetFilters={resetAllFilters}
      />

      {/* 5. MAIN CATALOG VIEWPORT (Grid OR Wholesale Line-Sheet) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs">
            <span className="text-5xl mb-3 block">👗</span>
            <h3 className="font-serif-display text-2xl font-bold text-neutral-950 mb-1">
              No garments matched your search
            </h3>
            <p className="text-neutral-500 text-xs max-w-md mx-auto mb-6 leading-relaxed">
              Try adjusting your AI search query, selecting another category, or reset filters to explore all factory collections.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
            >
              Show All Factory Lots
            </button>
          </div>
        ) : viewMode === 'linesheet' ? (
          /* B2B Matrix Line-Sheet Ordering */
          <WholesaleLineSheet
            products={filteredProducts}
            purchaseMode={purchaseMode}
            onAddToQuote={addToQuote}
            onQuickView={(p) => setQuickViewProduct(p)}
            whatsappNumber={WHATSAPP_NUMBER}
          />
        ) : (
          /* Luxury Editorial Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                purchaseMode={purchaseMode}
                selectedColorIndex={selectedColors[product.id] || 0}
                onSelectColor={(id, idx) => setSelectedColors({ ...selectedColors, [id]: idx })}
                selectedSize={selectedSizes[product.id]}
                onSelectSize={(id, size) => setSelectedSizes({ ...selectedSizes, [id]: size })}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToQuote={addToQuote}
                onRestockRequest={(p) => {
                  setRestockProduct(p);
                  setIsAuthModalOpen(true);
                }}
                whatsappNumber={WHATSAPP_NUMBER}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. STOREFRONT FOOTER WITH MILL GUARANTEE */}
      <StorefrontFooter
        whatsappNumber={WHATSAPP_NUMBER}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCalculator={() => setIsRoiModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* 7. MOBILE FLOATING ACTION DOCK */}
      <MobileBottomDock
        quoteItemCount={quoteItems.length}
        quoteTotalAmount={totalQuoteAmount}
        onOpenCart={() => setIsQuoteDrawerOpen(true)}
        onOpenCalculator={() => setIsRoiModalOpen(true)}
        whatsappNumber={WHATSAPP_NUMBER}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* 8. DESKTOP FLOATING SHORTCUTS */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-30 flex-col items-end gap-3 pointer-events-auto">
        {/* Margin Estimator Floating Button */}
        <button
          onClick={() => setIsRoiModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border border-emerald-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Boutique Profit & Resale Margin Estimator"
        >
          <span>📊</span>
          <span>Margin Estimator</span>
        </button>

        {/* Floating Bulk PO Review Button */}
        {quoteItems.length > 0 && (
          <button
            onClick={() => setIsQuoteDrawerOpen(true)}
            className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-neutral-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>📦</span>
            <span>Review PO ({quoteItems.length})</span>
            <span className="bg-emerald-500 text-black px-2 py-0.5 rounded-full text-[10px] font-black">
              ₹{totalQuoteAmount.toLocaleString('en-IN')}
            </span>
          </button>
        )}

        {/* WhatsApp Direct Contact Floating Bubble */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste Kamakhya Trading Co! I want to inquire about bulk wholesale catalogs and factory rates.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1EBE5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white"
          aria-label="Direct WhatsApp Contact"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </div>

      {/* 9. BULK PURCHASE ORDER SLIDE-OVER DRAWER */}
      <BulkPoDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        onUpdateQuantity={updateQuoteQuantity}
        onRemoveItem={removeQuoteItem}
        onClearItems={() => setQuoteItems([])}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* 10. PRODUCT QUICK VIEW MODAL */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        purchaseMode={purchaseMode}
        onAddToQuote={addToQuote}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* 11. BOUTIQUE ROI & MARGIN CALCULATOR */}
      <BoutiqueRoiCalculator
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* 12. BUYER AUTH & RESTOCK REQUEST MODAL */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        products={products}
        initialRestockProduct={restockProduct}
      />

      {/* 13. FIRST-TIME BUYER ONBOARDING GUIDE */}
      <NewUserGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 14. ABOUT KAMAKHYA & MULTI-CLOUD DEPLOYMENTS MODAL */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      {/* 15. MULTILINGUAL AI CHATBOT (Hindi / English / Voice) */}
      <AiChatbot
        products={liveProducts}
        onOpenCalculator={() => setIsRoiModalOpen(true)}
        onOpenRestock={() => setIsAuthModalOpen(true)}
      />

    </div>
  );
}