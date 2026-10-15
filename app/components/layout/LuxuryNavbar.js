'use client';

import Link from 'next/link';

export default function LuxuryNavbar({
  purchaseMode,
  setPurchaseMode,
  quoteItemCount = 0,
  quoteTotalAmount = 0,
  onOpenCart,
  onOpenAiStudio,
  onOpenCalculator,
  onOpenAuth,
  onResetFilters
}) {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand Identity */}
          <div
            className="flex-shrink-0 cursor-pointer flex flex-col group select-none"
            onClick={onResetFilters}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase group-hover:opacity-90 transition-opacity">
                Kamakhya
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-900 text-white rounded-xs">
                Trading Co
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-neutral-500 mt-0.5">
              Mill-Direct Women&apos;s &amp; Girls&apos; Apparel Wholesale B2B
            </span>
          </div>

          {/* Center Navigation Shortcuts (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-neutral-600">
            <button
              onClick={onResetFilters}
              className="hover:text-black transition-colors cursor-pointer"
            >
              All Collections
            </button>
            <button
              onClick={onOpenAiStudio}
              className="hover:text-purple-700 transition-colors flex items-center gap-1 cursor-pointer text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/70"
            >
              <span>✨</span>
              <span>AI Try-On Studio</span>
            </button>
            <button
              onClick={onOpenCalculator}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70"
            >
              <span>📊</span>
              <span>Boutique Margin Engine</span>
            </button>
          </div>

          {/* Right Action Stack */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wholesale vs Retail Mode Toggle */}
            <div className="bg-neutral-100 p-1 rounded-full flex items-center border border-neutral-200 shadow-inner">
              <button
                onClick={() => setPurchaseMode('wholesale')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  purchaseMode === 'wholesale'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Wholesale bulk lots at direct mill pricing (MOQ applied)"
              >
                Wholesale (Bulk)
              </button>
              <button
                onClick={() => setPurchaseMode('retail')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  purchaseMode === 'retail'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Single piece sample pricing for boutique inspection"
              >
                Retail (Single)
              </button>
            </div>

            {/* Buyer Portal Button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 transition-colors cursor-pointer"
              title="Buyer Portal & Restock Requests"
            >
              <span>👤</span>
              <span className="hidden md:inline">Buyer Portal</span>
            </button>

            {/* Bulk PO Drawer Bag Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Open Bulk Purchase Order Drawer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">Bulk PO</span>
              
              {quoteItemCount > 0 ? (
                <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-500 text-black leading-none animate-pulse">
                  {quoteItemCount}
                </span>
              ) : null}

              {quoteTotalAmount > 0 && (
                <span className="hidden xl:inline text-neutral-300 font-mono text-[11px] border-l border-neutral-700 pl-2">
                  ₹{quoteTotalAmount.toLocaleString('en-IN')}
                </span>
              )}
            </button>

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex text-xs font-bold px-3 py-2 text-neutral-500 hover:text-black border border-neutral-200 hover:border-neutral-400 rounded-xl transition-all"
              title="Open Factory Admin Portal"
            >
              Admin
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}
