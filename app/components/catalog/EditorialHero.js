'use client';

export default function EditorialHero({
  productCount = 0,
  onExploreCatalog,
  onSelectCategory,
  isVercel = false
}) {
  const categoryTiles = [
    {
      title: "Ethnic Wear",
      subtitle: "Kurtis, Anarkalis & Festive Sets",
      count: isVercel ? "From ₹899" : "From ₹399/pc",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Bridal",
      subtitle: "Semi-Stitched Lehengas & Silk Sets",
      count: isVercel ? "From ₹3,499" : "From ₹1,899/pc",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Western Wear",
      subtitle: "Formal Blazers, Cargos & Co-ords",
      count: isVercel ? "From ₹999" : "From ₹449/pc",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Girls Partywear",
      subtitle: "Designer Frocks & Birthday Gowns",
      count: isVercel ? "From ₹799" : "From ₹349/pc",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="relative bg-[#f8f8f9] text-neutral-900 border-b border-neutral-200/80 overflow-hidden">
      
      {/* Editorial Main Hero Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Copy & CTAs */}
          <div className="md:col-span-7 space-y-5">
            
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white border border-neutral-200 text-[11px] font-bold text-neutral-800 uppercase tracking-widest shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isVercel ? "Curated Designer Apparel" : "Surat Weaving & Manufacturing Facility"}</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-neutral-950 uppercase">
              {isVercel ? (
                <>
                  Designer Ethnic <br />
                  <span className="font-serif italic font-normal text-neutral-600 lowercase tracking-normal">
                    women&apos;s &amp; girls&apos; festive silhouettes
                  </span>
                </>
              ) : (
                <>
                  Surat Mill Direct <br />
                  <span className="font-serif italic font-normal text-neutral-600 lowercase tracking-normal">
                    women&apos;s &amp; girls&apos; wholesale apparel
                  </span>
                </>
              )}
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
              {isVercel
                ? "Handcrafted festive ethnic wear, bridal lehengas, and contemporary silhouettes tailored with artisan embroideries, pure cottons, and standard Indian sizing. Order single pieces with direct doorstep shipping across India."
                : "Supplying verified boutique inventory, festive ethnic suits, kurtis, and children's designer wear directly to retailers and showroom stockists across India. Transparent lot rates, official GST invoicing, and factory dispatch from Surat."}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isVercel ? `Shop Collection (${productCount} Designs)` : `Explore Full Catalog (${productCount} SKUs)`}
              </button>

              <a
                href={isVercel
                  ? "https://wa.me/916350626582?text=Namaste%20KTC%20Fashion!%20I%20am%20interested%20in%20ordering%20from%20your%20designer%20collection."
                  : "https://wa.me/916350626582?text=Namaste%20Kamakhya%20Trading%20Co!%20I%20want%20to%20view%20your%20latest%20factory%20wholesale%20line-sheets."}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white hover:bg-neutral-50 text-neutral-950 border border-neutral-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-2xs flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{isVercel ? "Order on WhatsApp" : "Direct Mill WhatsApp"}</span>
              </a>
            </div>

            {/* Proof Points Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                <span>{isVercel ? "Single Piece Orders" : "Low 30 to 50 Pc MOQs"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                <span>Dispatch within 24 to 48 Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                <span>{isVercel ? "Standard Indian Sizing (M-XXL)" : "Single-Piece Sample Inspection"}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-100 group">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
                alt="Kamakhya Summer Festive Lookbook"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

              {/* Floating Featured Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-200/90 flex items-center justify-between text-xs shadow-xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    {isVercel ? "Featured Silhouettes" : "Featured Factory Lot"}
                  </span>
                  <span className="font-bold text-neutral-950 text-sm">
                    Chanderi Zari Festive Suit
                  </span>
                </div>
                <div className="text-right">
                  <span className="bg-neutral-950 text-white px-3 py-1 rounded-lg text-xs font-black inline-block">
                    {isVercel ? "₹1,199" : "₹599 / pc"}
                  </span>
                  {!isVercel && (
                    <span className="block text-[9px] text-neutral-500 font-bold mt-0.5">MOQ: 30 Pcs</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Category Blocks Grid */}
        <div className="mt-12 pt-8 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {isVercel ? "Curated Collections" : "Curated Factory Lines"}
            </h3>
            <span className="text-xs font-semibold text-neutral-400">
              Tap any category to filter
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categoryTiles.map((cat) => (
              <button
                key={cat.title}
                onClick={() => onSelectCategory(cat.title)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/90 text-left shadow-2xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider block">
                    {cat.count}
                  </span>
                  <span className="text-sm font-bold tracking-tight block">
                    {cat.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium truncate block">
                    {cat.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
