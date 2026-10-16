'use client';

import { useState } from 'react';

export default function WholesaleLineSheet({
  products = [],
  purchaseMode = 'wholesale',
  onAddToQuote,
  onQuickView,
  whatsappNumber = "916350626582",
  isVercel = false
}) {
  // Local quantity selections for line sheet batch addition
  const [lineQuantities, setLineQuantities] = useState({});

  const isWholesale = isVercel ? false : purchaseMode === 'wholesale';

  const handleQtyChange = (productId, delta, step) => {
    setLineQuantities((prev) => {
      const current = prev[productId] || (isWholesale ? (products.find(p => p.id === productId)?.moq || 30) : 1);
      const next = Math.max(step, current + (delta * step));
      return { ...prev, [productId]: next };
    });
  };

  const getEffectiveQty = (product) => {
    if (lineQuantities[product.id]) return lineQuantities[product.id];
    return isWholesale ? (product.moq || 30) : 1;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs">
        <svg className="w-10 h-10 text-neutral-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-xl font-bold text-neutral-900 mb-1">No items found</h3>
        <p className="text-neutral-500 text-xs max-w-md mx-auto">
          Adjust your category selection or search keywords to populate the collection list.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
      
      {/* Line-Sheet Header Strip */}
      <div className="p-4 sm:p-5 bg-neutral-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-black text-emerald-400">
              {isVercel ? "Curated Collection List View" : "B2B Line-Sheet Order Matrix"}
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">
              {products.length} {isVercel ? "Designs" : "Lots"}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {isVercel
              ? "Browse all silhouettes, compare fabric weaves, and select pieces directly for order."
              : "Rapid lot quantity ordering for multi-store stockists, showrooms, and boutique buyers."}
          </p>
        </div>
        {!isVercel && (
          <div className="text-xs text-neutral-400 font-medium">
            Prices: <span className="text-white font-bold">{isWholesale ? 'Direct Mill Wholesale' : 'Single Sampling'}</span>
          </div>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">Garment / SKU</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Category &amp; Fabric</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Sizes Curve</th>
              <th className="py-3.5 px-4">{isVercel ? "Price" : "Price / MOQ"}</th>
              <th className="py-3.5 px-4">Order Quantity</th>
              <th className="py-3.5 px-4 text-right">Line Total</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => {
              const wholesalePrice = Number(product.wholesale_price || 0);
              const retailPrice = Number(product.retail_price || product.wholesale_price || 0);
              const unitPrice = isVercel ? retailPrice : (isWholesale ? wholesalePrice : retailPrice);
              const moq = isVercel ? 1 : (isWholesale ? (product.moq || 30) : 1);
              const qty = getEffectiveQty(product);
              const lineTotal = unitPrice * qty;

              const productMessage = isVercel
                ? `Namaste KTC Fashion!\n\nI want to order this garment:\n\n*Product:* ${product.title}\n*SKU:* ${product.sku}\n*Price:* ₹${unitPrice}\n*Order Quantity:* ${qty} pcs (Total: ₹${lineTotal.toLocaleString('en-IN')})\n\nPlease confirm availability and payment details.`
                : `Namaste Kamakhya Trading Co!\n\nI want to place an order from your Line-Sheet:\n\n*Product:* ${product.title}\n*SKU:* ${product.sku}\n*Price:* ₹${unitPrice}/pc\n*Order Quantity:* ${qty} pcs (Total: ₹${lineTotal.toLocaleString('en-IN')})\n\nPlease share proforma invoice and dispatch date.`;
              const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(productMessage)}`;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-neutral-50/70 transition-colors group"
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200"}
                        alt={product.title}
                        onClick={() => onQuickView(product)}
                        className="w-12 h-16 sm:w-14 sm:h-18 object-cover rounded-lg border border-neutral-200 cursor-pointer flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <button
                          onClick={() => onQuickView(product)}
                          className="font-bold text-neutral-950 text-xs sm:text-sm hover:underline text-left block truncate max-w-[180px] sm:max-w-xs cursor-pointer"
                        >
                          {product.title}
                        </button>
                        <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                          {product.sku}
                        </span>
                        <div className="md:hidden text-[10px] text-neutral-500 mt-1">
                          {product.category} {product.fabric ? `• ${product.fabric}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Fabric */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="font-semibold text-neutral-800 block">
                      {product.category}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      {product.fabric || 'Pure Mill Weave'}
                    </span>
                  </td>

                  {/* Size Curve */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {(product.sizes || ['Free Size']).map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[9px] font-bold border border-neutral-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Price & MOQ */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-black text-neutral-950 text-sm">
                      ₹{unitPrice.toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal text-neutral-500"> /pc</span>
                    </div>
                    {isWholesale && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-0.5">
                        MOQ: {moq} pcs
                      </span>
                    )}
                  </td>

                  {/* Order Quantity Stepper */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-white w-max shadow-2xs">
                      <button
                        onClick={() => handleQtyChange(product.id, -1, isWholesale ? 10 : 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 rounded-l font-bold text-xs cursor-pointer"
                        title={`Decrease by ${isWholesale ? 10 : 1}`}
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-neutral-900 min-w-[36px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1, isWholesale ? 10 : 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 rounded-r font-bold text-xs cursor-pointer"
                        title={`Increase by ${isWholesale ? 10 : 1}`}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Line Total */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-neutral-900 text-xs sm:text-sm">
                    ₹{lineTotal.toLocaleString('en-IN')}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          // Custom addition with the exact line quantity
                          onAddToQuote({ ...product, customQty: qty }, e);
                        }}
                        className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-bold text-[11px] transition-all shadow-2xs active:scale-95 cursor-pointer"
                        title={isVercel ? "Add to shopping bag" : "Add this lot to bulk purchase order"}
                      >
                        {isVercel ? "+ Add to Bag" : "+ Add PO"}
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-lg transition-colors shadow-2xs"
                        title="Order via WhatsApp"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
