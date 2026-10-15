'use client';

import { useState } from 'react';

export default function ProductDrawer({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  onSave,
  isSaving,
  isUploading,
  onFileUpload,
  isGeneratingAi,
  onGenerateAiModel,
  categories = [],
  fabrics = [],
  sizesOptions = []
}) {
  const [activeDrawerTab, setActiveDrawerTab] = useState('general'); // 'general' | 'pricing' | 'variants' | 'media'

  if (!isOpen) return null;

  // Sizes toggle
  const toggleSize = (size) => {
    setFormData(prev => {
      const current = prev.sizes || [];
      const updated = current.includes(size)
        ? current.filter(s => s !== size)
        : [...current, size];
      return { ...prev, sizes: updated };
    });
  };

  // Color variants
  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      color_variants: [
        ...(prev.color_variants || []),
        { color_name: 'New Shade', hex_code: '#800000' }
      ]
    }));
  };

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      color_variants: (prev.color_variants || []).filter((_, i) => i !== index)
    }));
  };

  const updateColorVariant = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.color_variants || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, color_variants: list };
    });
  };

  // Profit Margin preview
  const wholesale = Number(formData.wholesale_price || 0);
  const retail = Number(formData.retail_price || 0);
  const marginPct = retail > 0 ? Math.round(((retail - wholesale) / retail) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full flex pl-10">
        <div className="w-full bg-[#0b0f17] border-l border-zinc-800 shadow-2xl flex flex-col h-full text-zinc-200">
          
          {/* 1. Drawer Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
                  {editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {formData.sku || 'KTC-DRAFT'}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {editingProduct ? (formData.title || 'Edit Product') : 'Create Wholesale Catalog Item'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Sub-Navigation Tabs */}
          <div className="px-6 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center gap-6 text-xs">
            <button
              type="button"
              onClick={() => setActiveDrawerTab('general')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeDrawerTab === 'general'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. General Details
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawerTab('pricing')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeDrawerTab === 'pricing'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Pricing & Stock
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawerTab('variants')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeDrawerTab === 'variants'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Sizes & Shades
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawerTab('media')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeDrawerTab === 'media'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              4. Media & AI Studio
            </button>
          </div>

          {/* 3. Form Body */}
          <form id="medusa-product-form" onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            
            {/* TAB 1: GENERAL DETAILS */}
            {activeDrawerTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Pure Chanderi Silk Zari Suit"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">SKU Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="KTC-ETH-101"
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Category Collection</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Fabric & Texture</label>
                    <select
                      value={formData.fabric}
                      onChange={e => setFormData(prev => ({ ...prev, fabric: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white"
                    >
                      {fabrics.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.moq}
                      onChange={e => setFormData(prev => ({ ...prev, moq: Number(e.target.value) }))}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Product Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Weaving details, dupatta fabric, work specifications for boutique buyers..."
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & STOCK */}
            {activeDrawerTab === 'pricing' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Wholesale Price (₹/pc) *</label>
                    <input
                      type="number"
                      required
                      value={formData.wholesale_price}
                      onChange={e => setFormData(prev => ({ ...prev, wholesale_price: Number(e.target.value) }))}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">B2B Base Line Sheet Rate</span>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Suggested Retail MSRP (₹)</label>
                    <input
                      type="number"
                      value={formData.retail_price}
                      onChange={e => setFormData(prev => ({ ...prev, retail_price: Number(e.target.value) }))}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white font-mono text-sm"
                    />
                    <span className="text-[10px] text-emerald-400 mt-1 block">
                      Boutique Margin: ~{marginPct}% markup
                    </span>
                  </div>
                </div>

                {/* Warehouse Stock Distribution */}
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="font-semibold text-white text-xs">Warehouse Stock Distribution:</div>
                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Surat Mill (60%)</label>
                      <input
                        type="number"
                        readOnly
                        value={Math.round((formData.stock || 120) * 0.60)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Jaipur Studio (25%)</label>
                      <input
                        type="number"
                        readOnly
                        value={Math.round((formData.stock || 120) * 0.25)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Guwahati (15%)</label>
                      <input
                        type="number"
                        readOnly
                        value={Math.max(0, (formData.stock || 120) - Math.round((formData.stock || 120) * 0.85))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIZES & COLOR SHADES */}
            {activeDrawerTab === 'variants' && (
              <div className="space-y-5">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-2">Available Size Options</label>
                  <div className="flex flex-wrap gap-2">
                    {sizesOptions.map(size => {
                      const isSelected = (formData.sizes || []).includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-black font-bold shadow-sm'
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-zinc-300 font-semibold">Color Shade Variants</label>
                    <button
                      type="button"
                      onClick={addColorVariant}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold"
                    >
                      + Add Shade
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(formData.color_variants || []).map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                        <input
                          type="color"
                          value={col.hex_code}
                          onChange={e => updateColorVariant(idx, 'hex_code', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={col.color_name}
                          onChange={e => updateColorVariant(idx, 'color_name', e.target.value)}
                          placeholder="Color Name"
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={col.hex_code}
                          onChange={e => updateColorVariant(idx, 'hex_code', e.target.value)}
                          placeholder="#000000"
                          className="w-20 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-white font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeColorVariant(idx)}
                          className="text-red-400 hover:text-red-300 font-bold px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA & AI MODEL STUDIO */}
            {activeDrawerTab === 'media' && (
              <div className="space-y-5">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Catalog Garment Image</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://... or upload below"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-white text-xs font-mono"
                  />

                  {/* File Upload Trigger */}
                  <div className="mt-2 flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs cursor-pointer border border-zinc-700 transition-colors">
                      {isUploading ? 'Uploading Image...' : '📁 Upload Image File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <span className="text-[10px] text-zinc-500">JPG, PNG, WebP supported</span>
                  </div>
                </div>

                {/* AI Try-On Model Image */}
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                        <span>✨ AI Virtual Try-On Model Preview</span>
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Generate realistic on-model photoshoot previews</p>
                    </div>

                    <button
                      type="button"
                      onClick={onGenerateAiModel}
                      disabled={isGeneratingAi || !formData.image}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs disabled:opacity-50 transition-all"
                    >
                      {isGeneratingAi ? 'Synthesizing...' : 'Generate with AI'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={formData.ai_model_image}
                    onChange={e => setFormData(prev => ({ ...prev, ai_model_image: e.target.value }))}
                    placeholder="AI Model Studio URL"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                  />

                  {formData.ai_model_image && (
                    <div className="w-32 h-44 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 mt-2">
                      <img src={formData.ai_model_image} alt="AI Model Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* 4. Sticky Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="medusa-product-form"
              disabled={isSaving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? 'Committing Changes...' : (editingProduct ? 'Save & Update Product' : 'Create Product')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
