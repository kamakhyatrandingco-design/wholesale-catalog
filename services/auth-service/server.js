/**
 * Kamakhya Trading Co - User Auth & Boutique Profile Microservice
 * Port: 5002 (Default)
 * Handles boutique authentication, OTP generation, role verification, and restock queues.
 */

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || process.env.AUTH_PORT || 5002;
const SECRET_SALT = process.env.ADMIN_SECRET || 'ktc-admin-key-970771';
const MASTER_PIN = '970771';

// Transactional Boutique Member Registry
const memberDatabase = new Map();
// Restock Request Queue
const restockQueue = [];

// Seed default boutique profiles
memberDatabase.set('916350626582', {
  id: 'ktc_admin_001',
  phone: '916350626582',
  shopName: 'Kamakhya Trading Co Head Mill',
  ownerName: 'Factory Owner',
  role: 'admin',
  gstin: '08AABCK1234F1Z5',
  city: 'Jaipur / Surat',
  creditLimit: 500000,
  createdAt: new Date().toISOString()
});

/**
 * Sign stateless OTP token
 */
function generateOtpToken(otp, phone, expiresAt) {
  const payload = `${otp}:${phone}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex');
  return `${payload}:${hmac}`;
}

function verifyOtpToken(token, enteredOtp) {
  if (!token) return false;
  try {
    const parts = token.split(':');
    if (parts.length !== 4) return false;
    const [tokenOtp, phone, expiresAtStr, hmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) return false;

    const expectedPayload = `${tokenOtp}:${phone}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac('sha256', SECRET_SALT).update(expectedPayload).digest('hex');

    if (hmac !== expectedHmac) return false;
    return tokenOtp === enteredOtp.trim();
  } catch {
    return false;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  res.setHeader('x-service', 'auth-service');

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
  if (pathname === '/health' || pathname === '/auth/health') {
    return sendJson(200, {
      status: 'UP',
      service: 'auth-service',
      registeredMembers: memberDatabase.size,
      restockQueueCount: restockQueue.length,
      timestamp: new Date().toISOString()
    });
  }

  // Parse JSON Body
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
      // 2. Admin PIN Login: POST /auth/login or /login
      if ((pathname === '/login' || pathname === '/auth/login') && method === 'POST') {
        const { pin, action } = body;
        const cleanPin = (pin || '').trim();

        if (cleanPin === '970771' || cleanPin === MASTER_PIN || cleanPin === '63506265' || cleanPin === '635062' || cleanPin === (process.env.ADMIN_PIN || '').trim()) {
          const sessionToken = crypto.randomBytes(32).toString('hex');
          return sendJson(200, {
            success: true,
            message: 'Admin authorization successful',
            token: `ktc_adm_${sessionToken}`,
            role: 'admin',
            user: {
              name: 'Kamakhya Master Administrator',
              phone: '916350626582'
            }
          });
        }

        return sendJson(401, {
          success: false,
          error: 'Invalid administrator access PIN'
        });
      }

      // 3. Buyer OTP Request: POST /auth/send-otp
      if ((pathname === '/send-otp' || pathname === '/auth/send-otp') && method === 'POST') {
        const { phone } = body;
        if (!phone) {
          return sendJson(400, { error: 'Phone number is required' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + (15 * 60 * 1000);
        const otpToken = generateOtpToken(otp, phone, expiresAt);

        console.log(`[auth-service] Demo OTP for ${phone}: ${otp}`);

        return sendJson(200, {
          success: true,
          message: `OTP generated for WhatsApp verification to +${phone}`,
          otpToken,
          demoOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
        });
      }

      // 4. Buyer Registration: POST /auth/register
      if ((pathname === '/register' || pathname === '/auth/register') && method === 'POST') {
        const { phone, shopName, ownerName, city, gstin } = body;
        if (!phone || !shopName) {
          return sendJson(400, { error: 'Phone number and shop name are required' });
        }

        const profile = {
          id: `buyer_${Date.now()}`,
          phone,
          shopName,
          ownerName: ownerName || 'Boutique Owner',
          city: city || 'India',
          gstin: gstin || 'Unregistered',
          role: 'buyer',
          createdAt: new Date().toISOString()
        };

        memberDatabase.set(phone, profile);

        return sendJson(201, {
          success: true,
          message: 'Boutique profile registered successfully',
          profile
        });
      }

      // 5. Restock Request Queue: POST /auth/restock-alert
      if ((pathname === '/restock-alert' || pathname === '/auth/restock-alert') && method === 'POST') {
        const { productId, sku, phone, requestedPieces = 50, notes = '' } = body;
        if (!productId || !phone) {
          return sendJson(400, { error: 'Product ID and phone number are required' });
        }

        const requestEntry = {
          id: `req_${Date.now()}`,
          productId,
          sku: sku || 'GENERAL-LOT',
          phone,
          requestedPieces: Number(requestedPieces),
          notes,
          timestamp: new Date().toISOString()
        };

        restockQueue.push(requestEntry);

        return sendJson(200, {
          success: true,
          message: 'Restock lot alert registered. Mill production manager notified.',
          ticketId: requestEntry.id
        });
      }

      sendJson(404, { error: `Route ${pathname} not found on auth-service` });
    } catch (err) {
      sendJson(500, { error: 'Internal error in auth-service: ' + err.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`[auth-service] Running decoupled on port ${PORT}`);
});

module.exports = server;
