'use client';

import { useState } from 'react';

const PRESET_BUNDLES = [
  {
    id: 'starter',
    name: 'Boutique Starter Assortment',
    description: 'Perfect mix of daily-wear Chanderi kurtis & trendy Western crop tops for new retail stores.',
    pieces: 45,
    wholesaleCost: 24750,
    projectedRetailRevenue: 49500,
    projectedProfit: 24750,
    roi: '100%',
    composition: '25 Chanderi Kurtis + 20 Western Tops & Cargos'
  },
  {
    id: 'festive',
    name: 'Festive Season Super-Lot',
    description: 'High-volume festive collection of Shararas, Anarkalis & Banarasi Silk Sarees.',
    pieces: 100,
    wholesaleCost: 59000,
    projectedRetailRevenue: 125000,
    projectedProfit: 66000,
    roi: '112%',
    composition: '40 Sharara Sets + 35 Silk Sarees + 25 Georgette Kurtis'
  },
  {
    id: 'bridal',
    name: 'Bridal & Partywear Premium',
    description: 'Ultra high-margin bridal velvet lehengas, raw silk cholis and cocktail gowns.',
    pieces: 50,
    wholesaleCost: 68500,
    projectedRetailRevenue: 165000,
    projectedProfit: 96500,
    roi: '141%',
    composition: '15 Velvet Lehengas + 15 Bridal Cholis + 20 Ruffle Gowns'
  },
  {
    id: 'girls',
    name: 'Girls & Kids Partywear Special',
    description: 'Fast-moving girls sequin frocks, dhoti sets and festive lehengas for quick turnaround.',
    pieces: 80,
    wholesaleCost: 35000,
    projectedRetailRevenue: 78000,
    projectedProfit: 43000,
    roi: '123%',
    composition: '45 Sequin Frocks + 35 Dhoti-Kurti Sets'
  }
];

export default function BoutiqueRoiCalculator({
  isOpen,
  onClose,
  whatsappNumber = '916350626582'
}) {
  // Custom interactive slider state
  const [budget, setBudget] = useState(35000);
  const [markupPercent, setMarkupPercent] = useState(75);
  const [avgWholesaleRate, setAvgWholesaleRate] = useState(550);

  if (!isOpen) return null;

  // Real-time calculations
  const totalPieces = Math.floor(budget / avgWholesaleRate);
  const avgRetailPrice = Math.round(avgWholesaleRate * (1 + markupPercent / 100));
  const totalRetailRevenue = totalPieces * avgRetailPrice;
  const netProfit = totalRetailRevenue - budget;
  const actualRoi = budget > 0 ? Math.round((netProfit / budget) * 100) : 0;

  // WhatsApp Order for custom calculation
  const handleSendCustomInquiry = () => {
    const text = `Namaste Kamakhya Trading Co! 🙏\n\nI calculated a *Custom Bulk Order Plan* on your website:\n\n💰 *Target Investment:* ₹${budget.toLocaleString('en-IN')}\n📦 *Estimated Pieces:* ~${totalPieces} pcs (@ avg ₹${avgWholesaleRate}/pc)\n📈 *Target Retail Margin:* ${markupPercent}%\n🏷️ *Projected Retail Revenue:* ₹${totalRetailRevenue.toLocaleString('en-IN')}\n💎 *Projected Boutique Profit:* ₹${netProfit.toLocaleString('en-IN')} (${actualRoi}% ROI)\n\nPlease suggest the best assortment lot for this budget and share the transport quotation!`;
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp Order for pre-curated bundle
  const handleOrderBundle = (bundle) => {
    const text = `Namaste Kamakhya Trading Co! 🙏\n\nI want to order the curated *${bundle.name}*:\n\n📦 *Pieces:* ${bundle.pieces} pcs\n📋 *Composition:* ${bundle.composition}\n💰 *Wholesale Lot Cost:* ₹${bundle.wholesaleCost.toLocaleString('en-IN')}\n💎 *Projected Profit:* ₹${bundle.projectedProfit.toLocaleString('en-IN')} (${bundle.roi} ROI)\n\nPlease share the formal proforma invoice and transport booking details.`;
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Calculator Window */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-neutral-200">
        
        {/* Header */}
        <div className="p-5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg">
              📊
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight uppercase">
                Boutique Profit & ROI Estimator
              </h2>
              <p className="text-xs text-neutral-400">
                Calculate your resale margins and discover pre-assembled high-profit wholesale lots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 bg-gray-50/50">
          
          {/* SECTION 1: INTERACTIVE CALCULATOR */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <span>🧮</span>
                <span>Custom Order Margin Simulator</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Live Calculation
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Slider 1: Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Investment Budget:</span>
                  <span className="text-black font-black text-sm">₹{budget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>₹10,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Slider 2: Average Wholesale Cost */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Avg Wholesale Cost / pc:</span>
                  <span className="text-black font-black text-sm">₹{avgWholesaleRate}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="50"
                  value={avgWholesaleRate}
                  onChange={(e) => setAvgWholesaleRate(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>₹300</span>
                  <span>₹1,500</span>
                </div>
              </div>

              {/* Slider 3: Desired Retail Markup */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Retail Markup:</span>
                  <span className="text-emerald-600 font-black text-sm">{markupPercent}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>30% (Budget)</span>
                  <span>150% (High Margin)</span>
                </div>
              </div>

            </div>

            {/* Projection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Pieces</span>
                <span className="text-xl font-black text-gray-900 mt-0.5 block">{totalPieces} pcs</span>
                <span className="text-[10px] text-gray-500">Inventory size</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Retail Selling Rate</span>
                <span className="text-xl font-black text-gray-900 mt-0.5 block">₹{avgRetailPrice}</span>
                <span className="text-[10px] text-gray-500">Per piece MRP</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Gross Revenue</span>
                <span className="text-xl font-black text-emerald-900 mt-0.5 block">₹{totalRetailRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-600">Total sale</span>
              </div>

              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-md">
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Net Boutique Profit</span>
                <span className="text-xl font-black mt-0.5 block">₹{netProfit.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-200 font-bold">{actualRoi}% Return</span>
              </div>
            </div>

            <button
              onClick={handleSendCustomInquiry}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>📲</span>
              <span>Inquire This Custom Plan with Factory on WhatsApp</span>
            </button>
          </div>

          {/* SECTION 2: CURATED HIGH-PROFIT WHOLESALE LOTS */}
          <div className="space-y-4">
            <div>
              <h3 className="font-black text-base text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <span>📦</span>
                <span>Pre-Curated High-Margin Assortment Bundles</span>
              </h3>
              <p className="text-xs text-gray-500">
                Hand-picked fast-selling mixes packed and ready for immediate dispatch across India
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESET_BUNDLES.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-black text-sm text-gray-900">{bundle.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex-shrink-0">
                        {bundle.roi} ROI
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">{bundle.description}</p>

                    <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-bold text-gray-800">{bundle.pieces} pieces</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lot Cost:</span>
                        <span className="font-black text-gray-900">₹{bundle.wholesaleCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Est. Resale:</span>
                        <span className="font-bold text-gray-700">₹{bundle.projectedRetailRevenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-200 text-emerald-700 font-bold">
                        <span>Net Profit:</span>
                        <span>+₹{bundle.projectedProfit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrderBundle(bundle)}
                    className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Order {bundle.name.split(' ')[0]} Lot on WhatsApp</span>
                    <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
