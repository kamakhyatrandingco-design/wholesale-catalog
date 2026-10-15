'use client';

import { useState } from 'react';

export default function PromotionsView() {
  const [testCode, setTestCode] = useState('FESTIVE10');
  const [testSubtotal, setTestSubtotal] = useState(60000);
  const [testPieces, setTestPieces] = useState(80);
  const [evalResult, setEvalResult] = useState(null);

  const promotions = [
    {
      code: 'FESTIVE10',
      type: '10% Percentage Discount',
      badge: 'Active Campaign',
      description: '10% Festive Season Incentive on wholesale orders > ₹50,000',
      min_subtotal: 50000,
      min_pieces: 0,
      expiry: '2026-12-31'
    },
    {
      code: 'FREESHIP',
      type: '100% Free Surface Freight',
      badge: 'High Volume Perk',
      description: 'Free door delivery via V-Trans across India on orders exceeding 100 pieces',
      min_subtotal: 0,
      min_pieces: 100,
      expiry: '2026-12-31'
    },
    {
      code: 'VOLUME5',
      type: '5% Extra Cash Discount',
      badge: 'Pre-Paid RTGS',
      description: '5% extra discount for immediate bank transfers on lots > ₹30,000',
      min_subtotal: 30000,
      min_pieces: 0,
      expiry: '2026-12-31'
    }
  ];

  const handleTestPromo = (e) => {
    e.preventDefault();
    const promo = promotions.find(p => p.code === testCode.toUpperCase().trim());
    if (!promo) {
      setEvalResult({ valid: false, error: 'Promotion code not found or expired.' });
      return;
    }

    if (promo.min_subtotal && testSubtotal < promo.min_subtotal) {
      setEvalResult({
        valid: false,
        error: `Order subtotal ₹${testSubtotal.toLocaleString('en-IN')} does not meet minimum ₹${promo.min_subtotal.toLocaleString('en-IN')}`
      });
      return;
    }

    if (promo.min_pieces && testPieces < promo.min_pieces) {
      setEvalResult({
        valid: false,
        error: `Lot count ${testPieces} pcs does not meet required minimum of ${promo.min_pieces} pcs`
      });
      return;
    }

    let discount = 0;
    if (promo.code === 'FESTIVE10') discount = Math.round(testSubtotal * 0.10);
    if (promo.code === 'VOLUME5') discount = Math.round(testSubtotal * 0.05);

    setEvalResult({
      valid: true,
      promo,
      discount,
      freeFreight: promo.code === 'FREESHIP',
      finalPayable: testSubtotal - discount
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5">
        <h3 className="text-base font-bold text-white">Promotions & Volume Campaign Engine</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Medusa Promotion Module allows creating condition-based B2B discount campaigns, minimum order quantity rules, and automated freight incentives.
        </p>
      </div>

      {/* 2. Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map(promo => (
          <div key={promo.code} className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {promo.code}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  {promo.badge}
                </span>
              </div>
              <h4 className="font-semibold text-white text-xs mt-3">{promo.type}</h4>
              <p className="text-xs text-zinc-400 mt-1">{promo.description}</p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
              Valid until: {promo.expiry}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Promo Code Evaluator Tool */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white">Promotion Condition Evaluator</h4>

        <form onSubmit={handleTestPromo} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Coupon Code</label>
            <select
              value={testCode}
              onChange={e => setTestCode(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
            >
              <option value="FESTIVE10">FESTIVE10</option>
              <option value="FREESHIP">FREESHIP</option>
              <option value="VOLUME5">VOLUME5</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Order Subtotal (₹)</label>
            <input
              type="number"
              value={testSubtotal}
              onChange={e => setTestSubtotal(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Total Pieces</label>
            <input
              type="number"
              value={testPieces}
              onChange={e => setTestPieces(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-sm transition-all text-xs"
            >
              Evaluate Code
            </button>
          </div>
        </form>

        {evalResult && (
          <div className={`p-4 rounded-xl border text-xs font-mono mt-3 ${
            evalResult.valid
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}>
            {evalResult.valid ? (
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <span>✓ Promotion Applied Successfully:</span>
                  <span>{evalResult.promo.code}</span>
                </div>
                <div>Discount Amount: ₹{evalResult.discount.toLocaleString('en-IN')}</div>
                {evalResult.freeFreight && <div className="text-amber-300">★ Free Freight Applied Across India</div>}
                <div className="font-bold pt-1 border-t border-emerald-900/60">
                  Effective Invoiced Subtotal: ₹{evalResult.finalPayable.toLocaleString('en-IN')}
                </div>
              </div>
            ) : (
              <div>✕ {evalResult.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
