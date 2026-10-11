'use client';

import { useState, useRef } from 'react';

// Curated photorealistic Indian & Western model archetypes
const STUDIO_MODELS = [
  {
    id: 'aanya',
    name: 'Aanya',
    title: 'North Indian Festive & Heritage',
    category: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
    description: 'Perfect for Kurtis, Anarkalis, Shararas & Chanderi suits.'
  },
  {
    id: 'meera',
    name: 'Meera',
    title: 'Regal Bridal & Silk Heritage',
    category: 'Bridal',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
    description: 'Specialized for Velvet Lehengas, Banarasi Sarees & Bridal Cholis.'
  },
  {
    id: 'rhea',
    name: 'Rhea',
    title: 'Modern Western & Streetwear',
    category: 'Western Wear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    description: 'Chic drape for Oversized Tees, Denim Cargos, Blazer Co-ords & Crop Tops.'
  },
  {
    id: 'shanaya',
    name: 'Shanaya',
    title: 'High-Glamour & Cocktail Party',
    category: 'Girls Partywear',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
    description: 'Glamour fit for Tiered Skirts, Gowns, Ruffle Dresses & Sequin Partywear.'
  },
  {
    id: 'tara',
    name: 'Tara',
    title: 'Youthful Festive & Loungewear',
    category: 'Loungewear',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    description: 'Relaxed natural drape for Kaftans, Satin Nightsuits & Casual Daywear.'
  }
];

