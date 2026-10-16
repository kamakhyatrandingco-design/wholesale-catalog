'use client';

import { useState } from 'react';

const WHOLESALE_GUIDE_STEPS = [
  {
    step: 1,
    title: 'Factory Wholesale vs Single Retail Mode',
    description: 'Toggle between Wholesale and Retail at the top navbar anytime.',
    details: [
      'Wholesale Mode: Displays direct factory mill rates and minimum order quantities (MOQ 25 to 50 pcs) for boutiques & retailers.',
      'Retail Mode: Displays single piece pricing for individual sampling to inspect fabric & stitching quality.'
    ]
  },
  {
    step: 2,
    title: 'Garment Specifications & Fabric Inspection',
    description: 'Review verified fabric compositions, weave details, and color curves.',
    details: [
      'Every listing specifies exact fabric (Chanderi, Viscose Georgette, Banarasi Silk, Cotton Loom).',
      'Available colorways and standard boutique size curves (M, L, XL, XXL) with 2-inch alteration margins.',
      'High-resolution garment photography capturing stitching, zari embroidery, and dye finish.'
    ]
  },
  {
    step: 3,
    title: 'Assembling Bulk POs & WhatsApp Invoicing',
    description: 'Create multi-item wholesale quotations with exact lot quantities.',
    details: [
      'Click "+ Add to Bulk PO" on any product card or line-sheet to assemble a purchase order across colors and sizes.',
      'Open the Bulk PO drawer to review total pieces and estimated proforma value.',
      'Tap "Send Purchase Order on WhatsApp" to generate a pre-formatted order sent directly to factory dispatch (+91 63506 26582).'
    ]
  },
  {
    step: 4,
    title: 'Pan-India Freight Logistics & GST Invoicing',
    description: '100% tax-compliant proforma invoices and nationwide commercial dispatch.',
    details: [
      'Full Input Tax Credit (ITC) compliant proforma invoices under 5% and 12% apparel GST slabs.',
      'Daily factory dispatch from Surat and Jaipur hubs with LR / consignment slips shared via WhatsApp.',
      'Partnered with commercial carriers: V-Trans, TCI Freight, Safechem, Delhivery, and BlueDart.'
    ]
  }
];

const RETAIL_GUIDE_STEPS = [
  {
    step: 1,
    title: 'Curated Designer Apparel',
    description: 'Explore hand-finished ethnic couture and festive silhouettes.',
    details: [
      'Authentic women\'s and girls\' ethnic wear, bridal lehengas, western outfits, and celebration frocks.',
      'All items available for individual retail purchase with no minimum order requirements.',
      'Browse through high-resolution photography capturing authentic fabric textures and zari detailing.'
    ]
  },
  {
    step: 2,
    title: 'Garment Sizing & Fit Assurance',
    description: 'Standardized Indian boutique sizes with generous alteration margins.',
    details: [
      'Standard boutique sizing available from M to XXL across suits, kurtis, and gowns.',
      'Every piece includes generous 2-inch internal seam margins for easy custom alterations.',
      'Detailed fabric descriptions including Viscose Georgette, Chanderi, and Organza.'
    ]
  },
  {
    step: 3,
    title: 'Shopping Bag & WhatsApp Checkout',
    description: 'Assemble your selected designs and confirm directly on WhatsApp.',
    details: [
      'Click "+ Add to Bag" on any design to select your color and preferred size.',
      'Open the Shopping Bag anytime to view your selected pieces and transparent order total.',
      'Click "Order via WhatsApp" to share your order with our concierge (+91 63506 26582) for instant confirmation.'
    ]
  },
  {
    step: 4,
    title: 'Insured Doorstep Shipping & Tracking',
    description: 'Fast, secure shipping across all Indian postal pin codes.',
    details: [
      'Dispatches prepared within 24 to 48 hours directly from our design hubs in Surat and Jaipur.',
      'Live tracking notifications and courier consignment details shared directly to your WhatsApp.',
      'Transparent, all-inclusive pricing with standard GST and zero hidden costs.'
    ]
  }
];

export default function NewUserGuide({ isOpen, onClose, isVercel = false }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = isVercel ? RETAIL_GUIDE_STEPS : WHOLESALE_GUIDE_STEPS;
  const current = steps[activeStep] || steps[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                {isVercel ? "KTC Fashion Shopping Guide" : "B2B Buyer Onboarding Guide"}
              </h2>
              <p className="text-xs text-gray-500">
                {isVercel
                  ? "How to explore curated designer apparel, select sizing & complete doorstep orders"
                  : "How to navigate Kamakhya wholesale catalog, line-sheets & factory ordering"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {steps.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                activeStep === idx
                  ? 'border-black bg-black text-white shadow-xs'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                Step {step.step}
              </div>
              <div className="text-xs font-black truncate mt-0.5">
                {step.title.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200 mb-6 space-y-4">
          <div>
            <h3 className="text-base font-black text-gray-900">
              {current.step}. {current.title}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {current.description}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-200 text-xs text-gray-700">
            {current.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                <span className="leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            &larr; Previous
          </button>

          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-sm transition-all ${
                  activeStep === idx ? 'w-6 bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Start Exploring Catalog
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
