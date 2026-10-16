'use client';

export default function ProductCard({
  product,
  purchaseMode = 'wholesale',
  selectedColorIndex = 0,
  onSelectColor,
  selectedSize,
  onSelectSize,
  onQuickView,
  onAddToQuote,
  onRestockRequest,
  whatsappNumber = "916350626582",
  isVercel = false
}) {
  const isWholesale = isVercel ? false : purchaseMode === 'wholesale';
  const wholesalePrice = Number(product.wholesale_price || 0);
  const retailPrice = Number(product.retail_price || product.wholesale_price || 0);
  const displayPrice = isVercel ? retailPrice : (isWholesale ? wholesalePrice : retailPrice);
  const displayMoq = isVercel ? 1 : (isWholesale ? (product.moq || 30) : 1);

  // Margin economics for retail buyers
  const marginAmount = retailPrice > wholesalePrice ? (retailPrice - wholesalePrice) : 0;
  const marginPercent = wholesalePrice > 0 ? Math.round((marginAmount / wholesalePrice) * 100) : 0;

  const colors = product.color_variants || [];
  const activeColor = colors[selectedColorIndex];
  const sizes = product.sizes || [];
  const activeSize = selectedSize || sizes[0] || 'Free Size';

  // Compute Image Source (Real Garment Photography)
  const variant = colors[selectedColorIndex];
  const currentImageSrc = variant?.image || product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800";

  // WhatsApp 1-tap direct inquiry message
  const productMessage = isVercel
    ? `Namaste KTC Fashion!\n\nI want to order this garment:\n\n*Product:* ${product.title}\n*SKU:* ${product.sku}\n*Color:* ${activeColor ? activeColor.color_name : 'Default'}\n*Size:* ${activeSize}\n*Price:* ₹${retailPrice}\n*Quantity:* 1 pc\n\nPlease confirm availability and payment details.`
    : `Namaste Kamakhya Trading Co!\n\nI want to place an order from your catalog:\n\n*Product:* ${product.title} (${isWholesale ? 'Wholesale Lot' : 'Retail Sample Piece'})\n*SKU:* ${product.sku}\n*Color:* ${activeColor ? activeColor.color_name : 'Default'}\n*Size:* ${activeSize}\n*Price:* ₹${displayPrice}/pc\n*Order Quantity:* ${displayMoq} pcs\n\nPlease confirm ready stock availability and dispatch timeline.`;
  const productWaUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(productMessage)}`;

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200/80">
      
      {/* 1. PRODUCT MEDIA CONTAINER & BADGES */}
      <div
        className="relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer select-none"
        onClick={() => onQuickView(product)}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
          <span className="bg-neutral-950/90 text-white backdrop-blur-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
            {isVercel ? 'Ready to Dispatch' : (isWholesale ? `MOQ: ${displayMoq} pcs` : 'Sample Piece')}
          </span>
        </div>

        {/* Product Image */}
        <img
          src={currentImageSrc}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />

        {/* Quick View Hover Cue */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
          <span className="bg-white/95 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
            Quick View
          </span>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        
        {/* Sizes Selection */}
        {sizes.length > 0 && (
          <div className="mb-2.5">
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Sizes
            </div>
            <div className="flex space-x-1.5 flex-wrap gap-y-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSelectSize(product.id, size)}
                  className={`px-2 py-0.5 text-[10px] font-bold border rounded-md transition-all cursor-pointer ${
                    activeSize === size
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
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
            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Colors</span>
              <span className="text-neutral-600 font-semibold">{activeColor?.color_name}</span>
            </div>
            <div className="flex space-x-1.5 flex-wrap">
              {colors.map((color, idx) => (
                <button
                  key={color.color_name}
                  onClick={() => onSelectColor(product.id, idx)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-transform cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'border-neutral-950 scale-125 shadow-xs ring-1 ring-neutral-950'
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.color_name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Title, SKU & Fabric Tag */}
        <div className="cursor-pointer" onClick={() => onQuickView(product)}>
          <h3 className="text-sm sm:text-base font-bold text-neutral-950 leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 mb-3">
            <span className="text-[10px] text-neutral-400 font-mono">{product.sku}</span>
            {product.fabric && (
              <span className="text-[9px] bg-neutral-100 text-neutral-600 font-semibold px-1.5 py-0.5 rounded">
                {product.fabric}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto pt-3 border-t border-neutral-100 mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-black text-neutral-950">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {!isVercel && <span className="text-xs text-neutral-500 ml-1 font-semibold">/ pc</span>}
            </div>
            {!isVercel && isWholesale && retailPrice > wholesalePrice && (
              <div className="text-right">
                <span className="text-xs text-neutral-400 line-through">
                  ₹{retailPrice.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] font-bold text-emerald-600">
                  MRP: ₹{retailPrice}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action CTAs: WhatsApp Order and Add to Bag */}
        <div className="flex flex-col gap-2">
          <a
            href={productWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-2.5 px-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-2xs text-xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Order on WhatsApp</span>
          </a>

          <button
            onClick={(e) => onAddToQuote(product, e)}
            className="w-full bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-800 font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>{isVercel ? 'Add to Bag' : 'Add to Bulk PO'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestockRequest(product);
            }}
            className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 hover:text-black transition-colors underline pt-1 text-center cursor-pointer"
          >
            {isVercel ? 'Check Custom Size / Restock' : 'Request Restock / Custom Lot'}
          </button>

        </div>

      </div>

    </article>
  );
}
