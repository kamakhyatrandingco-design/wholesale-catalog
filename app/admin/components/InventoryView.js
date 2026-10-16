'use client';

import { useState } from 'react';

export default function InventoryView({
  products = [],
  onAdjustStock
}) {
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState(null);
  const [adjustLocation, setAdjustLocation] = useState('loc_surat_central');
  const [adjustDelta, setAdjustDelta] = useState(50);
  const [adjustReason, setAdjustReason] = useState('sourcing_batch_received');

  const locations = [
    {
      id: 'loc_surat_central',
      name: 'Surat Sourcing Hub & Depot',
      state: 'Gujarat',
      address: 'Ring Road Textile Market, Surat',
      type: 'Primary Sourcing Hub'
    },
    {
      id: 'loc_jaipur_studio',
      name: 'Jaipur Finishing & Craft Studio',
      state: 'Rajasthan',
      address: 'Sanganer Hand-Block & Dyeing Cluster',
      type: 'Finishing & Embellishment'
    },
    {
      id: 'loc_guwahati_hub',
      name: 'Guwahati Regional Hub',
      state: 'Assam',
      address: 'Fancy Bazar Regional Dispatch Point',
      type: 'Northeast B2B Distribution'
    }
  ];

  const handleCommitAdjust = (e) => {
    e.preventDefault();
    if (!selectedProductForAdjust) return;

    onAdjustStock({
      productId: selectedProductForAdjust.id || selectedProductForAdjust.slug,
      locationId: adjustLocation,
      delta: Number(adjustDelta),
      reason: adjustReason
    });

    setSelectedProductForAdjust(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Warehouse Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map(loc => (
          <div key={loc.id} className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-semibold border border-zinc-700/60">
                {loc.type}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-bold text-white text-sm mt-2">{loc.name}</div>
            <div className="text-xs text-zinc-400 mt-1">{loc.address}</div>
            <div className="text-[10px] font-mono text-zinc-500 mt-2">State: {loc.state} • Status: Active</div>
          </div>
        ))}
      </div>

      {/* 2. Stock Allocation Table */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Multi-Location Inventory Matrix</h3>
            <p className="text-xs text-zinc-400">Stock on Hand, Reservations & Available-To-Promise (ATP)</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            {products.length} catalog styles tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Style</th>
                <th className="py-3 px-4">Surat Hub</th>
                <th className="py-3 px-4">Jaipur Studio</th>
                <th className="py-3 px-4">Guwahati Hub</th>
                <th className="py-3 px-4">Total On Hand</th>
                <th className="py-3 px-4">Available (ATP)</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {products.map(p => {
                const totalStock = Number(p.stock !== undefined ? p.stock : 120);
                const suratStock = Math.round(totalStock * 0.60);
                const jaipurStock = Math.round(totalStock * 0.25);
                const guwahatiStock = Math.max(0, totalStock - suratStock - jaipurStock);
                const reserved = Math.round(totalStock * 0.08); // 8% currently reserved for open POs
                const atp = Math.max(0, totalStock - reserved);

                return (
                  <tr key={p.id || p.slug} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{p.title}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{p.sku || 'KTC-STD'}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-200">
                      {suratStock} pcs
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-200">
                      {jaipurStock} pcs
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-200">
                      {guwahatiStock} pcs
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {totalStock} pcs
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400 font-bold">{atp} pcs</span>
                      <span className="text-[10px] text-zinc-500 ml-1">({reserved} res.)</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedProductForAdjust(p)}
                        className="px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-medium rounded border border-zinc-700 transition-colors"
                      >
                        ± Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Stock Adjustment Modal */}
      {selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Adjust Warehouse Inventory</h3>
                <p className="text-[11px] text-zinc-400 truncate max-w-xs">{selectedProductForAdjust.title}</p>
              </div>
              <button onClick={() => setSelectedProductForAdjust(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCommitAdjust} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Target Warehouse Location</label>
                <select
                  value={adjustLocation}
                  onChange={e => setAdjustLocation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Adjustment Delta (Units to Add or Subtract)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={e => setAdjustDelta(Number(e.target.value))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
                    placeholder="e.g. +50 or -20"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAdjustDelta(50)}
                      className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-[11px]"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustDelta(100)}
                      className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-[11px]"
                    >
                      +100
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Use positive numbers to add stock, negative to reduce.</p>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Audit Log Reason</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="sourcing_batch_received">New Sourcing Batch Received</option>
                  <option value="wholesale_dispatch_reconciliation">Wholesale Dispatch Reconciliation</option>
                  <option value="inter_warehouse_transfer">Inter-Warehouse Transfer</option>
                  <option value="damage_fabric_writeoff">Fabric Defect / Write-Off</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedProductForAdjust(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-sm"
                >
                  Commit Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
