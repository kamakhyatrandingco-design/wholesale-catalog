'use client';

import { useState } from 'react';

const GUIDE_STEPS = [
  {
    step: 1,
    icon: '🏭',
    title: 'Factory Wholesale vs Single Retail Mode',
    description: 'Toggle between Wholesale and Retail at the top navbar anytime.',
    details: [
      'Wholesale Mode: Displays direct factory mill rates and minimum order quantities (MOQ 25–50 pcs) for boutiques & resellers.',
      'Retail Mode: Displays single piece pricing for individual sampling or personal purchase to inspect fabric & stitching quality.'
    ]
  },
  {
    step: 2,
    icon: '✨',
    title: 'AI Virtual Try-On Studio (Real Drape)',
    description: 'Preview how any garment fits on real Indian fashion models without costly photoshoots.',
    details: [
      'Choose from 5 curated model archetypes (Aanya for Ethnic, Meera for Bridal, Rhea for Western, Shanaya for Partywear, Tara for Lounge).',
      'Or tap "+ Upload Buyer Photo" to test garments on your own photo or your client\'s photo!',
      'Use the interactive split slider to compare flat catalog garments against AI neural drape.'
    ]
  },
  {
    step: 3,
    icon: '📦',
    title: 'Assembling Bulk POs & WhatsApp Invoicing',
    description: 'Create multi-item wholesale quotations with exact lot quantities.',
    details: [
      'Click "+ Add to Bulk PO" on any product to assemble a purchase order across colors and sizes.',
      'Open the Bulk PO drawer to review total pieces and estimated invoice value.',
      'Tap "Send Purchase Order on WhatsApp" to generate a pre-formatted GST proforma order sent directly to factory dispatch (+91 63506 26582).'
    ]
  },
  {
    step: 4,
    icon: '📊',
    title: 'Margin Calculator & Restock Requests',
    description: 'Maximize your boutique ROI and request restock on high-demand lots.',
    details: [
      'Use the Margin Calculator to simulate gross revenue, cost per piece, and net profit margins (50% to 140%).',
      'Need more inventory? Sign in to the Buyer Portal to request immediate restock or chat directly with factory owner Hariom Joshi.'
    ]
  }
];

export default function NewUserGuide({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const current = GUIDE_STEPS[activeStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm">
              📖
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                New Buyer & Boutique Onboarding Guide
              </h2>
              <p className="text-xs text-gray-500">
                How to navigate Kamakhya wholesale catalog, AI try-on & factory ordering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {GUIDE_STEPS.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-xl text-left border transition-all ${
                activeStep === idx
                  ? 'border-black bg-black text-white shadow-xs'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                Step {step.step}
              </div>
              <div className="text-xs font-black truncate mt-0.5">
                {step.icon} {step.title.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <h3 className="text-base font-black text-gray-900">
                {current.step}. {current.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {current.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-200 text-xs text-gray-700">
            {current.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
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
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Previous
          </button>

          <div className="flex gap-1.5">
            {GUIDE_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === idx ? 'w-6 bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {activeStep < GUIDE_STEPS.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Start Exploring Catalog ✨
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
