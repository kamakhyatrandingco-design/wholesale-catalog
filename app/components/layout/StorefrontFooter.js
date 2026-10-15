'use client';

import Link from 'next/link';

export default function StorefrontFooter({
  whatsappNumber = "916350626582",
  onOpenGuide,
  onOpenAuth,
  onOpenCalculator,
  onOpenAiStudio
}) {
  return (
    <footer className="bg-[#0c0c0e] text-neutral-400 text-xs border-t border-neutral-800/90 pt-16 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Row 1: B2B Mill Guarantee Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800/80">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base">
              🏭
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Direct Mill Pricing</h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              Zero middlemen commissions. Sourced and manufactured directly from integrated textile looms for optimal retailer margins.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base">
              📦
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Reinforced Bale Packing</h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              High-density water-resistant plastic wrapping and corrugated strapping to ensure spotless transit across India.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base">
              🚚
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Pan-India Freight Dispatches</h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              Partnered with top logistics providers (V-Trans, TCI Freight, Safechem, Delhivery) with LR / consignment slips shared on dispatch.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base">
              📜
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">GST Compliant Invoicing</h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              100% tax-compliant proforma invoices provided for full Input Tax Credit (ITC) claiming under 5% / 12% apparel GST slabs.
            </p>
          </div>
        </div>

        {/* Row 2: Navigation, Services, Legal & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl font-black tracking-tight text-white uppercase">
                Kamakhya
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-800 text-white rounded-xs">
                Trading Co
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed pr-4">
              Premium women&apos;s and girls&apos; wholesale apparel manufacturer. Supplying high-velocity festive ethnic wear, modern western ensembles, bridal lehengas, and children&apos;s partywear to boutiques, chain stores, and online sellers.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Daily factory dispatch from Surat &amp; Jaipur manufacturing hubs.</span>
            </div>
          </div>

          {/* Wholesale Services */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Buyer Tools &amp; Portals</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  📖 B2B Buyer Onboarding Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  📊 Boutique Resale ROI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAiStudio}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  ✨ AI Virtual Try-On Studio
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  👤 Buyer Login &amp; Restock Requests
                </button>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  ⚙️ Factory Administration Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Logistics & Transporters */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Logistics Partners</h5>
            <ul className="space-y-1.5 text-[11px] text-neutral-400">
              <li>• V-Trans India Ltd</li>
              <li>• TCI Freight &amp; Safechem</li>
              <li>• Delhivery Cargo / Surface</li>
              <li>• GATI-KWE Logistics</li>
              <li>• BlueDart Express (Air Samples)</li>
              <li>• All State Local Transport</li>
            </ul>
          </div>

          {/* Direct WhatsApp Contact */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Mill Trade Desk</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Have a custom manufacturing inquiry or need immediate stock availability confirmation?
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Namaste Kamakhya Trading Co! I want to discuss bulk wholesale catalog and custom manufacturing.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp: +91 63506 26582</span>
            </a>
          </div>

        </div>

        {/* Row 3: Bottom Bar & Legal */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Kamakhya Trading Co. Direct Factory Mill Wholesale &amp; Manufacturing.
          </div>
          <div className="flex items-center gap-4">
            <span>Wholesale B2B Only</span>
            <span>•</span>
            <span>GST Registered</span>
            <span>•</span>
            <span>All India Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
