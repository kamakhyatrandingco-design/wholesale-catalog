'use client';

import { useState, useMemo } from 'react';

export default function ProductsView({
  products = [],
  isLoading = false,
  onEditProduct,
  onDeleteProduct,
  onOpenCreateProduct
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState('newest');

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery || 
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.fabric || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

      const stock = Number(p.stock !== undefined ? p.stock : 120);
      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = stock >= 30;
      if (stockFilter === 'low_stock') matchesStock = stock > 0 && stock < 30;
      if (stockFilter === 'out_of_stock') matchesStock = stock === 0;

      return matchesSearch && matchesCat && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.wholesale_price || 0) - (b.wholesale_price || 0);
      if (sortBy === 'price_desc') return (b.wholesale_price || 0) - (a.wholesale_price || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0; // Default order
    });
  }, [products, searchQuery, categoryFilter, stockFilter, sortBy]);

  // Metrics
  const metrics = useMemo(() => {
    const totalSkus = products.length;
    const collectionsCount = categories.length - 1;
    let lowStockCount = 0;
    let totalUnits = 0;

    products.forEach(p => {
      const stock = Number(p.stock !== undefined ? p.stock : 120);
      if (stock > 0 && stock < 30) lowStockCount++;
      totalUnits += stock;
    });

    return { totalSkus, collectionsCount, lowStockCount, totalUnits };
  }, [products, categories]);

  return (
    <div className="space-y-6">
      {/* 1. Medusa Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">TOTAL CATALOG SKUs</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.totalSkus}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>●</span> Live in headless line-sheet
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">ACTIVE COLLECTIONS</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.collectionsCount}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Ethnic, Western, Bridal</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">LOW STOCK ALERTS</div>
          <div className={`text-2xl font-bold mt-1 ${metrics.lowStockCount > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
            {metrics.lowStockCount}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Threshold: &lt; 30 pieces</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">ESTIMATED INVENTORY</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.totalUnits.toLocaleString('en-IN')} pcs</div>
          <div className="text-[10px] text-zinc-400 mt-1">Across 3 mill warehouses</div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, or fabric..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <svg className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (≥30)</option>
            <option value="low_stock">Low Stock (&lt;30)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="newest">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title">Title (A-Z)</option>
          </select>
          <span className="font-mono text-[11px] bg-zinc-800/80 px-2 py-1 rounded text-zinc-300">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* 3. Medusa High-Density Products Table */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-zinc-400 mt-3 font-mono">Synchronizing catalog with Medusa Product Module...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-zinc-200">No products match your current filters</div>
            <div className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, or add a new wholesale catalog item directly to the live store.
            </div>
            <button
              onClick={onOpenCreateProduct}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              + Create First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12">Preview</th>
                  <th className="py-3 px-4">Title & Handle</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category & Fabric</th>
                  <th className="py-3 px-4">Wholesale Rate</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4">MOQ</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredProducts.map((p) => {
                  const stock = Number(p.stock !== undefined ? p.stock : 120);
                  const isLow = stock > 0 && stock < 30;
                  const isOut = stock === 0;

                  const wholesale = Number(p.wholesale_price || 0);
                  const retail = Number(p.retail_price || wholesale * 1.8);
                  const marginPct = retail > 0 ? Math.round(((retail - wholesale) / retail) * 100) : 0;

                  return (
                    <tr
                      key={p.id || p.slug}
                      className="hover:bg-zinc-900/50 transition-colors group"
                    >
                      {/* Image Preview */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60 flex-shrink-0">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.title || 'Product'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                              No Pic
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Handle */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="font-semibold text-zinc-100 truncate">{p.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">
                          /{p.slug || p.id}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                        {p.sku || 'KTC-STD'}
                      </td>

                      {/* Category & Fabric */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {p.category || 'Ethnic Wear'}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 truncate">
                          {p.fabric || 'Pure Cotton'}
                        </div>
                      </td>

                      {/* Wholesale Rate & Margin */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-100 font-mono">
                          ₹{wholesale.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span>MSRP ₹{retail}</span>
                          <span className="text-[9px] bg-emerald-950/60 text-emerald-300 px-1 rounded border border-emerald-800/40">
                            +{marginPct}%
                          </span>
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            Low Stock ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            In Stock ({stock})
                          </span>
                        )}
                      </td>

                      {/* MOQ */}
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                        {p.moq || 30} pcs
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="px-2 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id || p.slug, p.title)}
                            className="px-2 py-1 text-[11px] bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded border border-red-800/60 transition-colors"
                            title="Permanently delete from live catalog"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
