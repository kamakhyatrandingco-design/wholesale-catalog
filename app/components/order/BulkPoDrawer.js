'use client';

import { useState } from 'react';

export default function BulkPoDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearItems,
  whatsappNumber = "916350626582"
}) {
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  if (!isOpen) return null;

  const totalPieces = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  // Volume subsidy calculation
  let volumeBenefit = null;
  if (totalPieces >= 100) {
    const rebateAmount = Math.round(totalAmount * 0.03);
    volumeBenefit = {
      level: 3,
      title: "Tier 3: Free Pan-India Freight + 3% Mill Cash Rebate",
      savings: `₹${rebateAmount.toLocaleString('en-IN')}`,
      note: "Maximum factory tier unlocked!"
    };
  } else if (totalPieces >= 50) {
    volumeBenefit = {
      level: 2,
      title: "Tier 2: 100% Free Pan-India Transport Freight Subsidy",
      savings: "₹1,500 Freight Waived",
      note: `Add ${100 - totalPieces} more pieces for 3% extra factory lot rebate!`
    };
  } else {
    volumeBenefit = {
      level: 1,
      title: "Tier 1: Standard Mill Direct Rates",
      note: `Add ${50 - totalPieces} more pieces to qualify for Free Pan-India Freight!`
    };
  }

  // Generate WhatsApp Master Purchase Order
  const generateMasterPOText = () => {
    let msg = `Namaste Kamakhya Trading Co!\n\nI want to place an official *Bulk Wholesale Purchase Order*:\n\n*PURCHASE ORDER BREAKDOWN:*\n`;
    items.forEach((item, idx) => {
      msg += `\n${idx + 1}. *${item.title}* (${item.sku})\n   • Variant: Color: ${item.color} | Size: ${item.size}\n   • Qty: ${item.quantity} pcs @ ₹${item.price}/pc = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });
    msg += `\n-------------------------\n*Total Lots:* ${items.length} SKUs\n*Total Quantity:* ${totalPieces} pcs\n*Estimated Subtotal:* ₹${totalAmount.toLocaleString('en-IN')}\n`;
    if (totalPieces >= 50) {
      msg += `*Eligible Volume Benefit:* ${volumeBenefit.title}\n`;
    }
    msg += `\n*Buyer Business Profile:*\n• Boutique / Firm Name:\n• GSTIN / City, State:\n• Preferred Transport Hub:\n\nPlease confirm ready stock availability and issue the formal GST proforma invoice.`;
    return msg;
  };

  const handleSendMasterPO = () => {
    const text = generateMasterPOText();
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPO = () => {
    const text = generateMasterPOText();
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md lg:max-w-lg bg-white shadow-2xl flex flex-col border-l border-neutral-200">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#0c0c0e] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Bulk Purchase Order Bag
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {items.length} SKUs • Direct Mill Invoicing
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close PO Drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Volume Tier Banner */}
          {items.length > 0 && (
            <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>{volumeBenefit.title}</span>
                </span>
                {volumeBenefit.savings && (
                  <span className="font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                    {volumeBenefit.savings}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                {volumeBenefit.note}
              </p>
            </div>
          )}

          {/* 3. Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-24 text-neutral-400">
                <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm font-bold text-neutral-700">Your bulk PO bag is empty</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Click &ldquo;+ Add to Bulk PO&rdquo; on any garment card or line-sheet to assemble an order.
                </p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}-${idx}`}
                  className="flex gap-3.5 p-3.5 bg-neutral-50/90 rounded-xl border border-neutral-200/90 transition-all hover:border-neutral-300"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono block">
                        {item.sku}
                      </span>
                      <div className="flex gap-2 text-[10px] text-neutral-600 font-medium mt-1">
                        <span>Color: <b>{item.color}</b></span>
                        <span>•</span>
                        <span>Size: <b>{item.size}</b></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                      <div>
                        <span className="text-xs font-black text-neutral-950">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          {' '}(₹{item.price}/pc)
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(idx, -1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-l cursor-pointer"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, 1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-r cursor-pointer"
                          title="Increase quantity"
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

          {/* 4. Footer & Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3.5">
              
              {/* Totals */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Total Lots / SKUs:</span>
                  <span className="font-bold text-neutral-950">{items.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Garments (Pieces):</span>
                  <span className="font-bold text-neutral-950">{totalPieces} pcs</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Estimated Subtotal:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-[10px] text-neutral-500 italic">
                * GST (5% / 12%) and freight carrier charges will be detailed on the official proforma invoice.
              </p>

              {/* Master WhatsApp Action */}
              <button
                onClick={handleSendMasterPO}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm active:scale-98 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Send Purchase Order on WhatsApp</span>
              </button>

              {/* Utility Row */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPO}
                  className="flex-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>{copiedQuote ? 'PO Copied' : 'Copy Order Text'}</span>
                </button>

                <button
                  onClick={() => setShowInvoicePreview(!showInvoicePreview)}
                  className="bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="View / Print Proforma Invoice"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{showInvoicePreview ? 'Hide Invoice' : 'Proforma'}</span>
                </button>

                <button
                  onClick={onClearItems}
                  className="text-xs text-rose-600 hover:underline px-2.5 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {/* Printable Proforma Invoice Preview */}
              {showInvoicePreview && (
                <div className="p-4 bg-white rounded-xl border border-neutral-300 text-xs space-y-3 font-sans print:fixed print:inset-0 print:z-50 print:bg-white print:p-8">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h5 className="font-bold text-neutral-900 uppercase">Kamakhya Trading Co</h5>
                      <p className="text-[10px] text-neutral-500">Proforma Estimate • Mill Dispatch</p>
                    </div>
                    <button
                      onClick={handlePrintInvoice}
                      className="px-2.5 py-1 bg-neutral-950 text-white rounded-md text-[10px] font-bold print:hidden flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Print</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1 text-[11px]">
                    {items.map((it, i) => (
                      <div key={i} className="flex justify-between border-b border-neutral-100 py-1">
                        <span>{it.title} ({it.quantity} pcs @ ₹{it.price})</span>
                        <span className="font-bold">₹{(it.quantity * it.price).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-neutral-200">
                    <span>Estimated Total:</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
