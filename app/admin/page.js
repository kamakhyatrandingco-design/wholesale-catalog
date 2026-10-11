'use client';

import { useState, useEffect } from 'react';

const OWNER_PHONE = "+91 63506 26582";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // OTP Recovery State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('6350626582');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [whatsappOtpLink, setWhatsappOtpLink] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal / Edit State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    category: 'Ethnic Wear',
    fabric: 'Pure Cotton',
    wholesale_price: 499,
    retail_price: 899,
    moq: 30,
    sizes: ['M', 'L', 'XL'],
    image: '',
    ai_model_image: '',
    description: '',
    color_variants: [
      { color_name: 'Maroon', hex_code: '#800000' },
      { color_name: 'Navy Blue', hex_code: '#000080' }
    ]
  });

  const CATEGORIES = [
    "Ethnic Wear",
    "Western Wear",
    "Girls Partywear",
    "Bridal",
    "Loungewear"
  ];

  const FABRIC_OPTIONS = [
    "Pure Cotton",
    "Pure Chanderi Silk",
    "Rayon Slub",
    "Viscose Georgette",
    "Heavy Micro Velvet",
    "Organza Silk",
    "Linen Blend",
    "Poly Chiffon",
    "Raw Silk"
  ];

  const SIZES_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

  // Check saved session
  useEffect(() => {
    const savedAuth = localStorage.getItem('ktc_admin_auth');
    if (savedAuth === 'valid') {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', pin })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('ktc_admin_auth', 'valid');
        fetchProducts();
      } else {
        setLoginError(data.error || "Incorrect PIN");
      }
    } catch (err) {
      setLoginError("Connection error: " + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Request OTP
  const handleRequestOtp = async () => {
    setIsRequestingOtp(true);
    setOtpMessage('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', phone: recoveryPhone })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpMessage(data.message);
        setDemoOtpCode(data.demoOtp || '');
        setWhatsappOtpLink(data.whatsappOtpUrl || '');
      } else {
        setOtpMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setOtpMessage("Error: " + err.message);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handle Verify & Reset PIN
  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-and-reset', otp: enteredOtp, newPin })
      });
      const data = await res.json();

      if (data.success) {
        alert("PIN updated successfully! You can now log in.");
        setIsForgotMode(false);
        setOtpSent(false);
        setPin(newPin);
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ktc_admin_auth');
    setIsAuthenticated(false);
  };

  // Open Edit Form
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      sku: product.sku || '',
      category: product.category || 'Ethnic Wear',
      fabric: product.fabric || 'Pure Cotton',
      wholesale_price: product.wholesale_price || 0,
      retail_price: product.retail_price || 0,
      moq: product.moq || 30,
      sizes: product.sizes || ['Free Size'],
      image: product.image || '',
      ai_model_image: product.ai_model_image || '',
      description: product.description || '',
      color_variants: product.color_variants || []
    });
    setIsFormOpen(true);
  };

  // Open Create Form
  const openCreateModal = () => {
    setEditingProduct(null);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      title: '',
      sku: `KTC-APP-${randomSuffix}`,
      category: 'Ethnic Wear',
      fabric: 'Pure Cotton',
      wholesale_price: 499,
      retail_price: 899,
      moq: 30,
      sizes: ['M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
      ai_model_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
      description: '',
      color_variants: [
        { color_name: 'Crimson Red', hex_code: '#8B0000' },
        { color_name: 'Royal Blue', hex_code: '#000080' }
      ]
    });
    setIsFormOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = editingProduct
        ? { id: editingProduct.id, ...formData }
        : { ...formData };

      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsFormOpen(false);
        fetchProducts();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Save error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteProduct = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err) {
      alert("Delete error: " + err.message);
    }
  };

  // Handle Image Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle AI Try-On Generation inside Admin
  const handleGenerateAiModel = async () => {
    if (!formData.image) {
      alert("Please provide a product image first!");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: formData.image,
          garmentDescription: `${formData.title} - ${formData.category}`
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setFormData(prev => ({ ...prev, ai_model_image: data.imageUrl }));
      }
    } catch (err) {
      alert("AI preview generated with category model fallback.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Color Variant Helpers
  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      color_variants: [...prev.color_variants, { color_name: 'New Color', hex_code: '#000000' }]
    }));
  };

  const removeColorVariant = (idx) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.filter((_, i) => i !== idx)
    }));
  };

  const updateColorVariant = (idx, field, val) => {
    setFormData(prev => {
      const updated = [...prev.color_variants];
      updated[idx][field] = val;
      return { ...prev, color_variants: updated };
    });
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchQuery || `${p.title} ${p.sku}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // ==========================================
  // RENDER: LOGIN & OTP SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-white">
          
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-neutral-800 border border-neutral-700 mb-3">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Kamakhya Admin Portal</h1>
            <p className="text-xs text-neutral-400 mt-1">Direct Catalog & Price Manager (No GitHub required)</p>
          </div>

          {!isForgotMode ? (
            /* PIN LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Enter Store Master PIN / Password:
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Admin PIN / Password"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-3 rounded-xl text-sm transition-all shadow-lg active:scale-98 disabled:opacity-50"
              >
                {isLoggingIn ? 'Logging in...' : 'Enter Admin Portal →'}
              </button>

              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-neutral-400 hover:text-white underline"
                >
                  Forgot Key? Reset via WhatsApp OTP
                </button>
                <a href="/" className="text-neutral-400 hover:text-white">
                  ← Back to Storefront
                </a>
              </div>
            </form>
          ) : (
            /* PHONE NUMBER OTP RESET FORM */
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-800/80 rounded-2xl border border-neutral-700 text-xs text-neutral-300">
                <span className="font-bold text-white block mb-1">📱 WhatsApp Security Verification:</span>
                Reset OTP is delivered to registered store owner WhatsApp: <b>{OWNER_PHONE}</b>.
              </div>

              {!otpSent ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Confirm Registered Owner Phone:
                    </label>
                    <input
                      type="text"
                      value={recoveryPhone}
                      onChange={(e) => setRecoveryPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      await handleRequestOtp();
                    }}
                    disabled={isRequestingOtp}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-black py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>📲</span>
                    <span>{isRequestingOtp ? 'Dispatching OTP...' : 'Send OTP to WhatsApp (+91 63506 26582)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="w-full text-center text-xs text-neutral-400 hover:text-white py-1"
                  >
                    Cancel & Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-3">
                  <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-xl">
                    <p className="font-bold">✓ {otpMessage || 'OTP Sent to WhatsApp'}</p>
                    <p className="text-[11px] text-emerald-400/90 mt-1">
                      Check WhatsApp on +91 63506 26582 for your 6-digit verification code.
                    </p>
                    {whatsappOtpLink && (
                      <a
                        href={whatsappOtpLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#1EBE5A]"
                      >
                        Open WhatsApp to View / Send OTP Code
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Enter 6-digit OTP:
                    </label>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      maxLength={6}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Set New Admin PIN:
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-2.5 rounded-xl text-xs"
                  >
                    Confirm & Update PIN
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => { setIsForgotMode(false); setOtpSent(false); }}
                className="w-full text-center text-xs text-neutral-400 hover:text-white pt-2"
              >
                ← Return to Password Login
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Admin Top Navbar */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black uppercase tracking-tight text-white">
              Kamakhya <span className="text-emerald-400">Admin</span>
            </span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Live No-Code Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-neutral-700 flex items-center gap-1.5"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">View Storefront</span>
            </a>

            <button
              onClick={openCreateModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              <span>+</span>
              <span>Add New Product</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-neutral-400 hover:text-red-400 px-2 py-1"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-neutral-400 text-xs">Total Products</span>
            <div className="text-2xl font-black text-white mt-1">{products.length}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-neutral-400 text-xs">Active Categories</span>
            <div className="text-2xl font-black text-white mt-1">{CATEGORIES.length}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-neutral-400 text-xs">Default Wholesale MOQ</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">30 pcs</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-neutral-400 text-xs">WhatsApp Dispatch</span>
            <div className="text-sm font-bold text-white mt-2 truncate">{OWNER_PHONE}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-900 border border-neutral-800 p-3 rounded-2xl">
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or SKU..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide text-xs">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table / Grid */}
        {isLoadingProducts ? (
          <div className="text-center py-20 text-neutral-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading catalog products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-500">
            <span className="text-3xl block mb-2">👗</span>
            No products found matching your search.
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">SKU / Fabric</th>
                    <th className="py-3 px-4">Wholesale Rate</th>
                    <th className="py-3 px-4">Retail MRP</th>
                    <th className="py-3 px-4">MOQ</th>
                    <th className="py-3 px-4">Variants</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200'}
                          alt={product.title}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-800 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{product.title}</div>
                          <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                            {product.category}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-300">
                        <div>{product.sku}</div>
                        <span className="text-[10px] text-neutral-500 font-sans">{product.fabric || 'Standard'}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-black text-sm">₹{product.wholesale_price}</span>
                        <span className="text-[10px] text-neutral-500"> /pc</span>
                      </td>

                      <td className="py-3 px-4 text-neutral-400">
                        ₹{product.retail_price}
                      </td>

                      <td className="py-3 px-4 font-bold text-white">
                        {product.moq} pcs
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {(product.color_variants || []).map((c, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-neutral-600"
                              style={{ backgroundColor: c.hex_code }}
                              title={c.color_name}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-neutral-500">
                          {(product.sizes || []).join(', ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-2.5 py-1.5 rounded-lg border border-neutral-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="bg-red-950/80 hover:bg-red-900 text-red-300 font-bold px-2.5 py-1.5 rounded-lg border border-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />

          <div className="relative bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-black uppercase tracking-tight">
                {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Apparel to Wholesale Catalog'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-neutral-400 hover:text-white text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              
              {/* Row 1: Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Pure Georgette Anarkali Set"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. KTC-ET-045"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Fabric / Material</label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    {FABRIC_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing & MOQ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <label className="font-bold text-emerald-400 block mb-1">Wholesale Rate (Bulk ₹) *</label>
                  <input
                    type="number"
                    value={formData.wholesale_price}
                    onChange={(e) => setFormData({ ...formData, wholesale_price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-black"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Retail MRP (Single ₹) *</label>
                  <input
                    type="number"
                    value={formData.retail_price}
                    onChange={(e) => setFormData({ ...formData, retail_price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">MOQ (Bulk Order Pcs) *</label>
                  <input
                    type="number"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="font-bold text-neutral-300 block mb-1.5">Sizes in Wholesale Set</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES_OPTIONS.map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        formData.sizes.includes(s)
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images: Catalog Flat Shoot & AI Model Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Catalog Flat Image URL *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white mb-2"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <label className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 rounded-lg cursor-pointer text-[11px] font-bold">
                      {isUploading ? 'Uploading...' : '📁 Upload Local Image'}
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-purple-400 block mb-1">✨ AI Model Try-On Image URL</label>
                  <input
                    type="text"
                    value={formData.ai_model_image}
                    onChange={(e) => setFormData({ ...formData, ai_model_image: e.target.value })}
                    placeholder="AI model on-body photo"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white mb-2"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiModel}
                    disabled={isGeneratingAi}
                    className="bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-300 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <span>✨</span>
                    <span>{isGeneratingAi ? 'Generating AI Preview...' : 'Generate AI Model View'}</span>
                  </button>
                </div>
              </div>

              {/* Color Variants Builder */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-neutral-300">Color Variants</label>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="text-emerald-400 hover:underline font-bold text-[11px]"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.color_variants.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                      <input
                        type="color"
                        value={c.hex_code}
                        onChange={(e) => updateColorVariant(idx, 'hex_code', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={c.color_name}
                        onChange={(e) => updateColorVariant(idx, 'color_name', e.target.value)}
                        placeholder="Color name"
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeColorVariant(idx)}
                        className="text-neutral-500 hover:text-red-400 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Boutique Description & Specifications</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail embroidery, weave, occasion, wash care..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Save CTAs */}
              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-xl shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Catalog...' : 'Save Product to Live Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
