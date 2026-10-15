'use client';

import { useState, useMemo } from 'react';

export default function OrdersView({
  orders = [],
  onCreateDraftOrder,
  onUpdateOrderStatus,
  products = []
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Draft Form State
  const [draftForm, setDraftForm] = useState({
    customerName: '',
    customerPhone: '',
    customerCity: '',
    customerGstin: '',
    priceListId: 'pl_standard',
    items: [],
    notes: ''
  });

  const [selectedItemToAdd, setSelectedItemToAdd] = useState({
    productId: products[0]?.id || '',
    quantity: 30
  });

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(o => o.status === statusFilter || o.payment_status === statusFilter);
  }, [orders, statusFilter]);

  // Order Metrics
  const metrics = useMemo(() => {
    let totalVolume = 0;
    let totalPieces = 0;
    let fulfilledCount = 0;

    orders.forEach(o => {
      totalVolume += Number(o.grand_total || 0);
      totalPieces += Number(o.total_pieces || 0);
      if (o.fulfillment_status === 'shipped' || o.fulfillment_status === 'fulfilled') {
        fulfilledCount++;
      }
    });

    const avgLotSize = orders.length > 0 ? Math.round(totalPieces / orders.length) : 0;
    return {
      totalCount: orders.length,
      totalVolume,
      avgLotSize,
      fulfilledCount
    };
  }, [orders]);

  const handleAddItemToDraft = () => {
    const prod = products.find(p => p.id === selectedItemToAdd.productId || p.slug === selectedItemToAdd.productId);
    if (!prod) return;

    setDraftForm(prev => {
      const existing = prev.items.find(it => it.id === prod.id || it.id === prod.slug);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map(it => 
            (it.id === prod.id || it.id === prod.slug)
              ? { ...it, quantity: it.quantity + Number(selectedItemToAdd.quantity) }
              : it
          )
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: prod.id || prod.slug,
            title: prod.title,
            wholesale_price: Number(prod.wholesale_price || 499),
            quantity: Number(selectedItemToAdd.quantity),
            category: prod.category || 'Ethnic Wear'
          }
        ]
      };
    });
  };

  const handleRemoveDraftItem = (id) => {
    setDraftForm(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (draftForm.items.length === 0) {
      alert("Please add at least one catalog item to the draft order.");
      return;
    }
    onCreateDraftOrder(draftForm);
    setIsDraftModalOpen(false);
    setDraftForm({
      customerName: '',
      customerPhone: '',
      customerCity: '',
      customerGstin: '',
      priceListId: 'pl_standard',
      items: [],
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">TOTAL B2B ORDERS</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.totalCount}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Wholesale Purchase Orders</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">TOTAL PO VOLUME</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            ₹{metrics.totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Gross Invoiced B2B Value</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">AVG LOT SIZE</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.avgLotSize} pcs</div>
          <div className="text-[10px] text-emerald-400 mt-1">Per wholesale consignment</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">FULFILLED ORDERS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.fulfilledCount}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Shipped via surface freight</div>
        </div>
      </div>

      {/* 2. Filter & Actions Toolbar */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Orders</option>
            <option value="draft">Draft Quotes</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Fulfilled / Shipped</option>
          </select>
        </div>

        <button
          onClick={() => setIsDraftModalOpen(true)}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Create Draft Wholesale Quote</span>
        </button>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Buyer Boutique</th>
                <th className="py-3 px-4">Tier & GSTIN</th>
                <th className="py-3 px-4">Lots / Pieces</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4 text-right">Invoice & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-amber-300">
                    {order.display_id || order.id}
                    <div className="text-[10px] text-zinc-500 font-sans">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-100">{order.customer_name}</div>
                    <div className="text-[10px] text-zinc-400">{order.customer_city} • {order.customer_phone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/80">
                      {order.tier || 'Standard Wholesale'}
                    </span>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {order.customer_gstin || 'URP'}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-zinc-200">{order.total_pieces} pcs</span>
                    <div className="text-[10px] text-zinc-500">
                      {order.items?.length || 1} catalog styles
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ₹{Number(order.grand_total || 0).toLocaleString('en-IN')}
                    <div className="text-[10px] text-zinc-500 font-normal">
                      Incl. GST ₹{Number(order.gst_total || 0).toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      order.payment_status === 'paid'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : order.payment_status === 'authorized' || order.payment_status === 'terms_30d'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    }`}>
                      ● {order.payment_status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : order.fulfillment_status === 'partially_fulfilled'
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                    }`}>
                      {order.fulfillment_status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition-colors"
                      >
                        Details
                      </button>
                      <a
                        href={`https://wa.me/${(order.customer_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste from Kamakhya Trading Co! Regarding your Wholesale Purchase Order ${order.display_id || order.id} for ${order.total_pieces} pieces (Total ₹${order.grand_total?.toLocaleString('en-IN')}). Your consignment is in dispatch process.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 text-[11px] bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 rounded border border-emerald-800/60 transition-colors"
                        title="Send WhatsApp update to buyer"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Order Detail Slide-Over Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-zinc-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <span>Proforma Invoice: {selectedOrder.display_id || selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Kamakhya Wholesale Purchase Order Ledger</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Buyer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
              <div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Billed To (Boutique)</div>
                <div className="font-bold text-white mt-0.5">{selectedOrder.customer_name}</div>
                <div className="text-zinc-400">{selectedOrder.customer_city}</div>
                <div className="text-zinc-400 font-mono">{selectedOrder.customer_phone}</div>
                <div className="text-zinc-400 font-mono">GSTIN: {selectedOrder.customer_gstin}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Order Status & Dispatch</div>
                <div className="mt-1 space-y-1">
                  <div>
                    <span className="text-zinc-500">Payment: </span>
                    <span className="font-mono uppercase text-amber-300 font-semibold">{selectedOrder.payment_status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Fulfillment: </span>
                    <span className="font-mono uppercase text-emerald-300 font-semibold">{selectedOrder.fulfillment_status}</span>
                  </div>
                  <div className="text-zinc-500">Tier: {selectedOrder.tier}</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-[10px] font-mono text-zinc-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item Style</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Wholesale Rate</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 px-3 font-semibold text-zinc-100">{it.title}</td>
                      <td className="py-2.5 px-3 font-mono">{it.quantity} pcs</td>
                      <td className="py-2.5 px-3 font-mono">₹{it.unit_price}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-right">₹{it.subtotal?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({selectedOrder.total_pieces} pieces):</span>
                <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Apparel GST (Integrated Tax):</span>
                <span>₹{selectedOrder.gst_total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-amber-300 pt-2 border-t border-zinc-800">
                <span>Grand Invoiced Total:</span>
                <span>₹{selectedOrder.grand_total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-mono">Set Status:</span>
                <button
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrder.id, { fulfillment_status: 'fulfilled' });
                    setSelectedOrder(prev => ({ ...prev, fulfillment_status: 'fulfilled' }));
                  }}
                  className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 rounded font-mono text-[11px]"
                >
                  Mark Fulfilled
                </button>
                <button
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrder.id, { payment_status: 'paid' });
                    setSelectedOrder(prev => ({ ...prev, payment_status: 'paid' }));
                  }}
                  className="px-2 py-1 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800 rounded font-mono text-[11px]"
                >
                  Mark Paid
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Draft Order Modal */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 text-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Create Draft Wholesale Quotation</h3>
                <p className="text-[11px] text-zinc-400">Medusa Order & Quotation Orchestration Engine</p>
              </div>
              <button onClick={() => setIsDraftModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveDraft} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Boutique / Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={draftForm.customerName}
                    onChange={e => setDraftForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="e.g. Saffron Silks Boutique"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">WhatsApp Phone *</label>
                  <input
                    type="text"
                    required
                    value={draftForm.customerPhone}
                    onChange={e => setDraftForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">City & State</label>
                  <input
                    type="text"
                    value={draftForm.customerCity}
                    onChange={e => setDraftForm(prev => ({ ...prev, customerCity: e.target.value }))}
                    placeholder="e.g. Surat, Gujarat"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Buyer GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={draftForm.customerGstin}
                    onChange={e => setDraftForm(prev => ({ ...prev, customerGstin: e.target.value }))}
                    placeholder="24ABCDE1234F1Z5"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Price Tier Selection */}
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Apply Wholesale Price Tier</label>
                <select
                  value={draftForm.priceListId}
                  onChange={e => setDraftForm(prev => ({ ...prev, priceListId: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="pl_standard">Standard Wholesale Tier (Base Rate)</option>
                  <option value="pl_gold">Boutique Gold Network (8% Tier Discount)</option>
                  <option value="pl_diamond">Diamond Mega-Distributor (15% Tier Discount + Free Freight)</option>
                </select>
              </div>

              {/* Add Catalog Item to Quote */}
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                <div className="font-semibold text-zinc-300 text-[11px]">Add Items to Consignment:</div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedItemToAdd.productId}
                    onChange={e => setSelectedItemToAdd(prev => ({ ...prev, productId: e.target.value }))}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-200"
                  >
                    {products.map(p => (
                      <option key={p.id || p.slug} value={p.id || p.slug}>
                        {p.title} (₹{p.wholesale_price})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedItemToAdd.quantity}
                    onChange={e => setSelectedItemToAdd(prev => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
                    className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-center"
                    placeholder="Qty"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToDraft}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold rounded-lg border border-zinc-700"
                  >
                    + Add
                  </button>
                </div>

                {/* Items Added List */}
                {draftForm.items.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {draftForm.items.map(it => (
                      <div key={it.id} className="flex items-center justify-between text-[11px] bg-zinc-950/60 p-2 rounded border border-zinc-800">
                        <span className="truncate flex-1">{it.title}</span>
                        <span className="font-mono text-zinc-400 mx-2">{it.quantity} pcs @ ₹{it.wholesale_price}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDraftItem(it.id)}
                          className="text-red-400 hover:text-red-300 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-sm"
                >
                  Save & Generate PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
