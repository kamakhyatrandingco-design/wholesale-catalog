'use client';

export default function TopAnnouncement({
  whatsappNumber = "916350626582",
  onOpenGuide,
  onOpenAuth,
  isRetail = false,
  isVercel = false
}) {
  const retailMode = isRetail || isVercel;

  return (
    <div className="bg-[#0f0f11] text-neutral-300 text-[11px] py-2 px-4 border-b border-neutral-800 tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Status */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-200 uppercase tracking-wider text-[10px] sm:text-[11px]">
            {retailMode
              ? "KTC Fashion • Handcrafted Designer Ethnic & Festive Apparel"
              : "Kamakhya Trading Co • Direct Mill-Sourced Wholesale Apparel"}
          </span>
          <span className="hidden lg:inline text-neutral-500 font-normal">
            | Summer Festive 2026 Collection Live
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
          <button
            onClick={onOpenGuide}
            className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{retailMode ? "Shopping Guide" : "Buyer Guide"}</span>
          </button>
          
          <button
            onClick={onOpenAuth}
            className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>{retailMode ? "Customer Account" : "Buyer Account"}</span>
          </button>

          <span className="hidden md:inline text-neutral-600">•</span>
          <span className="hidden md:inline text-neutral-400 font-medium">
            {retailMode ? "Doorstep Delivery Across India" : "Pan-India Freight Dispatches"}
          </span>

          <span className="text-neutral-600">•</span>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors inline-flex items-center gap-1"
          >
            <span>WhatsApp:</span>
            <span>+91 63506 26582</span>
          </a>
        </div>
      </div>
    </div>
  );
}
