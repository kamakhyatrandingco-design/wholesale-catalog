import Link from 'next/link';

export const metadata = {
  title: "Terms and Conditions | KTC Fashion - Kamakhya Trading Co",
  description: "Commercial Wholesale Terms and Conditions for Kamakhya Trading Co (KTC Fashion). Covers minimum order quantities, payment terms, freight dispatch, inspection, and return policies.",
  alternates: {
    canonical: "https://ktcfashion.netlify.app/terms",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans">
      {/* Top Bar */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif font-black text-xl tracking-wider text-black">
              KTC <span className="font-sans text-xs font-light tracking-widest text-stone-500 uppercase">Fashion</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black transition-colors px-3 py-1.5 rounded-md border border-stone-200 hover:border-black"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Storefront
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="border-b border-stone-200 pb-8 mb-10">
          <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Commercial Policy</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-4">
            Wholesale Trade Terms and Conditions
          </h1>
          <p className="text-sm text-stone-600">
            Effective Date: October 2026 | Governing Entity: Kamakhya Trading Co (Surat, Gujarat, India)
          </p>
        </div>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-8 text-stone-700">
          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">1. Commercial Agreement Overview</h2>
            <p>
              These Terms and Conditions govern all commercial purchase orders, catalog bookings, and dispatch contracts entered into with Kamakhya Trading Co (&quot;KTC Fashion&quot;, &quot;Seller&quot;, &quot;we&quot;). By browsing our catalog, placing a wholesale Purchase Order (PO), or requesting consignment dispatch, the commercial buyer (&quot;Buyer&quot;, &quot;Merchant&quot;, &quot;Boutique Partner&quot;) confirms acceptance of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">2. Minimum Order Quantities (MOQ) and Sample Lots</h2>
            <div className="space-y-3">
              <p>
                <strong>Wholesale Commercial Production:</strong> Standard manufacturing lot orders require a minimum order quantity (MOQ) of 25 to 30 pieces per design silhouette, supplied in standard size assortments (M, L, XL, XXL) or pre-packed color sets.
              </p>
              <p>
                <strong>Sample Verification Orders:</strong> Verified boutique owners may purchase single sample pieces via Sample Mode at designated sample rates to evaluate fabric quality, embroidery craftsmanship, and fitting prior to placing production lots. Sample dispatch is limited to inspection purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">3. Pricing, GST, and Invoicing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Prices displayed in the online catalog represent direct mill-sourced wholesale rates on the wholesale portal, and curated retail rates on the retail storefront.</li>
              <li>Statutory Goods and Services Tax (GST) on apparel and textiles is applied as per Government of India regulations.</li>
              <li>Prices are subject to textile raw material market adjustments. Final invoice pricing is locked upon formal order confirmation by our trade desk.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">4. Commercial Payment Terms</h2>
            <p>
              Wholesale apparel consignments are dispatched against 100% advance payment via verified banking rails (NEFT, RTGS, IMPS, or corporate UPI). Cash-on-delivery (COD) is not extended for commercial bulk production lots due to custom fabric cuts and interstate freight regulations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">5. Freight, Dispatch, and Transit Insurance</h2>
            <div className="space-y-3">
              <p>
                <strong>Dispatch Timeline:</strong> Ready-stock lots are dispatched from Surat within 24 to 48 hours of payment realization. Made-to-order or fresh weave runs will adhere to production schedules agreed upon during PO booking.
              </p>
              <p>
                <strong>Transport Hubs:</strong> Goods are booked through established transport carriers (e.g. V-Trans, TCI Freight, SafeXpress, or designated regional parcel services). The official Lorry Receipt (LR / Bilty) will be shared directly on the Buyer&apos;s registered WhatsApp number.
              </p>
              <p>
                <strong>Freight Liability:</strong> Transit freight charges are payable on a &quot;To-Pay&quot; basis by the Buyer at their local destination delivery hub unless agreed otherwise in writing. Transit insurance can be arranged on the Buyer&apos;s written request.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">6. Quality Inspection and Return Policy</h2>
            <div className="space-y-3">
              <p>
                <strong>Commercial Industry Standard:</strong> In alignment with established Surat wholesale textile market customs, goods once sold and dispatched in sound merchantable condition cannot be returned or exchanged.
              </p>
              <p>
                <strong>Manufacturing Defect Claims:</strong> In the rare event of a genuine manufacturing defect (e.g., severe weave tears, missing embellishment panels, or major stain defects) or transit damage, the Buyer must notify our dispatch desk within <strong>48 hours of delivery</strong>.
              </p>
              <p className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-stone-800">
                <strong>Mandatory Requirement:</strong> Any claim for damage, missing garments, or transit loss must be substantiated with a continuous, uncut package unboxing video demonstrating the seal breach and parcel condition. Claims without video verification cannot be entertained.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">7. Color Variations and Fabric Specifications</h2>
            <p>
              While every care is taken in photographic representation, slight variations in color tone (5% to 8%) may occur due to screen calibration differences, digital monitor profiles, and seasonal textile dye bath variations. Handloom weaves and traditional Bandhani / Chanderi prints inherently exhibit minor artisanal irregularities that add authenticity and are not classified as defects.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">8. Intellectual Property and Catalog Assets</h2>
            <p>
              Product photographs, wholesale line sheets, brand trademarks, and catalog descriptions remain the exclusive commercial property of Kamakhya Trading Co. Authorized boutique partners are granted non-exclusive rights to use product imagery solely for promoting and retailing purchased garment lots.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">9. Legal Jurisdiction</h2>
            <p>
              All transactions, purchase orders, commercial contracts, and disputes arising out of or in connection with KTC Fashion shall be governed exclusively by the laws of India and subject to the exclusive jurisdiction of the competent courts in <strong>Surat, Gujarat, India</strong>.
            </p>
          </section>

          <section className="bg-stone-50 border border-stone-200 p-6 rounded-xl">
            <h2 className="font-serif text-lg font-bold text-stone-900 mb-2">10. Trade Desk Contact Details</h2>
            <p className="text-xs text-stone-600 mb-3">
              For purchase orders, formal tax invoices, and commercial disputes, direct your correspondence to:
            </p>
            <div className="text-xs space-y-1 text-stone-800">
              <p><strong>Trading Name:</strong> Kamakhya Trading Co (KTC Fashion)</p>
              <p><strong>Managing Partner:</strong> Hariom Joshi</p>
              <p><strong>Dispatch Hub:</strong> Ring Road Textile Market, Surat, Gujarat 395002, India</p>
              <p><strong>Commercial Helpline / WhatsApp:</strong> +91 63506 26582</p>
              <p><strong>Official Web Portal:</strong> https://ktcfashion.netlify.app</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 bg-white text-center text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Kamakhya Trading Co. All commercial rights reserved. Surat, Gujarat, India.</p>
      </footer>
    </div>
  );
}
