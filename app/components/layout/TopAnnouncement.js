'use client';

export default function TopAnnouncement({
  whatsappNumber = "916350626582",
  onOpenGuide,
  onOpenAuth
}) {
  return (
    <div className="bg-[#0f0f11] text-neutral-300 text-[11px] py-2 px-4 border-b border-neutral-800 tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Mill Status */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-200 uppercase tracking-wider text-[10px] sm:text-[11px]">
            Kamakhya Trading Co • Direct Factory Mill Wholesale &amp; Manufacturing
          </span>
          <span className="hidden lg:inline text-neutral-500 font-normal">
            | Summer Festive 2026 Production Running
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
          <button
            onClick={onOpenGuide}
            className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>📖</span>
            <span>Buyer Guide</span>
          </button>
          
          <button
            onClick={onOpenAuth}
            className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>👤</span>
            <span>Restock &amp; Buyer Portal</span>
          </button>

          <span className="hidden md:inline text-neutral-600">•</span>
          <span className="hidden md:inline text-neutral-400 font-medium">Pan-India Freight Dispatch</span>

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
