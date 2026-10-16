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
              4. Product Photos & Media
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

            {/* TAB 4: PRODUCT PHOTOS & MEDIA */}
            {activeDrawerTab === 'media' && (
              <div className="space-y-6">
                {/* 1. Photography Instructions */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>Product Photography Management</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Add high-quality garment photos for wholesale buyers. You can snap a photo directly using your device camera, select files from device storage, or paste a direct image URL.
                  </p>
                </div>

                {/* 2. Photo Upload Actions (Camera & Storage) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Device Camera */}
                  <label className="flex flex-col items-center justify-center p-5 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-amber-400/60 cursor-pointer transition-all text-center group shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={onFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-105 group-hover:bg-amber-400/20 transition-all border border-amber-400/20">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-white">Take Photo with Camera</span>
                    <span className="text-[10px] text-zinc-400 mt-1">Use mobile or webcam camera</span>
                  </label>

                  {/* Option B: Device Storage */}
                  <label className="flex flex-col items-center justify-center p-5 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-amber-400/60 cursor-pointer transition-all text-center group shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="w-12 h-12 rounded-xl bg-blue-400/10 text-blue-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-105 group-hover:bg-blue-400/20 transition-all border border-blue-400/20">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-white">Upload from Storage</span>
                    <span className="text-[10px] text-zinc-400 mt-1">Select JPG, PNG, WebP files</span>
                  </label>
                </div>

                {/* Option C: Direct Image URL / Link */}
                <div className="bg-zinc-900/70 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Or Paste Image Link (URL)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/... or direct image link"
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Paste any direct image URL. High-resolution portrait photographs (800x1000px) look best in catalog.
                  </span>
                </div>

                {/* Upload Status Bar */}
                {isUploading && (
                  <div className="flex items-center justify-center gap-2.5 py-3 px-4 bg-amber-400/10 border border-amber-400/30 rounded-xl text-amber-300 text-xs font-medium">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing and optimizing garment photo...</span>
                  </div>
                )}

                {/* 3. Live Garment Photo Preview Container */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-300">Live Catalog Photo Preview</label>
                    {formData.image && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 font-bold">
                        ✓ Primary Image Set
                      </span>
                    )}
                  </div>

                  {formData.image ? (
                    <div className="relative group bg-zinc-950 rounded-xl border border-zinc-700/80 overflow-hidden max-w-sm shadow-xl">
                      <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
                        <img
                          src={formData.image}
                          alt="Garment Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                      </div>
                      <div className="p-3 bg-zinc-900/95 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400 truncate max-w-[200px] font-mono">
                          {formData.image.startsWith('data:') ? 'Local camera/storage upload' : formData.image}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Remove Photo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/40 flex flex-col items-center justify-center text-zinc-500 text-xs">
                      <div className="w-10 h-10 mb-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-zinc-300">No Photo Selected Yet</span>
                      <span className="text-[11px] text-zinc-500 mt-0.5">Use camera, upload from storage, or paste a URL above</span>
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
