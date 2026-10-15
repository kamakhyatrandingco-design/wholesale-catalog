/**
 * Medusa Commerce Types & Constants
 * Modeled after Medusa 2.0 B2B & Wholesale specifications
 */

export const OrderStatus = {
  DRAFT: 'draft',
  PENDING_PAYMENT: 'pending_payment',
  PROCESSING: 'processing',
  FULFILLED: 'fulfilled',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PaymentStatus = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  TERMS_30D: 'terms_30d',
  REFUNDED: 'refunded'
};

export const FulfillmentStatus = {
  NOT_FULFILLED: 'not_fulfilled',
  PARTIALLY_FULFILLED: 'partially_fulfilled',
  FULFILLED: 'fulfilled',
  SHIPPED: 'shipped'
};

export const StockStatus = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};

export const DefaultLocations = [
  {
    id: 'loc_surat_central',
    name: 'Surat Central Mill & Depot',
    state: 'Gujarat',
    address: 'Ring Road Textile Market, Surat',
    type: 'primary_warehouse',
    active: true
  },
  {
    id: 'loc_jaipur_studio',
    name: 'Jaipur Finishing & Craft Studio',
    state: 'Rajasthan',
    address: 'Sanganer Dyeing & Printing Cluster, Jaipur',
    type: 'finishing_facility',
    active: true
  },
  {
    id: 'loc_guwahati_hub',
    name: 'Guwahati Regional Hub',
    state: 'Assam',
    address: 'Fancy Bazar Wholesale Point, Guwahati',
    type: 'regional_distribution',
    active: true
  }
];

export const DefaultPriceLists = [
  {
    id: 'pl_standard',
    name: 'Standard Wholesale Tier',
    description: 'Base wholesale rates for retail boutiques and emerging merchants',
    min_moq: 30,
    discount_pct: 0,
    active: true
  },
  {
    id: 'pl_gold',
    name: 'Boutique Gold Network',
    description: 'Verified boutiques with quarterly volume > 200 pcs',
    min_moq: 50,
    discount_pct: 8,
    active: true
  },
  {
    id: 'pl_diamond',
    name: 'Diamond Mega-Distributor',
    description: 'Multi-store distributors and state-level wholesale dealers',
    min_moq: 150,
    discount_pct: 15,
    free_freight: true,
    active: true
  }
];

export const DefaultCustomerGroups = [
  {
    id: 'grp_retail_boutiques',
    name: 'Retail Boutiques',
    price_list_id: 'pl_standard',
    payment_terms: 'Advance / COD',
    members_count: 142
  },
  {
    id: 'grp_gold_wholesalers',
    name: 'Gold Wholesale Buyers',
    price_list_id: 'pl_gold',
    payment_terms: '50% Advance, 50% on Dispatch',
    members_count: 58
  },
  {
    id: 'grp_diamond_distributors',
    name: 'Diamond State Distributors',
    price_list_id: 'pl_diamond',
    payment_terms: 'Net 30 Days Credit',
    members_count: 19
  }
];
