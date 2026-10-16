'use client';

import { useState } from 'react';

export default function ProductQuickView({
  product,
  onClose,
  purchaseMode = 'wholesale',
  onAddToQuote,
  whatsappNumber = "916350626582",
  isVercel = false
}) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');

  if (!product) return null;

  const isWholesale = isVercel ? false : purchaseMode === 'wholesale';
  const wholesalePrice = Number(product.wholesale_price || 0);
  const retailPrice = Number(product.retail_price || product.wholesale_price || 0);
  const displayPrice = isVercel ? retailPrice : (isWholesale ? wholesalePrice : retailPrice);
  const displayMoq = isVercel ? 1 : (isWholesale ? (product.moq || 30) : 1);

  const colors = product.color_variants || [];
  const activeColor = colors[selectedColorIdx];

  // Image Source (Real Garment Photography)
  const imageSrc = activeColor?.image || product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800";

  const waMessage = isVercel
    ? `Namaste KTC Fashion!\n\nI want to order from your collection:\n*Product:* ${product.title}\n*SKU:* ${product.sku}\n*Color:* ${activeColor ? activeColor.color_name : 'Default'}\n*Size:* ${selectedSize}\n*Price:* ₹${retailPrice}\n*Order Quantity:* 1 pc\n\nPlease confirm availability and payment details.`
    : `Namaste Kamakhya Trading Co!\n\nI want to order from your catalog:\n*Product:* ${product.title}\n*SKU:* ${product.sku}\n*Color:* ${activeColor ? activeColor.color_name : 'Default'}\n*Size:* ${selectedSize}\n*Price:* ₹${displayPrice}/pc\n*Order Quantity:* ${displayMoq} pcs\n\nPlease share dispatch timeline and bank payment details.`;
  const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden border border-neutral-200 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black font-bold p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close Quick View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* Garment Photography View */}
          <div className="relative aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
            <img
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Specifications & Order Actions */}
          <div className="flex flex-col justify-between h-full space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-300">
                  {product.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {product.sku}
                </span>
              </div>

              <h3 className="font-serif-display text-2xl font-black text-neutral-950 mt-2 mb-2 leading-tight">
                {product.title}
              </h3>

              {/* Price Block */}
              <div className="mb-4 pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-neutral-950">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {!isVercel && <span className="text-xs text-neutral-500 font-semibold">/ piece</span>}
                </div>
                {!isVercel && isWholesale && retailPrice > wholesalePrice && (
                  <div className="text-xs text-neutral-600 font-semibold mt-0.5">
                    Suggested Retail MRP: ₹{retailPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Select Color:</span>
                    <span className="text-neutral-900 font-semibold">{activeColor?.color_name}</span>
                  </div>
                  <div className="flex gap-2">
                    {colors.map((c, idx) => (
                      <button
                        key={c.color_name}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          selectedColorIdx === idx
                            ? 'border-neutral-950 scale-110 ring-2 ring-neutral-950/20'
                            : 'border-neutral-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex_code }}
                        title={c.color_name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Select Size:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          selectedSize === s
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Garment Specifications */}
              <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-500">Fabric &amp; Weave:</span>
                  <span className="font-bold text-neutral-900">{product.fabric || 'Pure Cotton / Silk Weave'}</span>
                </div>
                {!isVercel ? (
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-500">Wholesale Lot MOQ:</span>
                    <span className="font-bold text-neutral-900">{product.moq || 30} pieces</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-500">Minimum Order:</span>
                    <span className="font-bold text-neutral-900">1 Piece (No Minimum)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-500">Shipping:</span>
                  <span className="font-bold text-neutral-900">{isVercel ? 'Pan-India Insured Delivery (2-4 Days)' : 'Ready In-Stock (24-48 Hours)'}</span>
                </div>
                {product.description && (
                  <p className="pt-2 border-t border-neutral-200 text-neutral-600 text-[11px] leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Order Directly on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  onAddToQuote({ ...product, selectedColor: activeColor?.color_name, selectedSize });
                  onClose();
                }}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                {isVercel ? '+ Add to Shopping Bag' : '+ Add Lot to Bulk Purchase Order'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
