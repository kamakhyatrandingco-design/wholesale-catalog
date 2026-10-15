'use client';

export default function MobileBottomDock({
  quoteItemCount = 0,
  quoteTotalAmount = 0,
  onOpenCart,
  onOpenCalculator,
  whatsappNumber = "916350626582",
  onScrollToCatalog
}) {
  return (
    <aside
      aria-label="Mobile Quick Action Dock"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around gap-1 text-[10px] font-bold text-neutral-600">
        
        {/* Catalog Jump */}
        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:text-black transition-colors flex-1"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Catalog</span>
        </button>

        {/* Margin Calc */}
        <button
          onClick={onOpenCalculator}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-emerald-700 hover:text-emerald-900 transition-colors flex-1"
        >
          <span className="text-base mb-0.5">📊</span>
          <span>Margins</span>
        </button>

        {/* WhatsApp Chat */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Kamakhya Trading Co! I want to inquire about bulk wholesale catalogs and factory rates.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors flex-1"
        >
          <svg className="w-5 h-5 mb-0.5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Chat</span>
        </a>

        {/* Bulk PO Drawer (Highlighted Action) */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center p-1.5 px-3 rounded-xl bg-neutral-950 text-white font-bold flex-1 shadow-sm active:scale-95"
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {quoteItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {quoteItemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5">Bulk PO</span>
        </button>

      </div>
    </aside>
  );
}
