'use client';

import { useState, useEffect } from 'react';

export default function CommandPalette({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  onNavigateTab,
  onOpenCreateProduct,
  onOpenCreateDraftOrder
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { id: 'products', title: 'Go to Products & Variants', category: 'Navigation', shortcut: 'P' },
    { id: 'orders', title: 'Go to Orders & Wholesale POs', category: 'Navigation', shortcut: 'O' },
    { id: 'inventory', title: 'Go to Inventory & Warehouses', category: 'Navigation', shortcut: 'I' },
    { id: 'price_lists', title: 'Go to B2B Price Lists & Tiers', category: 'Navigation', shortcut: 'T' },
    { id: 'customers', title: 'Go to Customer Groups', category: 'Navigation', shortcut: 'C' },
    { id: 'promotions', title: 'Go to Promotions & Coupons', category: 'Navigation', shortcut: 'R' },
    { id: 'workflows', title: 'Go to Medusa Workflows Orchestrator', category: 'Navigation', shortcut: 'W' },
    { id: 'gateway', title: 'Go to Microservice Gateway Diagnostics', category: 'Navigation', shortcut: 'G' }
  ];

  const filteredNav = quickNav.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
  const filteredProducts = products.filter(p => 
    (p.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#0b0f17] border border-zinc-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-zinc-200">
        
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search products..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4 text-xs">
          
          {/* Quick Actions */}
          <div>
            <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase text-zinc-500">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateProduct();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">+</span>
                  <span>Create New Product</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Action</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCreateDraftOrder();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">+</span>
                  <span>Create Draft Wholesale Quote</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Action</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase text-zinc-500">
                Navigation
              </div>
              <div className="space-y-0.5">
                {filteredNav.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
                  >
                    <span>{item.title}</span>
                    <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {item.shortcut}
                    </kbd>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Matches */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase text-zinc-500">
                Catalog Products
              </div>
              <div className="space-y-0.5">
                {filteredProducts.map(p => (
                  <button
                    key={p.id || p.slug}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="font-mono text-amber-300 text-[11px]">₹{p.wholesale_price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
          <span>Navigate with arrows or click</span>
          <span>Medusa 2.0 Command Bar</span>
        </div>
      </div>
    </div>
  );
}
