/**
 * Kamakhya Trading Co - Catalog & Inventory Microservice
 * Port: 5001 (Default)
 * High-performance product catalog with multi-tiered caching & inventory management.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || process.env.CATALOG_PORT || 5001;
const CONTENT_DIR = path.resolve(__dirname, '../../content/products');

// Local High-Speed In-Memory Cache
const catalogCache = new Map();
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Stock Level Inventory Ledger
const inventoryLedger = new Map();

/**
 * Basic frontmatter parser for markdown product files
 */
function parseMarkdownProduct(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return null;

    const yamlBlock = match[1];
    const body = match[2].trim();
    const data = {};

    yamlBlock.split(/\r?\n/).forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();

        // Strip quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }

        // Parse numbers or arrays
        if (!isNaN(val) && val !== '') {
          val = Number(val);
        } else if (val.startsWith('[') && val.endsWith(']')) {
          try {
            val = JSON.parse(val.replace(/'/g, '"'));
          } catch {
            val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          }
        }
        data[key] = val;
      }
    });

    const fileName = path.basename(filePath, '.md');
    const id = data.id || fileName;
    const initialStock = data.stock !== undefined ? Number(data.stock) : 500;

    // Seed inventory ledger if not set
    if (!inventoryLedger.has(id)) {
      inventoryLedger.set(id, initialStock);
    }

    return {
      id,
      slug: data.slug || fileName,
      ...data,
      stock: inventoryLedger.get(id),
      body
    };
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err.message);
    return null;
  }
}

/**
 * Load all products from markdown directory with caching
 */
function loadCatalog() {
  const now = Date.now();
  if (catalogCache.size > 0 && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return Array.from(catalogCache.values());
  }

  const products = [];
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const prod = parseMarkdownProduct(path.join(CONTENT_DIR, f));
      if (prod) {
        catalogCache.set(prod.id, prod);
        products.push(prod);
      }
    }
    cacheTimestamp = now;
  }
  return products;
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Global Headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  res.setHeader('x-service', 'catalog-service');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper to send json
  const sendJson = (status, data) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };

  try {
    // 1. Health Endpoint
    if (pathname === '/health' || pathname === '/catalog/health') {
      const products = loadCatalog();
      return sendJson(200, {
        status: 'UP',
        service: 'catalog-service',
        timestamp: new Date().toISOString(),
        productsCount: products.length,
        cacheEntries: catalogCache.size,
        memoryUsageMb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
      });
    }

    // 2. GET /catalog/products or /products
    if ((pathname === '/products' || pathname === '/catalog/products') && method === 'GET') {
      let products = loadCatalog();
      const category = parsedUrl.searchParams.get('category');
      const search = parsedUrl.searchParams.get('search');
      const minPrice = parsedUrl.searchParams.get('minPrice');
      const maxPrice = parsedUrl.searchParams.get('maxPrice');
      const sort = parsedUrl.searchParams.get('sort');

      if (category && category !== 'All Collections') {
        products = products.filter(p => p.category === category);
      }

      if (minPrice) {
        products = products.filter(p => Number(p.wholesale_price || 0) >= Number(minPrice));
      }

      if (maxPrice) {
        products = products.filter(p => Number(p.wholesale_price || 0) <= Number(maxPrice));
      }

      if (search) {
        const q = search.toLowerCase();
        products = products.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      }

      if (sort === 'price-low') {
        products.sort((a, b) => (a.wholesale_price || 0) - (b.wholesale_price || 0));
      } else if (sort === 'price-high') {
        products.sort((a, b) => (b.wholesale_price || 0) - (a.wholesale_price || 0));
      } else if (sort === 'moq-low') {
        products.sort((a, b) => (a.moq || 1) - (b.moq || 1));
      }

      return sendJson(200, {
        total: products.length,
        items: products
      });
    }

    // 3. GET /catalog/products/:id or /products/:id
    const productDetailMatch = pathname.match(/^\/(?:catalog\/)?products\/([a-zA-Z0-9_-]+)$/);
    if (productDetailMatch && method === 'GET') {
      const id = productDetailMatch[1];
      const products = loadCatalog();
      const product = products.find(p => p.id === id || p.slug === id);

      if (!product) {
        return sendJson(404, { error: `Product '${id}' not found in catalog.` });
      }
      return sendJson(200, product);
    }

    // 4. PUT /catalog/products/:id/stock (Inventory Reservation)
    const stockMatch = pathname.match(/^\/(?:catalog\/)?products\/([a-zA-Z0-9_-]+)\/stock$/);
    if (stockMatch && method === 'PUT') {
      const id = stockMatch[1];
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { delta = 0, newStock } = JSON.parse(body || '{}');
          const current = inventoryLedger.get(id) || 100;
          const updated = newStock !== undefined ? Number(newStock) : Math.max(0, current + Number(delta));
          inventoryLedger.set(id, updated);

          if (catalogCache.has(id)) {
            const cached = catalogCache.get(id);
            cached.stock = updated;
          }

          return sendJson(200, {
            success: true,
            id,
            previousStock: current,
            currentStock: updated,
            available: updated > 0
          });
        } catch (e) {
          return sendJson(400, { error: 'Invalid JSON payload: ' + e.message });
        }
      });
      return;
    }

    // 5. DELETE /catalog/products/:id or /products/:id
    const deleteMatch = pathname.match(/^\/(?:catalog\/)?products\/([a-zA-Z0-9_-]+)$/);
    if (deleteMatch && method === 'DELETE') {
      const id = deleteMatch[1];
      catalogCache.delete(id);
      inventoryLedger.delete(id);
      return sendJson(200, {
        success: true,
        id,
        message: `Product '${id}' removed from catalog service`
      });
    }

    // 5. GET /catalog/categories
    if ((pathname === '/categories' || pathname === '/catalog/categories') && method === 'GET') {
      const products = loadCatalog();
      const breakdown = {};
      products.forEach(p => {
        const cat = p.category || 'Uncategorized';
        breakdown[cat] = (breakdown[cat] || 0) + 1;
      });
      return sendJson(200, {
        totalCategories: Object.keys(breakdown).length,
        categories: breakdown
      });
    }

    // Fallback 404
    sendJson(404, { error: 'Route not found on catalog-service', path: pathname });
  } catch (error) {
    sendJson(500, { error: 'Internal server error in catalog-service: ' + error.message });
  }
});

server.listen(PORT, () => {
  console.log(`[catalog-service] Running decoupled on port ${PORT}`);
});

module.exports = server;
