'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';

const OWNER_PHONE = "916350626582";

function subscribeBuyer(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getBuyerSnapshot() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('ktc_buyer_user') || '';
  } catch {
    return '';
  }
}

function getRestockSnapshot() {
  if (typeof window === 'undefined') return '[]';
  try {
    return localStorage.getItem('ktc_restock_requests') || '[]';
  } catch {
    return '[]';
  }
}

export default function UserAuthModal({
  isOpen,
  onClose,
  products = [],
  initialRestockProduct = null
}) {
  const buyerRaw = useSyncExternalStore(subscribeBuyer, getBuyerSnapshot, () => '');
  const restockRaw = useSyncExternalStore(subscribeBuyer, getRestockSnapshot, () => '[]');

  const savedUser = useMemo(() => {
    if (!buyerRaw) return null;
    try {
      return JSON.parse(buyerRaw);
    } catch {
      return null;
    }
  }, [buyerRaw]);

  const [localUser, setLocalUser] = useState(undefined);
  const currentUser = localUser !== undefined ? localUser : savedUser;

  const [tabOverride, setTabOverride] = useState(null);
  const activeTab = tabOverride || (currentUser ? 'restock' : 'login');
  const setActiveTab = setTabOverride;

  // Login form state
  const [buyerName, setBuyerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Restock form state
  const [selectedSku, setSelectedSku] = useState(initialRestockProduct?.sku || (products[0]?.sku || ''));
  const [restockQty, setRestockQty] = useState(50);
  const [preferredColor, setPreferredColor] = useState('All Running Colors');
  const [notes, setNotes] = useState('');
  const [restockSuccess, setRestockSuccess] = useState(false);

  const [localRequests, setLocalRequests] = useState(null);
  const savedRequests = useMemo(() => {
    if (localRequests) return localRequests;
    try {
      return JSON.parse(restockRaw) || [];
    } catch {
      return [];
    }
  }, [localRequests, restockRaw]);

  // Sync initialRestockProduct if changed externally
  const [prevRestockProduct, setPrevRestockProduct] = useState(initialRestockProduct);
  if (initialRestockProduct !== prevRestockProduct) {
    setPrevRestockProduct(initialRestockProduct);
    if (initialRestockProduct) {
      setSelectedSku(initialRestockProduct.sku);
      setTabOverride('restock');
    }
  }

  if (!isOpen) return null;

  // Handle Login / Registration
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!buyerName || !phone) {
      alert("Please provide your name and WhatsApp phone number.");
      return;
    }
    const user = {
      name: buyerName,
      shop: shopName || 'Retail Store',
      phone: phone.replace(/\D/g, ''),
      city: city || 'India',
      registeredAt: new Date().toISOString()
    };
    setLocalUser(user);
    try {
      localStorage.setItem('ktc_buyer_user', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setActiveTab('restock');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ktc_buyer_user');
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setLocalUser(null);
    setActiveTab('login');
  };

  // Handle Restock Submission
  const handleSubmitRestock = (e) => {
    e.preventDefault();
    const product = products.find(p => p.sku === selectedSku) || products[0];
    const buyerDisplayName = currentUser?.name || buyerName || 'Boutique Buyer';
    const buyerShop = currentUser?.shop || shopName || 'Boutique Store';
    const buyerCity = currentUser?.city || city || 'India';
    const buyerPhone = currentUser?.phone || phone || 'Registered Mobile';

    const newRequest = {
      id: Date.now(),
      sku: product?.sku,
      title: product?.title,
      quantity: restockQty,
      color: preferredColor,
      notes,
      date: new Date().toLocaleDateString('en-IN')
    };

    const updated = [newRequest, ...savedRequests];
    setLocalRequests(updated);
    try {
      localStorage.setItem('ktc_restock_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setRestockSuccess(true);

    // Direct WhatsApp message to factory owner
    const message = `Namaste Kamakhya Trading Co!\n\nI want to place an *URGENT RESTOCK REQUEST*:\n\n*Product:* ${product?.title} (${product?.sku})\n*Quantity Required:* ${restockQty} pieces\n*Preferred Color:* ${preferredColor}\n*Notes:* ${notes || 'Immediate production lot needed'}\n\n*Buyer Details:*\n• Name: ${buyerDisplayName}\n• Shop: ${buyerShop}\n• City: ${buyerCity}\n• WhatsApp: ${buyerPhone}\n\nPlease inform advance booking slot & estimated dispatch date.`;

    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?phone=${OWNER_PHONE}&text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      setRestockSuccess(false);
    }, 1200);
  };

  // Quick Direct Contact Messages
  const handleQuickContact = (templateType) => {
    let msg = `Namaste Kamakhya Trading Co!\n\n`;
    const buyerInfo = currentUser ? `I am ${currentUser.name} from ${currentUser.shop}, ${currentUser.city}.\n\n` : '';

    if (templateType === 'custom') {
      msg += `${buyerInfo}I want to discuss *Custom Fabric Manufacturing / Batch Production* for my boutique. Please share manufacturing MOQs and lead time.`;
    } else if (templateType === 'transport') {
      msg += `${buyerInfo}I want to inquire about *Transport Logistics & Freight Rates* for dispatch to my city.`;
    } else if (templateType === 'discount') {
      msg += `${buyerInfo}I am planning a *Large Volume Purchase (200+ pcs)* across Kurtis and Lehengas. Please share special volume discount rates.`;
    } else {
      msg += `${buyerInfo}Please share your latest printed catalog and fabric sample swatches.`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${OWNER_PHONE}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                  Boutique Buyer Portal
                </h2>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Verified Buyer
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {currentUser ? `${currentUser.name} • ${currentUser.shop} (${currentUser.city})` : 'Sign in to request restock & connect directly with factory owner'}
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('restock')}
            className={`flex-1 pb-3 text-center transition-all cursor-pointer ${
              activeTab === 'restock'
                ? 'border-b-2 border-black text-black font-black'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            Request Restock
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 pb-3 text-center transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'border-b-2 border-black text-black font-black'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            Contact Mill Desk
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-center transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-b-2 border-black text-black font-black'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {currentUser ? 'Profile' : 'Sign In'}
          </button>
        </div>

        {/* TAB 1: REQUEST RESTOCK */}
        {activeTab === 'restock' && (
          <form onSubmit={handleSubmitRestock} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Select Garment / SKU to Restock:
              </label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.sku}>
                    {p.title} ({p.sku}) - ₹{p.wholesale_price}/pc
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Required Quantity (Pieces):
                </label>
                <input
                  type="number"
                  min="25"
                  step="5"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Preferred Color / Shade:
                </label>
                <input
                  type="text"
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  placeholder="e.g. Red, Blue, or All Mix"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Urgency / Notes for Manufacturing:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need delivery before upcoming wedding season / diwali festival"
                rows={2}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
              />
            </div>

            {!currentUser && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Tip: Sign in so the factory recognizes your boutique order history.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="underline font-bold text-amber-900 ml-2"
                >
                  Quick Sign In
                </button>
              </div>
            )}

            {restockSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                <span>Restock request logged! Launching WhatsApp dispatch message...</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Send Urgent Restock Request to Factory WhatsApp</span>
            </button>
          </form>
        )}

        {/* TAB 2: CONTACT FACTORY OWNER */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Factory Trade Desk:</span>
                <span className="font-black text-emerald-600 font-mono text-sm">+91 63506 26582</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                Speak directly with Kamakhya Trading Co manufacturing lead for customized orders, GST proforma, or transport tracking slips.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 block">Select Inquiry Topic:</span>
              
              <button
                onClick={() => handleQuickContact('custom')}
                className="w-full p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 text-left text-xs font-bold text-gray-800 flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <span>Custom Batch Production &amp; Tailoring</span>
                <span className="text-emerald-600">WhatsApp &rarr;</span>
              </button>

              <button
                onClick={() => handleQuickContact('transport')}
                className="w-full p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 text-left text-xs font-bold text-gray-800 flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <span>Transport Freight Rates &amp; Door Delivery</span>
                <span className="text-emerald-600">WhatsApp &rarr;</span>
              </button>

              <button
                onClick={() => handleQuickContact('discount')}
                className="w-full p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 text-left text-xs font-bold text-gray-800 flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <span>Volume Lot Inquiry (200+ Pieces)</span>
                <span className="text-emerald-600">WhatsApp &rarr;</span>
              </button>

              <button
                onClick={() => handleQuickContact('catalog')}
                className="w-full p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 text-left text-xs font-bold text-gray-800 flex items-center justify-between transition-colors shadow-xs cursor-pointer"
              >
                <span>Fabric Swatches &amp; Wholesale Inquiries</span>
                <span className="text-emerald-600">WhatsApp &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BUYER LOGIN / PROFILE */}
        {activeTab === 'login' && (
          <div>
            {!currentUser ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <p className="text-xs text-gray-500 mb-2">
                  Enter your details once. We will auto-fill your purchase orders, quotations, and restock requests.
                </p>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Boutique / Shop Name:</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Elegance Couture Boutique"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Mobile:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">City / State:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2"
                >
                  Save Buyer Profile & Continue →
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer Name:</span>
                    <span className="font-bold text-gray-900">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Boutique / Store:</span>
                    <span className="font-bold text-gray-900">{currentUser.shop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">WhatsApp Mobile:</span>
                    <span className="font-bold text-gray-900">{currentUser.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-bold text-gray-900">{currentUser.city}</span>
                  </div>
                </div>

                {savedRequests.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-2">Past Restock Requests:</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {savedRequests.map(r => (
                        <div key={r.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-[11px] flex justify-between items-center">
                          <span><b>{r.title}</b> ({r.quantity} pcs)</span>
                          <span className="text-gray-400">{r.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-xs font-bold text-red-600 hover:text-red-800 underline"
                >
                  Sign Out of Buyer Profile
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
