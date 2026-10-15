'use client';

import Link from 'next/link';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  productCount = 0,
  orderCount = 0,
  onLogout
}) {
  const navigationGroups = [
    {
      title: 'CORE COMMERCE',
      items: [
        {
          id: 'products',
          label: 'Products & Variants',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          badge: productCount
        },
        {
          id: 'orders',
          label: 'Orders & Drafts',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          badge: orderCount
        },
        {
          id: 'inventory',
          label: 'Inventory & Warehouses',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          badge: '3 Locs'
        }
      ]
    },
    {
      title: 'B2B & PRICING',
      items: [
        {
          id: 'price_lists',
          label: 'Price Lists & Tiers',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
          badge: '3 Tiers'
        },
        {
          id: 'customers',
          label: 'Customer Groups',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          badge: '3 Groups'
        },
        {
          id: 'promotions',
          label: 'Promotions & Coupons',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          ),
          badge: '3 Active'
        }
      ]
    },
    {
      title: 'ENGINE & WORKFLOWS',
      items: [
        {
          id: 'workflows',
          label: 'Medusa Workflows',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          badge: 'Live'
        },
        {
          id: 'gateway',
          label: 'Microservice Gateway',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          ),
          badge: '5 Ports'
        },
        {
          id: 'settings',
          label: 'Settings & Master Key',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          badge: null
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0b0f17] border-r border-zinc-800/80 flex flex-col flex-shrink-0 h-screen sticky top-0 select-none">
      {/* 1. Brand & Medusa Status Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-md shadow-amber-500/20">
            KTC
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Kamakhya</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-semibold border border-zinc-700/60">
                MEDUSA
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>v2.0 B2B Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Command Palette Quick Launcher */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenCommandPalette}
          type="button"
          className="w-full bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs flex items-center justify-between transition-all group"
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[11px]">Quick search...</span>
          </span>
          <kbd className="text-[10px] bg-zinc-800 border border-zinc-700/80 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <div className="px-2.5 pb-1.5 text-[10px] font-mono font-semibold tracking-wider text-zinc-500">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-zinc-800/90 text-white font-medium border border-zinc-700/60 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className={`${isActive ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-zinc-800/80 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 4. Footer & Profile */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-zinc-950/40">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 text-xs transition-colors"
        >
          <span className="flex items-center gap-2 text-[11px]">
            <span>Storefront</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">↗ Open</span>
        </Link>

        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300">
              A
            </div>
            <div>
              <div className="text-[11px] font-semibold text-zinc-200 leading-tight">Admin</div>
              <div className="text-[9px] font-mono text-zinc-500">PIN: 970771</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