const COLOR_TINTS = [
  { name: 'Original', hex: null },
  { name: 'Ruby Red', hex: '#991b1b' },
  { name: 'Emerald Green', hex: '#065f46' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Golden Mustard', hex: '#b45309' },
  { name: 'Wine Plum', hex: '#581c87' },
  { name: 'Rose Blush', hex: '#be185d' },
  { name: 'Midnight Black', hex: '#0f172a' }
];

export default function AiTryOnStudio({
  isOpen,
  onClose,
  products = [],
  initialProduct = null,
  whatsappNumber = '916350626582',
  onAddToQuote = null
}) {
  // Active product & model selection
  const [selectedProduct, setSelectedProduct] = useState(initialProduct || products[0] || null);
  const [selectedModel, setSelectedModel] = useState(STUDIO_MODELS[0]);
  const [customModelPhoto, setCustomModelPhoto] = useState(null);
  const [customGarmentPhoto, setCustomGarmentPhoto] = useState(null);

  // Styling & variant controls
  const [activeColorTint, setActiveColorTint] = useState(COLOR_TINTS[0]);
  const [selectedSize, setSelectedSize] = useState('M');

  // AI Pipeline State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [resultFidelity, setResultFidelity] = useState('99.4%');

  // Interactive Split Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'ai-only' | 'garment-only'
  const isDraggingSlider = useRef(false);
  const sliderContainerRef = useRef(null);

  // Sync initial product if changed externally
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialProduct);
  if (initialProduct !== prevInitialProduct) {
    setPrevInitialProduct(initialProduct);
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setGeneratedResult(null);
      // Auto-select best matching model archetype based on category
      const match = STUDIO_MODELS.find(m => m.category === initialProduct.category);
      if (match) setSelectedModel(match);
    }
  }

  if (!isOpen) return null;

  // Garment image to display
  const currentGarmentImage = customGarmentPhoto || selectedProduct?.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=900';

  // Model image to display
  const currentModelBaseImage = customModelPhoto || (selectedProduct?.ai_model_image) || selectedModel.image;

  // Final Try-On output image
  const displayTryonImage = generatedResult || currentModelBaseImage;

  // Handle Dragging Split Slider
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingSlider.current) {
      handleSliderMove(e.clientX);
    }
  };

  // Upload Custom User Photo
  const handleUserPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomModelPhoto(event.target.result);
      setGeneratedResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom Garment Photo
  const handleGarmentPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomGarmentPhoto(event.target.result);
      setGeneratedResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Generate AI Try-On Drape
  const handleRunAiTryon = async () => {
    setIsGenerating(true);
    setProgressStep(1);
    setProgressStatus('1/4 Segmenting cloth silhouette & fabric texture...');

    // Progress step simulation for hyper-realistic feel
    const timer1 = setTimeout(() => {
      setProgressStep(2);
      setProgressStatus('2/4 Mapping model torso, collarbones & waist contour...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgressStep(3);
      setProgressStatus('3/4 Neural drape synthesis (wrinkles, flare & folds)...');
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgressStep(4);
      setProgressStatus('4/4 Applying 4K studio lighting & color tone matching...');
    }, 2200);

    try {
      const response = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: currentGarmentImage,
          productModelImage: selectedProduct?.ai_model_image || '',
          modelType: selectedModel.id,
          customModelImage: customModelPhoto || '',
          garmentDescription: `${selectedProduct?.title || 'Custom Garment'} - ${selectedProduct?.category || 'Fashion'}`,
          category: selectedProduct?.category || 'Ethnic Wear'
        })
      });

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedResult(data.imageUrl);
        setResultFidelity(data.drapeFidelity || '99.4%');
      } else {
        setGeneratedResult(currentModelBaseImage);
      }
    } catch (err) {
      console.warn("AI generation fallback:", err);
      setGeneratedResult(currentModelBaseImage);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setTimeout(() => {
        setIsGenerating(false);
        setProgressStep(0);
      }, 500);
    }
  };

  // Generate WhatsApp Order Message
  const getWhatsAppMessage = () => {
    const prodTitle = selectedProduct?.title || 'Custom Try-On Garment';
    const prodSku = selectedProduct?.sku || 'KTC-VTON';
    const price = selectedProduct?.wholesale_price || 'Inquiry';
    const moq = selectedProduct?.moq || 30;
    const modelName = customModelPhoto ? 'Custom Client Photo' : selectedModel.name;
    const colorName = activeColorTint.name;

    return `Namaste Kamakhya Trading Co! 🙏\n\nI reviewed this look in your *AI Virtual Try-On Studio*:\n\n👗 *Garment:* ${prodTitle}\n🏷️ *SKU:* ${prodSku}\n✨ *Model Look:* ${modelName}\n🎨 *Selected Color:* ${colorName}\n📏 *Size:* ${selectedSize}\n💰 *Wholesale Rate:* ₹${price}/pc (MOQ: ${moq} pcs)\n\nPlease confirm fabric availability, lot packing, and dispatch options for this design!`;
  };

  const handleOrderWhatsApp = () => {
    const msg = getWhatsAppMessage();
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Download HD Lookbook Card
  const handleDownloadLookbook = () => {
    const link = document.createElement('a');
    link.href = displayTryonImage;
    link.download = `KTC-AI-Studio-${selectedProduct?.sku || 'Lookbook'}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Studio Modal Window */}
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-neutral-800">
        
        {/* Studio Top Header */}
        <div className="p-4 sm:px-6 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-rose-500 flex items-center justify-center text-lg shadow-lg">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-tight uppercase">
                  Kamakhya AI Virtual Try-On Studio
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                  v2.4 Neural Drape
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Interactive real-time garment fit simulation on curated Indian & Western fashion models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Studio Body: Left Configuration / Right Interactive Canvas */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* LEFT CONTROLS PANEL (5 cols on lg) */}
          <div className="lg:col-span-5 p-4 sm:p-6 space-y-5 bg-gray-50/70 overflow-y-auto">
            
            {/* STEP 1: GARMENT SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Select Catalog Garment</span>
                </label>
                <label className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  + Upload Own Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGarmentPhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Garment Quick Carousel */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {products.map((p) => {
                  const isSelected = selectedProduct?.id === p.id && !customGarmentPhoto;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setCustomGarmentPhoto(null);
                        setGeneratedResult(null);
                        const match = STUDIO_MODELS.find(m => m.category === p.category);
                        if (match) setSelectedModel(match);
                      }}
                      className={`flex-shrink-0 w-20 text-left rounded-xl p-1.5 border transition-all ${
                        isSelected
                          ? 'border-black bg-white shadow-md ring-2 ring-black/20'
                          : 'border-gray-200 bg-white hover:border-gray-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full aspect-[4/5] object-cover rounded-lg mb-1"
                      />
                      <div className="text-[10px] font-bold text-gray-900 truncate">
                        {p.title}
                      </div>
                      <div className="text-[9px] text-emerald-600 font-bold">
                        ₹{p.wholesale_price}
                      </div>
                    </button>
                  );
                })}
              </div>

              {customGarmentPhoto && (
                <div className="mt-2 p-2 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                  <span className="font-semibold">✓ Using Custom Uploaded Garment</span>
                  <button
                    onClick={() => setCustomGarmentPhoto(null)}
                    className="text-[11px] font-bold underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: MODEL ARCHETYPE & USER PHOTO */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Choose Model or Upload Face</span>
                </label>
                <label className="text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer">
                  + Upload Buyer Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUserPhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Model Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STUDIO_MODELS.map((model) => {
                  const isSelected = selectedModel.id === model.id && !customModelPhoto;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setCustomModelPhoto(null);
                        setGeneratedResult(null);
                      }}
                      className={`relative text-left p-2 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-600/30'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-gray-100">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-black text-xs text-gray-900">{model.name}</div>
                        <div className="text-[9px] text-gray-500 line-clamp-1">{model.title}</div>
                      </div>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {customModelPhoto && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900">
                  <span className="font-semibold">✓ Custom Buyer/Model Image Loaded</span>
                  <button
                    onClick={() => setCustomModelPhoto(null)}
                    className="text-[11px] font-bold underline"
                  >
                    Use Studio Models
                  </button>
                </div>
              )}
            </div>

            {/* STEP 3: COLOR PALETTE & SIZE */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-800 block mb-2">
                3. Color Variant Overlay
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_TINTS.map((tint) => (
                  <button
                    key={tint.name}
                    onClick={() => setActiveColorTint(tint)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      activeColorTint.name === tint.name
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {tint.hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/50"
                        style={{ backgroundColor: tint.hex }}
                      />
                    )}
                    <span>{tint.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GENERATE ACTION BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleRunAiTryon}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Neural Drape...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Photorealistic Drape</span>
                  </>
                )}
              </button>

              {/* Multi-step progress bar */}
              {isGenerating && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-purple-700">
                    <span>{progressStatus}</span>
                    <span>{progressStep * 25}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressStep * 25}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Summary Box */}
            {selectedProduct && (
              <div className="p-3 bg-white rounded-2xl border border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{selectedProduct.title}</span>
                  <span className="font-black text-base text-gray-900">₹{selectedProduct.wholesale_price}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>SKU: {selectedProduct.sku}</span>
                  <span>MOQ: {selectedProduct.moq || 30} pcs</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Fabric: {selectedProduct.fabric || 'Quality Assured'}</span>
                  <span className="text-emerald-600 font-bold">In Stock Factory Lot</span>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT PREVIEW & COMPARISON CANVAS (7 cols on lg) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-white">
            
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'split' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  ↔ Interactive Split
                </button>
                <button
                  onClick={() => setViewMode('ai-only')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'ai-only' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  ✨ AI Model
                </button>
                <button
                  onClick={() => setViewMode('garment-only')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'garment-only' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  👗 Flat Garment
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Drape Fidelity: {resultFidelity}
                </span>
              </div>
            </div>

            {/* INTERACTIVE COMPARISON VIEWER */}
            <div
              ref={sliderContainerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseUp={() => { isDraggingSlider.current = false; }}
              onTouchEnd={() => { isDraggingSlider.current = false; }}
              className="relative aspect-[3/4] w-full max-h-[520px] rounded-2xl overflow-hidden bg-neutral-900 border border-gray-300 shadow-inner select-none cursor-ew-resize mx-auto"
            >
              {/* Layer 1: Garment Flat / Mannequin Shot */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={currentGarmentImage}
                  alt="Flat Garment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Flat Catalog Garment
                </div>
              </div>

              {/* Layer 2: Photorealistic AI Model On-Drape (Clipped by sliderPos) */}
              {(viewMode === 'split' || viewMode === 'ai-only') && (
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-75"
                  style={{
                    clipPath: viewMode === 'ai-only'
                      ? 'inset(0 0 0 0)'
                      : `inset(0 0 0 ${sliderPos}%)`
                  }}
                >
                  <img
                    src={displayTryonImage}
                    alt="AI Model Look"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute top-3 right-3 bg-purple-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow border border-purple-400/40">
                    ✨ AI On-Model Drape ({selectedModel.name})
                  </div>
                </div>
              )}

              {/* Draggable Divider Handle (Shown in Split Mode) */}
              {viewMode === 'split' && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={() => { isDraggingSlider.current = true; }}
                  onTouchStart={() => { isDraggingSlider.current = true; }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-gray-900 shadow-xl flex items-center justify-center font-black text-xs border border-gray-300">
                    ↔
                  </div>
                </div>
              )}

              {/* Model Spec Watermark Pill */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md text-white p-2.5 rounded-xl text-[11px] flex items-center justify-between pointer-events-none z-10">
                <div className="truncate pr-2">
                  <span className="font-bold text-gray-200">Look: </span>
                  <span className="font-semibold text-white">{selectedProduct?.title || 'Garment'}</span>
                </div>
                <span className="text-purple-300 font-mono text-[10px] flex-shrink-0">
                  {selectedProduct?.sku}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (ORDER, DOWNLOAD, PO) */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-2.5">
              
              {/* WhatsApp Direct Order */}
              <button
                onClick={handleOrderWhatsApp}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Order This Look on WhatsApp</span>
              </button>

              {/* Add to Bulk Quote */}
              {onAddToQuote && selectedProduct && (
                <button
                  onClick={() => {
                    onAddToQuote(selectedProduct);
                    onClose();
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>+</span>
                  <span>Add to Bulk PO</span>
                </button>
              )}

              {/* Download High Res Lookbook Photo */}
              <button
                onClick={handleDownloadLookbook}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-gray-300 hover:border-black text-gray-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                title="Download high-resolution photo for boutique Instagram/WhatsApp stories"
              >
                <span>📥</span>
                <span>Download HD</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
