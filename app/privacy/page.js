import Link from 'next/link';

export const metadata = {
  title: "Privacy Policy | KTC Fashion - Kamakhya Trading Co",
  description: "B2B Privacy Policy for Kamakhya Trading Co (KTC Fashion). Learn how we handle wholesale buyer information, GST credentials, and commercial communications.",
  alternates: {
    canonical: "https://ktcfashion.netlify.app/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
          <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Legal Compliance</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-4">
            B2B Commercial Privacy Policy
          </h1>
          <p className="text-sm text-stone-600">
            Last Updated: October 2026 | Governing Entity: Kamakhya Trading Co (Surat, Gujarat, India)
          </p>
        </div>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-8 text-stone-700">
          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">1. Scope and Applicability</h2>
            <p>
              This Privacy Policy outlines how Kamakhya Trading Co (&quot;KTC Fashion&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, maintains, and processes business and personal contact information through our B2B commercial portal (ktcfashion.netlify.app) and associated WhatsApp trade desks. This policy applies strictly to boutique proprietors, apparel retailers, commercial procurement agents, and retail buyers who engage with our wholesale catalog.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">
              To facilitate genuine trade inquiries, wholesale purchase orders, and nationwide freight shipments, we collect the following business credentials:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li><strong>Commercial Identification:</strong> Registered business or boutique name, proprietor name, trade license references, and Goods and Services Tax Identification Number (GSTIN) where applicable.</li>
              <li><strong>Contact Coordinates:</strong> Primary telephone number, WhatsApp messaging number, email address, and billing contact details.</li>
              <li><strong>Logistics and Dispatch Data:</strong> Physical store address, warehouse delivery points, designated transport hub, and PIN code.</li>
              <li><strong>Commercial Inquiries:</strong> Order line items, requested quantities, fabric customizations, and purchase order histories.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">3. Purpose of Data Processing</h2>
            <p className="mb-2">
              Collected commercial information is processed strictly for the following operational objectives:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>Generating compliant commercial tax invoices under applicable Indian Goods and Services Tax (GST) statutes.</li>
              <li>Booking third-party commercial transport carriers or courier services for consignment dispatch from Surat and Jaipur hubs.</li>
              <li>Communicating dispatch status, proof of consignment (bilty/LR copies), and tracking references via official WhatsApp desks.</li>
              <li>Verifying legitimate boutique trade credentials to protect wholesale price confidentiality.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">4. Information Sharing and Non-Disclosure</h2>
            <p>
              Kamakhya Trading Co operates under strict trade ethics. We never sell, rent, monetize, or disclose buyer lists or merchant contact databases to third-party advertising networks or marketing brokerages. Information is shared only with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700 mt-2">
              <li>Verified logistics partners and freight forwarders strictly necessary to deliver physical consignments.</li>
              <li>Banking partners and authorized payment gateways for settlement verification.</li>
              <li>Statutory taxation authorities in compliance with Indian commercial regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">5. Payment and Financial Security</h2>
            <p>
              All wholesale transactions are processed through verified commercial banking channels, including Direct NEFT/RTGS wire transfers and registered corporate UPI merchant accounts. We do not store sensitive payment card numbers, CVVs, or online banking passwords on our web servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">6. Local Storage and Client Cookies</h2>
            <p>
              Our storefront utilizes minimal local storage keys on your client device solely to preserve functional preferences:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700 mt-2">
              <li>Preserving active items added to your wholesale purchase order draft.</li>
              <li>Saving selected purchase mode (Wholesale Lot vs Sample Piece).</li>
              <li>Recording administrative session authentication tokens for authorized store operators.</li>
            </ul>
            <p className="mt-2">
              We do not utilize invasive cross-site tracking scripts or behavioral advertising beacons.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">7. Data Retention and Buyer Rights</h2>
            <p>
              Commercial transaction records, purchase orders, and tax invoices are retained in accordance with statutory accounting periods under Indian law. Registered buyers may request verification, correction, or deletion of their contact information by contacting our desk directly.
            </p>
          </section>

          <section className="bg-stone-50 border border-stone-200 p-6 rounded-xl">
            <h2 className="font-serif text-lg font-bold text-stone-900 mb-2">8. Grievance and Trade Desk Contact</h2>
            <p className="text-xs text-stone-600 mb-3">
              For any queries regarding this Privacy Policy or your commercial data, contact our principal trading office:
            </p>
            <div className="text-xs space-y-1 text-stone-800">
              <p><strong>Entity:</strong> Kamakhya Trading Co (KTC Fashion)</p>
              <p><strong>Managing Representative:</strong> Hariom Joshi</p>
              <p><strong>Primary Trading Address:</strong> Ring Road Textile Market Hub, Surat, Gujarat 395002, India</p>
              <p><strong>Commercial Helpline / WhatsApp:</strong> +91 63506 26582</p>
              <p><strong>Portal:</strong> https://ktcfashion.netlify.app</p>
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
