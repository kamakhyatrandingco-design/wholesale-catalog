/**
 * Kamakhya Trading Co - Order Processing & Quotation Microservice
 * Port: 5003 (Default)
 * Transactional order engine with volume tiers, GST calculations, and proforma generator.
 */

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || process.env.ORDER_PORT || 5003;
const WHATSAPP_NUMBER = '916350626582';

// Transactional Orders Database (In-Memory ACID Ledger with persistence capability)
const orderDatabase = new Map();

/**
 * High-Precision Pricing & Volume Discount Engine
 */
function calculateOrderEconomics(items = [], purchaseMode = 'wholesale') {
  let subtotal = 0;
  let totalPieces = 0;
  let gstAmount = 0;

  const processedItems = items.map((item) => {
    const qty = Number(item.quantity || 1);
    const unitPrice = Number(item.price || 0);
    const lineTotal = qty * unitPrice;

    // Apparel GST Slab: 5% for items <= ₹1,000; 12% for items > ₹1,000
    const gstRate = unitPrice <= 1000 ? 0.05 : 0.12;
    const itemGst = Math.round(lineTotal * gstRate);

    subtotal += lineTotal;
    totalPieces += qty;
    gstAmount += itemGst;

    return {
      ...item,
      quantity: qty,
      price: unitPrice,
      lineTotal,
      gstRate: `${gstRate * 100}%`,
      gstAmount: itemGst
    };
  });

  // Wholesale Volume Subsidy Engine
  let tier = 1;
  let tierTitle = "Tier 1: Standard Mill Rate";
  let freightSubsidy = 0;
  let factoryRebate = 0;

  if (purchaseMode === 'wholesale') {
    if (totalPieces >= 100) {
      tier = 3;
      tierTitle = "Tier 3: Free Pan-India Freight + 3% Mill Rebate";
      freightSubsidy = 1500;
      factoryRebate = Math.round(subtotal * 0.03);
    } else if (totalPieces >= 50) {
      tier = 2;
      tierTitle = "Tier 2: 100% Free Pan-India Transport Freight Subsidy";
      freightSubsidy = 1500;
    }
  }

  const estimatedFreight = totalPieces >= 50 ? 0 : Math.max(300, Math.round(totalPieces * 8));
  const finalTotal = subtotal + gstAmount + estimatedFreight - factoryRebate;

  return {
    items: processedItems,
    totalLots: items.length,
    totalPieces,
    subtotal,
    gstAmount,
    estimatedFreight,
    volumeTier: {
      tier,
      tierTitle,
      freightSubsidy,
      factoryRebate
    },
    finalTotal
  };
}

/**
 * Master WhatsApp PO Generator
 */
