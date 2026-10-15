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
                Direct Mill Fashion Manufacturing &amp; Wholesale B2B
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Story & Factory Overview */}
        <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <p>
            <strong>Kamakhya Trading Co (KTC)</strong> is a premier integrated apparel manufacturer delivering high-velocity ethnic wear, modern western ensembles, bridal lehengas, and girls&apos; partywear directly from factory looms to retailers across India.
          </p>
          <p>
            By eliminating multiple intermediary distributor markups, KTC empowers boutique owners and independent apparel merchants to purchase genuine mill-direct inventory at competitive factory rates with guaranteed high resale profit margins (50% to 140%).
          </p>
        </div>

        {/* Live Cloud Hosting Platforms */}
        <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Official Cloud Deployments (Both Platforms Active)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
              Multi-Cloud
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            The platform is simultaneously hosted and production-ready on both <strong>Netlify</strong> and <strong>Vercel</strong>, synchronizing with the same headless catalog and Medusa 2.0 architecture:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Netlify Card */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <span className="text-[#00C7B7]">🌐</span>
                    <span>Netlify Production</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1 truncate">
                  ktcfashion.netlify.app
                </div>
              </div>

              <a
                href="https://ktcfashion.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3 py-1.5 bg-[#00C7B7] hover:bg-[#00b0a2] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Open on Netlify ↗
              </a>
            </div>

            {/* Vercel Card */}
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                    <span>▲</span>
                    <span>Vercel Edge</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-1 truncate">
                  wholesale-catalog-ktc8.vercel.app
                </div>
              </div>

              <a
                href="https://wholesale-catalog-ktc8.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3 py-1.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Open on Vercel ↗
              </a>
            </div>
          </div>
        </div>

        {/* Dispatch & Contact Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200 text-xs text-neutral-500">
          <div>
            📍 Surat Weaving Mills &bull; Jaipur Finishing &bull; Pan-India Dispatch
          </div>
          <div className="font-mono text-neutral-700 font-semibold">
            Trade Desk: +91 63506 26582
          </div>
        </div>

      </div>
    </div>
  );
}
