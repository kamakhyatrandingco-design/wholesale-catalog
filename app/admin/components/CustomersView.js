'use client';

import { useState, useEffect } from 'react';

export default function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.warn('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.business_name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.city || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* 1. Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">TOTAL REGISTERED CUSTOMERS</div>
          <div className="text-2xl font-bold text-white mt-1">{customers.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>●</span> Synced with Supabase Cloud DB
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">RETAIL BUYERS</div>
          <div className="text-2xl font-bold text-white mt-1">
            {customers.filter(c => c.account_type !== 'wholesale').length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">From ktcfashion.netlify.app</div>
        </div>

        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
          <div className="text-[11px] font-mono text-zinc-400">WHOLESALE BOUTIQUES</div>
          <div className="text-2xl font-bold text-white mt-1">
            {customers.filter(c => c.account_type === 'wholesale').length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">From wholesale-catalog-ktc8.vercel.app</div>
        </div>
      </div>

      {/* 2. Customer Directory Table */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Live Customer Registrations</h3>
            <p className="text-xs text-zinc-400">Real-time buyer sign-up details stored persistently in database</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, city..."
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-zinc-700 w-48 sm:w-64"
            />
            <button
              onClick={fetchCustomers}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-500 font-mono">
            Loading registered customers from database...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-zinc-400 text-sm font-medium">No Customer Registrations Found</div>
            <p className="text-zinc-500 text-xs max-w-md mx-auto">
              When buyers sign up or request restocks on the storefront, their name, phone number, and store details will be stored in Supabase and displayed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer / Buyer</th>
                  <th className="py-3 px-4">Shop / Business</th>
                  <th className="py-3 px-4">WhatsApp / Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredCustomers.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-100">{c.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">ID: {c.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-zinc-200">{c.business_name || 'Retail Buyer'}</div>
                      {c.gstin && <div className="text-[10px] font-mono text-amber-400/90">GSTIN: {c.gstin}</div>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-zinc-200 font-semibold">{c.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-zinc-300">{c.city || 'India'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        c.account_type === 'wholesale'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
                      }`}>
                        {c.account_type === 'wholesale' ? 'Wholesale B2B' : 'Retail'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-400 text-[11px] font-mono">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {c.phone && (
                        <a
                          href={`https://api.whatsapp.com/send?phone=91${String(c.phone).replace(/\D/g, '')}&text=${encodeURIComponent(`Namaste ${c.name}, greetings from Kamakhya Trading Co! Thank you for registering with us.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60 transition-colors"
                        >
                          WhatsApp ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