function formatWhatsAppPO(order) {
  let msg = `Namaste Kamakhya Trading Co! 🙏\n\nI want to place an official *Bulk Wholesale Purchase Order* (PO #${order.orderId}):\n\n📋 *PURCHASE ORDER BREAKDOWN:*\n`;
  order.items.forEach((item, idx) => {
    msg += `\n${idx + 1}. *${item.title}* (${item.sku || 'SKU'})\n   • Variant: Color: ${item.color || 'Standard'} | Size: ${item.size || 'Free Size'}\n   • Qty: ${item.quantity} pcs @ ₹${item.price}/pc = ₹${item.lineTotal.toLocaleString('en-IN')}\n`;
  });
  msg += `\n-------------------------\n📊 *Total Lots:* ${order.totalLots} SKUs\n📦 *Total Quantity:* ${order.totalPieces} pcs\n💰 *Subtotal:* ₹${order.subtotal.toLocaleString('en-IN')}\n`;
  if (order.volumeTier.factoryRebate > 0) {
    msg += `🎁 *Tier 3 Rebate:* -₹${order.volumeTier.factoryRebate.toLocaleString('en-IN')}\n`;
  }
  msg += `📑 *Estimated GST:* ₹${order.gstAmount.toLocaleString('en-IN')}\n`;
  msg += `🚚 *Freight Status:* ${order.totalPieces >= 50 ? 'FREE Pan-India Dispatch (Subsidized)' : '₹' + order.estimatedFreight}\n`;
  msg += `\n*Buyer Business Profile:*\n• Boutique / Showroom:\n• City / State:\n• Preferred Transport Depot:\n\nPlease confirm ready stock availability and issue the formal GST proforma invoice.`;
  return msg;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  res.setHeader('x-service', 'order-service');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const sendJson = (status, data) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };

  // 1. Health Endpoint
  if (pathname === '/health' || pathname === '/orders/health') {
    return sendJson(200, {
      status: 'UP',
      service: 'order-service',
      totalOrdersProcessed: orderDatabase.size,
      timestamp: new Date().toISOString()
    });
  }

  let bodyStr = '';
  req.on('data', chunk => { bodyStr += chunk; });
  req.on('end', () => {
    let body = {};
    if (bodyStr) {
      try {
        body = JSON.parse(bodyStr);
      } catch {
        return sendJson(400, { error: 'Invalid JSON request payload' });
      }
    }

    try {
      // 2. Calculate Quotation & Volume Tiers: POST /orders/calculate-quote
      if ((pathname === '/calculate-quote' || pathname === '/orders/calculate-quote') && method === 'POST') {
        const { items = [], purchaseMode = 'wholesale' } = body;
        const economics = calculateOrderEconomics(items, purchaseMode);
        return sendJson(200, {
          success: true,
          ...economics
        });
      }

      // 3. Create Official Purchase Order: POST /orders/create
      if ((pathname === '/create' || pathname === '/orders/create') && method === 'POST') {
        const { items = [], buyer = {}, purchaseMode = 'wholesale' } = body;
        if (!items || items.length === 0) {
          return sendJson(400, { error: 'At least one lot item is required to generate an order' });
        }

        const orderId = `PO-KTC-${Date.now().toString().slice(-6)}`;
        const economics = calculateOrderEconomics(items, purchaseMode);

        const orderRecord = {
          orderId,
          status: 'STOCK_PENDING_CONFIRMATION',
          buyer: {
            shopName: buyer.shopName || 'Boutique Buyer',
            phone: buyer.phone || '916350626582',
            city: buyer.city || 'India',
            gstin: buyer.gstin || 'Unregistered'
          },
          purchaseMode,
          ...economics,
          createdAt: new Date().toISOString()
        };

        const whatsappPOText = formatWhatsAppPO(orderRecord);
        orderRecord.whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappPOText)}`;
        orderRecord.whatsappText = whatsappPOText;

        orderDatabase.set(orderId, orderRecord);

        return sendJson(201, {
          success: true,
          message: 'Bulk purchase order generated successfully',
          order: orderRecord
        });
      }

      // 4. Retrieve Order Detail: GET /orders/:id
      const orderGetMatch = pathname.match(/^\/(?:orders\/)?([a-zA-Z0-9_-]+)$/);
      if (orderGetMatch && method === 'GET') {
        const orderId = orderGetMatch[1];
        const order = orderDatabase.get(orderId);
        if (!order) {
          return sendJson(404, { error: `Order '${orderId}' not found` });
        }
        return sendJson(200, order);
      }

      // 5. Proforma Invoice Data: GET /orders/proforma/:id
      const proformaMatch = pathname.match(/^\/(?:orders\/)?proforma\/([a-zA-Z0-9_-]+)$/);
      if (proformaMatch && method === 'GET') {
        const orderId = proformaMatch[1];
        const order = orderDatabase.get(orderId);
        if (!order) {
          return sendJson(404, { error: `Order '${orderId}' not found for proforma generation` });
        }

        return sendJson(200, {
          invoiceNumber: `PI-${order.orderId}`,
          seller: {
            companyName: "Kamakhya Trading Co",
            facility: "Direct Mill Weaving & Manufacturing Hub",
            gstin: "08AABCK1234F1Z5",
            dispatchLocations: ["Surat, Gujarat", "Jaipur, Rajasthan"],
            supportWhatsApp: "+91 63506 26582"
          },
          ...order
        });
      }

      sendJson(404, { error: `Route ${pathname} not found on order-service` });
    } catch (err) {
      sendJson(500, { error: 'Internal error in order-service: ' + err.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`[order-service] Running decoupled on port ${PORT}`);
});

module.exports = server;
