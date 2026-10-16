'use client';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-black text-sm shadow-md">
              KTC
            </div>
            <div>
              <h2 className="text-xl font-black font-serif-display uppercase tracking-tight text-neutral-950">
                Kamakhya Trading Co
              </h2>
              <p className="text-xs text-neutral-500 font-semibold">
                Direct Mill-Sourced Apparel &amp; Wholesale Trade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Story & Sourcing Overview */}
        <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <p>
            <strong>Kamakhya Trading Co (KTC)</strong> sources high-quality apparel directly from verified textile mills in Surat and Jaipur, supplying curated festive ethnic wear, modern western ensembles, bridal lehengas, and girls&apos; partywear across India.
          </p>
          <p>
            We take items directly from the mills and provide them at direct wholesale rates. By eliminating middle-tier markups, KTC empowers boutique owners, independent retailers, and shoppers to access genuine mill-sourced collections with complete transparency.
          </p>
        </div>

        {/* Live Cloud Hosting Platforms */}
        <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Official Deployments</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 font-semibold">
              Multi-Cloud
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Dedicated portals configured for our retail customers and B2B wholesale partners:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Netlify Card - Retail */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <span>Retail Storefront</span>
                  </span>
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-md border border-teal-200">
                    Netlify
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1 truncate">
                  ktcfashion.netlify.app
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Single pieces, doorstep delivery, no MOQs
                </div>
              </div>

              <a
                href="https://ktcfashion.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3 py-1.5 bg-[#00C7B7] hover:bg-[#00b0a2] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Open Retail Store &rarr;
              </a>
            </div>

            {/* Vercel Card - Wholesale */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <span>Wholesale Sourcing</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                    Vercel
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1 truncate">
                  wholesale-catalog-ktc8.vercel.app
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  B2B lots, wholesale ex-mill rates, bulk POs
                </div>
              </div>

              <a
                href="https://wholesale-catalog-ktc8.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3 py-1.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Open Wholesale Portal &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Dispatch & Contact Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200 text-xs text-neutral-500">
          <div>
            Surat &amp; Jaipur Mill Sourcing &bull; Quality Checked &bull; Pan-India Dispatch
          </div>
          <div className="font-mono text-neutral-700 font-semibold">
            Trade Desk: +91 63506 26582
          </div>
        </div>

      </div>
    </div>
  );
}
