'use client';

export default function AdminHeader({
  activeTab,
  onOpenCreateProduct,
  onOpenCreateDraftOrder,
  onRestoreCatalog,
  onSyncModules,
  isRefreshing = false,
  dbStatus = { configured: false, provider: 'local' }
}) {
  const tabTitles = {
    products: 'Products & Variants',
    orders: 'Orders & Wholesale POs',
    inventory: 'Inventory & Multi-Warehouse',
    price_lists: 'B2B Price Lists & Tiers',
    customers: 'Customer Groups & Boutiques',
    promotions: 'Promotions & Volume Codes',
    workflows: 'Medusa Workflows Orchestrator',
    gateway: 'Microservices & Gateway Health',
    settings: 'Settings & Master Security'
  };

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500 font-mono">Kamakhya</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">Admin</span>
        <span className="text-zinc-700">/</span>
        <span className="font-semibold text-zinc-100">{tabTitles[activeTab] || 'Dashboard'}</span>
      </div>

      {/* 2. Actions & System Status */}
      <div className="flex items-center gap-2.5">
        {dbStatus?.configured ? (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] text-emerald-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud DB: {dbStatus.provider.toUpperCase()}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            <span>Storage: Local Mode</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] text-emerald-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Medusa Engine: Online</span>
        </div>

        <button
          onClick={onSyncModules}
          disabled={isRefreshing}
          className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
          title="Refresh and sync catalog modules"
        >
          <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Sync</span>
        </button>

        <button
          onClick={onRestoreCatalog}
          className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/80 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
          title="Restore factory catalog if any default items were accidentally hidden"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Restore Factory Items</span>
        </button>

        {activeTab === 'orders' ? (
          <button
            onClick={onOpenCreateDraftOrder}
            className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>New Draft Order</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreateProduct}
            className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>New Product</span>
          </button>
        )}
      </div>
    </header>
  );
}
