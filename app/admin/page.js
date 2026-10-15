'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';

// Medusa Admin Component Suite
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import InventoryView from './components/InventoryView';
import PricingView from './components/PricingView';
import CustomersView from './components/CustomersView';
import PromotionsView from './components/PromotionsView';
import WorkflowsView from './components/WorkflowsView';
import GatewayView from './components/GatewayView';
import ProductDrawer from './components/ProductDrawer';
import CommandPalette from './components/CommandPalette';

import { MedusaCommerce } from '@/lib/medusa/index.js';

const OWNER_PHONE = "+91 63506 26582";

function subscribeAdminAuth(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getAdminAuthSnapshot() {
  if (typeof window === 'undefined') return 'invalid';
  try {
    return localStorage.getItem('ktc_admin_auth') || 'invalid';
  } catch {
    return 'invalid';
  }
}

export default function MedusaAdminPortal() {
  // 1. Authentication State
  const savedAuthSnapshot = useSyncExternalStore(
    subscribeAdminAuth,
    getAdminAuthSnapshot,
    () => 'invalid'
  );
  const [sessionAuth, setSessionAuth] = useState(false);
  const isAuthenticated = sessionAuth || savedAuthSnapshot === 'valid';

  const [pin, setPin] = useState('970771');
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
  const [otpToken, setOtpToken] = useState('');

  // 2. Active View Tab State
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'inventory' | 'price_lists' | 'customers' | 'promotions' | 'workflows' | 'gateway' | 'settings'
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // 3. Products Catalog State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // 4. Medusa Orders State
  const [orders, setOrders] = useState([]);

  // 5. Product Drawer (Slide-Over) State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Drawer Form Data
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
    description: '',
    stock: 120,
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

  // Fetch Products & Sync with Persistent Registry
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      const serverProducts = data.products || [];

      // Read persistent deleted IDs
      let deletedIds = new Set();
      try {
        const rawDel = localStorage.getItem('ktc_deleted_products');
        if (rawDel) {
          const arr = JSON.parse(rawDel);
          if (Array.isArray(arr)) deletedIds = new Set(arr);
        }
      } catch {}

      // Merge with custom products saved locally (ensures persistence across serverless cold starts)

      let localProducts = [];
      try {
        const raw = localStorage.getItem('ktc_custom_products');
        if (raw) localProducts = JSON.parse(raw);
      } catch {}

      const productMap = new Map();
      serverProducts.forEach(p => {
        const key = p.id || p.slug;
        if (!deletedIds.has(key) && !deletedIds.has(p.id) && !deletedIds.has(p.slug)) {
          productMap.set(key, p);
        }
      });
      localProducts.forEach(p => {
        const key = p.id || p.slug;
        if (!deletedIds.has(key) && !deletedIds.has(p.id) && !deletedIds.has(p.slug)) {
          productMap.set(key, p);
        }
      });

      const loadedList = Array.from(productMap.values());
      setProducts(loadedList);

      // Initialize Medusa Inventory for loaded products
      loadedList.forEach(p => {
        MedusaCommerce.inventory.initProductStock(p.id || p.slug, Number(p.stock || 120));
      });
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch Orders from Medusa Order Module
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/medusa/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || MedusaCommerce.orders.listOrders());
      } else {
        setOrders(MedusaCommerce.orders.listOrders());
      }
    } catch {
      setOrders(MedusaCommerce.orders.listOrders());
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchProducts();
        fetchOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchProducts, fetchOrders]);

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
        localStorage.setItem('ktc_admin_auth', 'valid');
        setSessionAuth(true);
        fetchProducts();
        fetchOrders();
      } else {
        setLoginError(data.error || "Incorrect PIN");
      }
    } catch (err) {
      setLoginError("Connection error: " + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // OTP Recovery
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
        const code = data.otp || data.demoOtp || '635062';
        setDemoOtpCode(code);
        setEnteredOtp(code);
        setOtpToken(data.otpToken || '');
        setWhatsappOtpLink(data.whatsappOtpUrl || '');
      } else {
        setOtpMessage(data.error || "Failed to generate OTP");
      }
    } catch (err) {
      setOtpMessage("Error: " + err.message);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-and-reset',
          otp: enteredOtp,
          newPin,
          otpToken
        })
      });
      const data = await res.json();

      if (data.success) {
        alert("✓ Admin PIN updated successfully! You can now log in.");
        setIsForgotMode(false);
        setOtpSent(false);
        setPin(newPin);
      } else {
        alert(data.error || "Invalid OTP code.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ktc_admin_auth');
    setSessionAuth(false);
  };

  // Open Edit Drawer
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
      description: product.description || '',
      stock: product.stock !== undefined ? product.stock : 120,
      color_variants: product.color_variants || []
    });
    setIsDrawerOpen(true);
  };

  // Open Create Drawer
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
      description: '',
      stock: 120,
      color_variants: [
        { color_name: 'Crimson Red', hex_code: '#8B0000' },
        { color_name: 'Royal Blue', hex_code: '#000080' }
      ]
    });
    setIsDrawerOpen(true);
  };

  // Handle Save (Create or Update Product)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = editingProduct
        ? { id: editingProduct.id || editingProduct.slug, ...formData }
        : { ...formData };

      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (data.product) {
          try {
            const raw = localStorage.getItem('ktc_custom_products');
            let localList = raw ? JSON.parse(raw) : [];
            const targetId = data.product.id || data.product.slug;
            localList = localList.filter(p => (p.id || p.slug) !== targetId);
            localList.unshift(data.product);
            localStorage.setItem('ktc_custom_products', JSON.stringify(localList));
          } catch {}
        }
        // Unblock from deleted products if previously recorded
        try {
          const rawDel = localStorage.getItem('ktc_deleted_products');
          if (rawDel) {
            let delList = JSON.parse(rawDel);
            const targetId = (data.product && (data.product.id || data.product.slug)) || (editingProduct && (editingProduct.id || editingProduct.slug));
            delList = delList.filter(item => item !== targetId);
            localStorage.setItem('ktc_deleted_products', JSON.stringify(delList));
            window.dispatchEvent(new Event('storage'));
          }
        } catch {}

        setIsDrawerOpen(false);
        fetchProducts();
        alert(data.gitSynced ? "✓ Product saved & committed to GitHub repo!" : "✓ Product saved to Live Catalog successfully!");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Save error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete with Full Admin Access
  const handleDeleteProduct = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      setProducts(prev => prev.filter(p => (p.id || p.slug) !== id && p.id !== id && p.slug !== id));

      // Persist in deleted IDs registry in localStorage
      try {
        const rawDel = localStorage.getItem('ktc_deleted_products');
        const list = rawDel ? JSON.parse(rawDel) : [];
        if (!list.includes(id)) list.push(id);
        localStorage.setItem('ktc_deleted_products', JSON.stringify(list));

        // Remove from custom products
        const raw = localStorage.getItem('ktc_custom_products');
        if (raw) {
          let localList = JSON.parse(raw);
          localList = localList.filter(p => (p.id || p.slug) !== id && p.id !== id && p.slug !== id);
          localStorage.setItem('ktc_custom_products', JSON.stringify(localList));
        }

        window.dispatchEvent(new Event('storage'));
      } catch {}

      // Send API DELETE request to server
      await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      alert(`✓ "${title}" permanently removed from catalog.`);

    } catch (err) {
      console.warn("Delete request completed locally:", err.message);
    } finally {
      fetchProducts();
    }
  };

  // Restore Factory Items
  const handleRestoreCatalog = () => {
    if (!confirm("Are you sure you want to restore all factory catalog items? This will unhide any deleted items.")) return;
    try {
      localStorage.removeItem('ktc_deleted_products');
      window.dispatchEvent(new Event('storage'));
    } catch {}
    fetchProducts();
    alert("✓ All factory catalog items restored successfully!");
  };

  // Image File Upload (Handles Camera Shoot & Device Storage)
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // 1. Instant local preview via FileReader so photo is immediately visible
    const reader = new FileReader();
    reader.onload = (loadEv) => {
      const dataUri = loadEv.target?.result;
      if (dataUri) {
        setFormData(prev => ({ ...prev, image: dataUri }));
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload file to server or repo storage
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.warn("Upload server note (retaining local photo preview):", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Create Draft Order
  const handleCreateDraftOrder = (draftPayload) => {
    const newOrder = MedusaCommerce.orders.createDraftOrder(draftPayload);
    setOrders(MedusaCommerce.orders.listOrders());
    alert(`✓ Draft Wholesale Order ${newOrder.display_id} generated successfully!`);
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId, updates) => {
    MedusaCommerce.orders.updateOrderStatus(orderId, updates);
    setOrders(MedusaCommerce.orders.listOrders());
  };

  // Adjust Stock
  const handleAdjustStock = ({ productId, locationId, delta, reason }) => {
    MedusaCommerce.inventory.adjustStock(productId, locationId, delta, reason);
    setProducts(prev => prev.map(p => {
      if ((p.id || p.slug) === productId) {
        const cur = Number(p.stock !== undefined ? p.stock : 120);
        return { ...p, stock: Math.max(0, cur + Number(delta)) };
      }
      return p;
    }));
    alert(`✓ Stock adjusted by ${delta > 0 ? '+' : ''}${delta} units at warehouse.`);
  };

  // ----------------------------------------------------
  // RENDER: LOGIN VIEW (IF NOT AUTHENTICATED)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0b0f17] border border-zinc-800 rounded-3xl p-8 shadow-2xl text-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg mx-auto shadow-lg shadow-amber-500/20 mb-3">
              KTC
            </div>
            <h1 className="text-xl font-bold tracking-tight">Kamakhya Medusa Admin</h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Headless B2B Wholesale Commerce Engine</p>
          </div>

          {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Store Master Password / PIN:
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Store Password"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl font-mono">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-sm transition-all shadow-lg active:scale-98 disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Enter Medusa Admin Dashboard →'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setPin('970771')}
                  className="text-[11px] text-amber-400/90 hover:text-amber-300 underline font-mono font-bold"
                >
                  ⚡ Fill Store Master Password (970771)
                </button>
              </div>


              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-zinc-400 hover:text-white underline"
                >
                  Reset via WhatsApp OTP
                </button>
                <Link href="/" className="text-zinc-400 hover:text-white">
                  ← Back to Storefront
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-300">
                <p className="font-semibold text-white mb-1">Owner OTP Verification</p>
                <p className="text-[11px] text-zinc-400">
                  Verification code will be dispatched to registered phone: <strong className="text-white font-mono">{OWNER_PHONE}</strong>
                </p>
              </div>

              {!otpSent ? (
                <div className="space-y-3">
                  <input
                    type="tel"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="Enter owner phone"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isRequestingOtp}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl transition-all"
                  >
                    {isRequestingOtp ? 'Dispatching OTP...' : 'Send OTP to Phone →'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-Digit OTP"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono text-center tracking-widest text-lg"
                  />
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Set New Master PIN (e.g. 970771)"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl transition-all"
                  >
                    Verify & Reset PIN
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="text-zinc-500 hover:text-zinc-300 underline"
                >
                  ← Return to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: AUTHENTICATED MEDUSA ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 flex flex-col antialiased">
      <div className="flex flex-1">

        
        {/* 1. Medusa Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          productCount={products.length}
          orderCount={orders.length}
          onLogout={handleLogout}
        />

        {/* 2. Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <AdminHeader
            activeTab={activeTab}
            onOpenCreateProduct={openCreateModal}
            onOpenCreateDraftOrder={() => {
              setActiveTab('orders');
            }}
            onRestoreCatalog={handleRestoreCatalog}
            onSyncModules={fetchProducts}
            isRefreshing={isLoadingProducts}
          />

          {/* Body Content by Tab */}
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
            
            {activeTab === 'products' && (
              <ProductsView
                products={products}
                isLoading={isLoadingProducts}
                onEditProduct={openEditModal}
                onDeleteProduct={handleDeleteProduct}
                onOpenCreateProduct={openCreateModal}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                onCreateDraftOrder={handleCreateDraftOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                products={products}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                products={products}
                onAdjustStock={handleAdjustStock}
              />
            )}

            {activeTab === 'price_lists' && (
              <PricingView />
            )}

            {activeTab === 'customers' && (
              <CustomersView />
            )}

            {activeTab === 'promotions' && (
              <PromotionsView />
            )}

            {activeTab === 'workflows' && (
              <WorkflowsView />
            )}

            {activeTab === 'gateway' && (
              <GatewayView />
            )}

            {activeTab === 'settings' && (
              <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-6 space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-base font-bold text-white">Admin Security & Master Password</h3>
                  <p className="text-xs text-zinc-400 mt-1">Configure access keys and offline backup settings</p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                    <div className="text-zinc-400">Current Store Master Password:</div>
                    <div className="text-lg font-bold text-amber-300">970771</div>
                    <div className="text-[11px] text-zinc-500 font-sans">
                      Accepted across all decoupled microservices, universal adapter routes, and admin session login.
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                    <div className="text-zinc-400">Registered Recovery Phone:</div>
                    <div className="text-white font-bold">{OWNER_PHONE}</div>
                    <div className="text-[11px] text-zinc-500 font-sans">
                      SMS and WhatsApp OTP tokens are verified against this phone number.
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleRestoreCatalog}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 rounded-lg text-xs font-sans transition-colors"
                    >
                      ↺ Restore Factory Catalog Items
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Medusa Slide-Over Side Drawer (`FocusModal` / `Drawer`) */}
      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveProduct}
        isSaving={isSaving}
        isUploading={isUploading}
        onFileUpload={handleFileUpload}
        categories={CATEGORIES}
        fabrics={FABRIC_OPTIONS}
        sizesOptions={SIZES_OPTIONS}
      />

      {/* 4. Global Command Palette (`⌘K`) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        onSelectProduct={(p) => openEditModal(p)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenCreateProduct={openCreateModal}
        onOpenCreateDraftOrder={() => setActiveTab('orders')}
      />
    </div>
  );
}
