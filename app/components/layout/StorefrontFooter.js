'use client';

import Link from 'next/link';

export default function StorefrontFooter({
  whatsappNumber = "916350626582",
  onOpenGuide,
  onOpenAuth,
  onOpenAbout,
  isVercel = false
}) {
  return (
    <footer className="bg-[#0c0c0e] text-neutral-400 text-xs border-t border-neutral-800/90 pt-16 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Row 1: Guarantee Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800/80">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
              {isVercel ? "Artisan Craftsmanship" : "Direct Mill Pricing"}
            </h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              {isVercel
                ? "Exquisite embroidery, premium fabrics, and tailored finishing curated for timeless festive elegance."
                : "Zero middlemen markups. Sourced and manufactured directly from integrated textile looms for competitive commercial rates."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
              {isVercel ? "Protective Packaging" : "Reinforced Bale Packing"}
            </h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              {isVercel
                ? "Carefully inspected and securely packaged ensuring each apparel piece arrives in pristine, ready-to-wear condition."
                : "High-density water-resistant plastic wrapping and corrugated strapping to ensure spotless transit across India."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
              {isVercel ? "Pan-India Express Delivery" : "Pan-India Freight Dispatches"}
            </h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              {isVercel
                ? "Fast, tracked doorstep shipping across all Indian postal pin codes with continuous transit tracking updates."
                : "Partnered with commercial logistics carriers (V-Trans, TCI Freight, Safechem, Delhivery) with LR / consignment slips shared on dispatch."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
              {isVercel ? "Authenticity Guaranteed" : "GST Compliant Invoicing"}
            </h4>
            <p className="text-[12px] text-neutral-400 leading-relaxed">
              {isVercel
                ? "100% genuine ethnic fabrics and tailored silhouettes with transparent pricing and complete customer care."
                : "100% tax-compliant proforma invoices provided for full Input Tax Credit (ITC) claiming under 5% / 12% apparel GST slabs."}
            </p>
          </div>
        </div>

        {/* Row 2: Navigation, Services, Legal & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl font-black tracking-tight text-white uppercase">
                {isVercel ? "KTC" : "Kamakhya"}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-800 text-white rounded-xs">
                {isVercel ? "Fashion" : "Trading Co"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed pr-4">
              {isVercel
                ? "Curated women's and girls' ethnic couture, festive bridal lehengas, contemporary western silhouettes, and girls' celebration apparel delivered directly to your doorstep."
                : "Women's and girls' wholesale apparel manufacturing. Supplying festive ethnic wear, modern western silhouettes, bridal lehengas, and children's partywear to boutiques, retail stores, and regional stockists."}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                {isVercel
                  ? "Daily dispatches from Surat and Jaipur design ateliers."
                  : "Daily factory dispatch from Surat and Jaipur manufacturing hubs."}
              </span>
            </div>
          </div>

          {/* Services / Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              {isVercel ? "Customer Navigation" : "Buyer Navigation"}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {isVercel ? "Apparel Sizing & Care Guide" : "B2B Buyer Onboarding Guide"}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  {isVercel ? "Customer Account & Orders" : "Buyer Login & Restock Requests"}
                </button>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors block"
                >
                  {isVercel ? "Terms & Conditions" : "Wholesale Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-neutral-300 transition-colors block text-neutral-500"
                >
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Assurance */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              {isVercel ? "Customer Experience" : "Logistics Partners"}
            </h5>
            <ul className="space-y-1.5 text-[11px] text-neutral-400">
              {isVercel ? (
                <>
                  <li>Doorstep Delivery Across India</li>
                  <li>WhatsApp Order Confirmation</li>
                  <li>Transparent All-Inclusive Pricing</li>
                  <li>Hand-Inspected Quality</li>
                  <li>Secure Packaging</li>
                  <li>Dedicated Styling Support</li>
                </>
              ) : (
                <>
                  <li>V-Trans India Ltd</li>
                  <li>TCI Freight &amp; Safechem</li>
                  <li>Delhivery Surface Cargo</li>
                  <li>GATI-KWE Logistics</li>
                  <li>BlueDart Express (Air Samples)</li>
                  <li>Regional Transport Hubs</li>
                </>
              )}
            </ul>
          </div>

          {/* Direct WhatsApp Contact */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              {isVercel ? "Customer Concierge" : "Mill Trade Desk"}
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isVercel
                ? "Have questions regarding sizing, custom color options, or express delivery dates?"
                : "Have a custom manufacturing inquiry or need immediate stock availability confirmation?"}
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                isVercel
                  ? "Namaste KTC Fashion! I would like assistance with an order from your retail collection."
                  : "Namaste Kamakhya Trading Co! I want to discuss bulk wholesale catalog and custom manufacturing."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
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
            &copy; {new Date().getFullYear()} {isVercel ? "KTC Fashion. Curated Designer Silhouettes & Ethnic Apparel." : "Kamakhya Trading Co. Direct Factory Mill Wholesale & Manufacturing."}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <span>{isVercel ? "Direct Retail Storefront" : "Wholesale B2B Only"}</span>
            <span>&bull;</span>
            <span>GST Registered</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
