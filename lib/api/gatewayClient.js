/**
 * Decoupled API Gateway Client SDK
 * Provides a unified communication interface for the Next.js Headless Presentation Layer.
 * Supports direct API Gateway routing with automatic fallback to Next.js universal API routes.
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_GATEWAY_URL || '')
  : (process.env.API_GATEWAY_URL || 'http://127.0.0.1:5000');

async function request(path, options = {}) {
  // Use API gateway if configured, otherwise fallback to local /api/v1 route
  const isDirectGateway = Boolean(process.env.NEXT_PUBLIC_API_GATEWAY_URL || process.env.API_GATEWAY_URL);
  const prefix = isDirectGateway ? '' : '/api/v1';
  const url = `${API_BASE_URL}${prefix}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-client-layer': 'nextjs-headless-storefront',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson = {};
      try {
        errorJson = JSON.parse(errorText);
      } catch {}
      throw new Error(errorJson.error || `HTTP ${res.status}: ${errorText || res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[GatewayClient] Request failed for ${path}:`, err.message);
    throw err;
  }
}

export const GatewayClient = {
  // 1. Catalog & Inventory Service
  async getCatalog(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/catalog/products${query ? `?${query}` : ''}`;
    try {
      const res = await request(endpoint);
      return res.items || res;
    } catch {
      // Fallback to legacy route if gateway is unmounted
      const fallback = await fetch('/api/products');
      return await fallback.json();
    }
  },

  async getProduct(id) {
    return request(`/catalog/products/${id}`);
  },

  async deleteProduct(id) {
    return request(`/catalog/products/${id}`, {
      method: 'DELETE'
    });
  },

  async reserveStock(id, count) {

    return request(`/catalog/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ delta: -count })
    });
  },

  // 2. Auth & Boutique Profile Service
  async loginAdmin(pin) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ pin })
    });
  },

  async registerBoutique(profile) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  },

  async requestRestock(payload) {
    return request('/auth/restock-alert', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 3. Order Processing & Quotation Service
  async calculateQuote(items, purchaseMode = 'wholesale') {
    return request('/orders/calculate-quote', {
      method: 'POST',
      body: JSON.stringify({ items, purchaseMode })
    });
  },

  async createPurchaseOrder(items, buyer = {}, purchaseMode = 'wholesale') {
    return request('/orders/create', {
      method: 'POST',
      body: JSON.stringify({ items, buyer, purchaseMode })
    });
  },

  async getProformaInvoice(orderId) {
    return request(`/orders/proforma/${orderId}`);
  },

  // 4. AI & Recommendation Engine Service
  async parseSearchIntent(query) {
    return request('/ai/parse-intent', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  },

  async generateTryon(params) {
    try {
      return await request('/ai/tryon', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    } catch {
      // Fallback to local tryon route
      const fallback = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await fallback.json();
    }
  },

  // 5. System Health Check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'OFFLINE', error: err.message };
    }
  }
};

export default GatewayClient;
