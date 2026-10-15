'use client';

export default function CustomersView() {
  const customerGroups = [
    {
      id: 'grp_retail_boutiques',
      name: 'Retail Boutiques',
      tier: 'Standard Wholesale Tier',
      payment_terms: 'Advance / COD',
      members_count: 142,
      min_quarterly_spend: '₹50,000'
    },
    {
      id: 'grp_gold_wholesalers',
      name: 'Gold Wholesale Buyers',
      tier: 'Boutique Gold Network (8% Off)',
      payment_terms: '50% Advance, 50% on L/R',
      members_count: 58,
      min_quarterly_spend: '₹2,50,000'
    },
    {
      id: 'grp_diamond_distributors',
      name: 'Diamond State Distributors',
      tier: 'Diamond Mega-Distributor (15% Off)',
      payment_terms: 'Net 30 Days Credit',
      members_count: 19,
      min_quarterly_spend: '₹10,000,000'
    }
  ];

  const customers = [
    {
      id: 'cust_01',
      company_name: 'Vogue Boutique Jaipur',
      contact_person: 'Pooja Sharma',
      phone: '+91 98290 12345',
      city: 'Jaipur, Rajasthan',
      gstin: '08ABCDE1234F1Z5',
      group_name: 'Gold Wholesale Buyers',
      credit_limit: 250000,
      total_orders_placed: 14,
      lifetime_value: 840000,
      status: 'verified'
    },
    {
      id: 'cust_02',
      company_name: 'Surat Textiles Wholesale Hub',
      contact_person: 'Rajesh Patel',
      phone: '+91 98795 67890',
      city: 'Surat, Gujarat',
      gstin: '24AABCS9876G1Z2',
      group_name: 'Diamond State Distributors',
      credit_limit: 1000000,
      total_orders_placed: 29,
      lifetime_value: 3450000,
      status: 'verified'
    },
    {
      id: 'cust_03',
      company_name: 'Guwahati Ethnic Emporium',
      contact_person: 'Ananya Barua',
      phone: '+91 94350 44556',
      city: 'Guwahati, Assam',
      gstin: '18AAEFG5566H1Z9',
      group_name: 'Retail Boutiques',
      credit_limit: 100000,
      total_orders_placed: 6,
      lifetime_value: 195000,
      status: 'verified'
    },
    {
      id: 'cust_04',
      company_name: 'Chandni Chowk Saree Palace',
      contact_person: 'Amit Gupta',
      phone: '+91 98110 54321',
      city: 'Delhi, NCR',
      gstin: '07AAACR1234A1ZA',
      group_name: 'Gold Wholesale Buyers',
      credit_limit: 500000,
      total_orders_placed: 19,
      lifetime_value: 1420000,
      status: 'verified'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Customer Groups Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customerGroups.map(grp => (
          <div key={grp.id} className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-semibold border border-zinc-700/60">
                {grp.members_count} Boutiques
              </span>
              <span className="text-xs text-zinc-500 font-mono">B2B Group</span>
            </div>
            <div className="font-bold text-white text-sm mt-2">{grp.name}</div>
            <div className="text-xs text-zinc-400 mt-1">Tier: {grp.tier}</div>
            <div className="text-[10px] font-mono text-zinc-500 mt-2">
              Credit Terms: {grp.payment_terms}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Customer Accounts Registry Table */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">B2B Buyer Accounts & GSTIN Directory</h3>
            <p className="text-xs text-zinc-400">Verified boutique buyers, state-level stockists & credit terms</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            {customers.length} Active Key Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Boutique / Store Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">City & GSTIN</th>
                <th className="py-3 px-4">Customer Group</th>
                <th className="py-3 px-4">Credit Limit</th>
                <th className="py-3 px-4">Lifetime Orders</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-100">{c.company_name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">ID: {c.id}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-zinc-200">{c.contact_person}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{c.phone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-zinc-300">{c.city}</div>
                    <div className="text-[10px] font-mono text-amber-400/90">{c.gstin}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {c.group_name}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                    ₹{c.credit_limit.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="text-white font-bold">₹{c.lifetime_value.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-zinc-500">{c.total_orders_placed} bulk consignments</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 uppercase">
                      ● {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
