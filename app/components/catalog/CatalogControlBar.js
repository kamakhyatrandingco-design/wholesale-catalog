'use client';

export default function CatalogControlBar({
  searchQuery,
  setSearchQuery,
  isVoiceListening,
  onStartVoiceSearch,
  categories = [],
  activeCategory,
  setActiveCategory,
  viewMode = 'grid',
  setViewMode,
  sortBy,
  setSortBy,
  purchaseMode,
  totalResults = 0,
  onResetFilters
}) {
  const quickSearchChips = [
    "Ethnic under 1000",
    "Girls Partywear",
    "Western Wear",
    "Bulk sets under 600",
    "Free Size",
    "Chanderi Silk"
  ];

  const hasActiveFilters = activeCategory !== "All Collections" || Boolean(searchQuery) || sortBy !== "default";

  return (
    <div id="catalog-section" className="space-y-6 pt-8 pb-4">
      
      {/* 1. Natural Language Search & Voice Search Bar */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/90 p-2 sm:p-2.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-neutral-900/10 focus-within:border-neutral-900">
          
          <span className="pl-3 pr-1 text-purple-700 font-bold text-xs flex items-center gap-1.5 flex-shrink-0">
            <svg className="w-4 h-4 text-purple-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden sm:inline">AI Search</span>
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search natural styles: 'Ethnic under 1000', 'Partywear', 'Kurti below 700'..."
            className="w-full px-2 py-1.5 text-xs sm:text-sm text-neutral-800 focus:outline-none placeholder-neutral-400 bg-transparent"
          />

          {/* Web Speech API Voice Search Button */}
          <button
            type="button"
            onClick={onStartVoiceSearch}
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer ${
              isVoiceListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                : 'text-neutral-400 hover:text-black hover:bg-neutral-100'
            }`}
            title={isVoiceListening ? "Listening... Speak your query" : "Voice Search (Click to speak in Hindi/English)"}
            aria-label="Voice Search"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-neutral-400 hover:text-black font-bold px-2 py-1 flex-shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {isVoiceListening && (
          <div className="mt-2 text-center text-xs font-bold text-rose-600 bg-rose-50 py-1.5 px-4 rounded-full border border-rose-200 inline-block mx-auto animate-pulse">
            🎙️ Listening... Speak style or budget (e.g. &ldquo;Ethnic under 1000&rdquo;)
          </div>
        )}

        {/* Quick Intent Chips */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center text-xs">
          {quickSearchChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setSearchQuery(chip)}
              className="px-3 py-1 bg-white hover:bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200/90 transition-colors shadow-2xs active:scale-95 flex items-center gap-1 font-medium text-[11px] cursor-pointer"
            >
              <span>✨</span>
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="border-b border-neutral-200/80 bg-white/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 sm:space-x-8 overflow-x-auto pb-3 pt-2 scrollbar-hide text-xs font-bold uppercase tracking-widest text-neutral-400">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  activeCategory === category
                    ? 'text-neutral-950 border-b-2 border-neutral-950 pb-2 font-black'
                    : 'hover:text-neutral-900 pb-2 border-b-2 border-transparent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Catalog Control Bar (View Mode, Sorting, Mode Explainer) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
          
          {/* Left: Mode & Results Context */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-2.5 h-2.5 rounded-full ${purchaseMode === 'wholesale' ? 'bg-neutral-950' : 'bg-emerald-500'}`} />
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">
                Mode: <span className="uppercase font-black text-black">{purchaseMode}</span>
                <span className="text-neutral-400 font-normal ml-2">
                  ({totalResults} {purchaseMode === 'wholesale' ? 'factory lots' : 'pieces'})
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 hidden md:block">
                {purchaseMode === 'wholesale'
                  ? 'Wholesale rates per piece for bulk retail stockists (MOQ applies).'
                  : 'Single-piece sampling rate for boutique quality inspection.'}
              </p>
            </div>
          </div>

          {/* Right: View Mode Toggle & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            
            {/* View Mode Switcher: Grid vs Line-Sheet */}
            <div className="bg-neutral-100 p-1 rounded-xl flex items-center border border-neutral-200 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-black'
                }`}
                title="Visual Card Grid with lookbook drape"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode('linesheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'linesheet'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black'
                }`}
                title="B2B Wholesale Matrix Line-Sheet (fast lot ordering)"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Line-Sheet</span>
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-semibold hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="default">Featured Lots</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="moq-low">Lowest MOQ First</option>
              </select>
            </div>

            {/* Reset Filters Shortcut */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 underline flex-shrink-0 cursor-pointer"
              >
                Reset
              </button>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
