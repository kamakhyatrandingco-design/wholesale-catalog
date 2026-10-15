'use client';

import { useState } from 'react';

export default function PricingView() {
  const [simBasePrice, setSimBasePrice] = useState(499);
  const [simQuantity, setSimQuantity] = useState(60);

  const priceTiers = [
    {
      id: 'pl_standard',
      name: 'Standard Wholesale Tier',
      badge: 'Base Tier',
      min_moq: 30,
      discount_pct: 0,
      description: 'Standard B2B pricing for emerging boutiques and independent retailers.',
      payment_terms: 'Advance RTGS / COD on Dispatch',
      freight: 'Transport to be paid on delivery'
    },
    {
      id: 'pl_gold',
      name: 'Boutique Gold Network',
      badge: '8% Discount',
      min_moq: 50,
      discount_pct: 8,
      description: 'Verified boutique accounts with steady monthly order volumes.',
      payment_terms: '50% Advance, 50% on L/R generation',
      freight: '50% freight subsidy on orders > 100 pcs'
    },
    {
      id: 'pl_diamond',
      name: 'Diamond Mega-Distributor',
      badge: '15% Discount',
      min_moq: 150,
      discount_pct: 15,
      description: 'State-level multi-store distributors and wholesale bulk stockists.',
      payment_terms: 'Net 30 Days Credit line',
      freight: '100% Free All-India Freight Included'
    }
  ];

  // Simulator Calculation
  const calculateTierMetrics = (discountPct) => {
    const discountedUnit = Math.round(simBasePrice * (1 - (discountPct / 100)));
    const gstRate = discountedUnit <= 1000 ? 5 : 12;
    const gstAmount = Math.round((discountedUnit * gstRate) / 100);
    const totalUnit = discountedUnit + gstAmount;
    const subtotal = discountedUnit * simQuantity;
    const totalGst = gstAmount * simQuantity;
    const grandTotal = subtotal + totalGst;
    const savings = Math.round((simBasePrice - discountedUnit) * simQuantity);

    return { discountedUnit, gstRate, gstAmount, totalUnit, subtotal, totalGst, grandTotal, savings };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5">
        <h3 className="text-base font-bold text-white">B2B Wholesale Price Lists & Volume Tiers</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Medusa Pricing Module provides automated tiered wholesale pricing, volume discount scales, and integrated Indian Apparel GST tax slab calculations (5% for items ≤ ₹1,000, 12% for items &gt; ₹1,000).
        </p>
      </div>

      {/* 2. Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priceTiers.map(tier => {
          const calc = calculateTierMetrics(tier.discount_pct);
          return (
            <div key={tier.id} className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">MOQ: {tier.min_moq} pcs</span>
                </div>
                <h4 className="font-bold text-white text-sm mt-3">{tier.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">{tier.description}</p>
              </div>

              <div className="bg-zinc-900/70 p-3.5 rounded-lg border border-zinc-800 space-y-1.5 text-xs font-mono">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Tier Terms</div>
                <div className="text-zinc-300">Credit: {tier.payment_terms}</div>
                <div className="text-zinc-400 text-[11px]">Freight: {tier.freight}</div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 font-mono">Simulated Unit Rate:</div>
                <div className="text-lg font-bold text-amber-300 font-mono">
                  ₹{calc.discountedUnit} <span className="text-xs font-normal text-zinc-400">(+{calc.gstRate}% GST)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Price Simulator */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white">Live B2B Quotation Simulator</h4>
            <p className="text-xs text-zinc-400">Test how prices, GST slabs, and buyer margins dynamically compute across tiers</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
            GST Slabs: 5% / 12%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Catalog Wholesale Base Rate (₹)</label>
            <input
              type="number"
              value={simBasePrice}
              onChange={e => setSimBasePrice(Math.max(1, Number(e.target.value)))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              placeholder="Base Price"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Consignment Order Size (Pieces)</label>
            <input
              type="number"
              value={simQuantity}
              onChange={e => setSimQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              placeholder="Quantity"
            />
          </div>
        </div>

        {/* Comparison Matrix */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden mt-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-[10px] font-mono text-zinc-400 uppercase">
              <tr>
                <th className="py-2.5 px-3">Wholesale Tier</th>
                <th className="py-2.5 px-3">Effective Unit Rate</th>
                <th className="py-2.5 px-3">GST Slab</th>
                <th className="py-2.5 px-3">Taxable Subtotal</th>
                <th className="py-2.5 px-3">GST Total</th>
                <th className="py-2.5 px-3">Buyer Grand Total</th>
                <th className="py-2.5 px-3 text-right">Buyer Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {priceTiers.map(t => {
                const c = calculateTierMetrics(t.discount_pct);
                return (
                  <tr key={t.id} className="hover:bg-zinc-900/40">
                    <td className="py-2.5 px-3 font-semibold text-zinc-200 font-sans">{t.name}</td>
                    <td className="py-2.5 px-3 text-white font-bold">₹{c.discountedUnit}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{c.gstRate}%</td>
                    <td className="py-2.5 px-3 text-zinc-300">₹{c.subtotal.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-zinc-400">₹{c.totalGst.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-amber-300 font-bold">₹{c.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">₹{c.savings.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
