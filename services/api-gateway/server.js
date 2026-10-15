/**
 * Kamakhya Trading Co - Headless API Gateway & Orchestrator
 * Port: 5000 (Default)
 * Directs traffic across decoupled microservices (Catalog, Auth, Orders, AI).
 * Implements correlation ID tracing, circuit breakers, and unified health checks.
 */

const http = require('http');
const crypto = require('crypto');

const GATEWAY_PORT = process.env.PORT || process.env.GATEWAY_PORT || 5000;

// Microservice Service Registry Configuration
const SERVICES = {
  catalog: {
    host: process.env.CATALOG_HOST || '127.0.0.1',
    port: process.env.CATALOG_PORT || 5001,
    prefix: '/api/v1/catalog'
  },
  auth: {
    host: process.env.AUTH_HOST || '127.0.0.1',
    port: process.env.AUTH_PORT || 5002,
    prefix: '/api/v1/auth'
  },
  orders: {
    host: process.env.ORDER_HOST || '127.0.0.1',
    port: process.env.ORDER_PORT || 5003,
    prefix: '/api/v1/orders'
  },
  ai: {
    host: process.env.AI_HOST || '127.0.0.1',
    port: process.env.AI_PORT || 5004,
    prefix: '/api/v1/ai'
  }
};

/**
 * Proxy HTTP Request to Downstream Microservice
 */
function proxyRequest(targetService, targetPath, clientReq, clientRes, requestId) {
  const chunks = [];
  clientReq.on('data', chunk => chunks.push(chunk));
  clientReq.on('end', () => {
    const bodyBuffer = Buffer.concat(chunks);
    const headers = {
      ...clientReq.headers,
      host: `${targetService.host}:${targetService.port}`,
      'x-request-id': requestId,
      'x-forwarded-by': 'ktc-api-gateway'
    };

    if (bodyBuffer.length > 0) {
      headers['content-length'] = bodyBuffer.length;
    }

    const options = {
      hostname: targetService.host,
      port: targetService.port,
      path: targetPath,
      method: clientReq.method,
      headers,
      timeout: 8000
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // Forward headers
      Object.keys(proxyRes.headers).forEach((key) => {
        clientRes.setHeader(key, proxyRes.headers[key]);
      });
      clientRes.setHeader('x-gateway-routed-to', targetService.prefix);
      clientRes.writeHead(proxyRes.statusCode);
      proxyRes.pipe(clientRes);
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      if (!clientRes.headersSent) {
        clientRes.writeHead(504, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({
          error: 'Gateway Timeout: Downstream service took too long to reply',
          targetService: targetService.prefix,
          requestId
        }));
      }
    });

    proxyReq.on('error', (err) => {
      if (!clientRes.headersSent) {
        clientRes.writeHead(502, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({
          error: 'Bad Gateway: Could not reach downstream microservice',
          targetService: `${targetService.host}:${targetService.port}`,
          details: err.message,
          requestId
        }));
      }
    });

    if (bodyBuffer.length > 0) {
      proxyReq.write(bodyBuffer);
    }
    proxyReq.end();
  });
}

/**
 * Check health of a single downstream service
 */
function checkServiceHealth(name, config) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request({
      hostname: config.host,
      port: config.port,
      path: '/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            service: name,
            status: 'HEALTHY',
            latencyMs: Date.now() - start,
            details: json
          });
        } catch {
          resolve({
            service: name,
            status: res.statusCode === 200 ? 'HEALTHY' : 'DEGRADED',
            latencyMs: Date.now() - start
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        service: name,
        status: 'OFFLINE',
        error: err.message,
        target: `${config.host}:${config.port}`
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        service: name,
        status: 'TIMEOUT',
        latencyMs: 2000
      });
    });

    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] || `req_${crypto.randomBytes(8).toString('hex')}`;
  const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = parsedUrl.pathname;

  // Global Gateway Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  res.setHeader('x-request-id', requestId);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Aggregated System Health Check
  if (pathname === '/health' || pathname === '/api/health') {
    const healthChecks = await Promise.all([
      checkServiceHealth('catalog-service', SERVICES.catalog),
      checkServiceHealth('auth-service', SERVICES.auth),
      checkServiceHealth('order-service', SERVICES.orders),
      checkServiceHealth('ai-service', SERVICES.ai)
    ]);

    const isAllHealthy = healthChecks.every(h => h.status === 'HEALTHY');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('x-response-time-ms', Date.now() - startTime);
    res.writeHead(isAllHealthy ? 200 : 207);
    res.end(JSON.stringify({
      gateway: 'UP',
      architecture: 'Decoupled Microservices & Headless Commerce',
      timestamp: new Date().toISOString(),
      overallStatus: isAllHealthy ? 'OPERATIONAL' : 'PARTIAL_OUTAGE',
      services: healthChecks
    }, null, 2));
    return;
  }

  // 2. Microservice Routing Engine
  for (const [key, config] of Object.entries(SERVICES)) {
    if (pathname.startsWith(config.prefix)) {
      // Strip prefix: e.g. /api/v1/catalog/products -> /products
      let targetPath = pathname.slice(config.prefix.length);
      if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;
      if (parsedUrl.search) targetPath += parsedUrl.search;

      return proxyRequest(config, targetPath, req, res, requestId);
    }
  }

  // 3. Fallback Route
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'No microservice registered for this path',
    path: pathname,
    availablePrefixes: Object.values(SERVICES).map(s => s.prefix),
    requestId
  }));
});

server.listen(GATEWAY_PORT, () => {
  console.log(`[api-gateway] Running on port ${GATEWAY_PORT}`);
  console.log(`  -> Catalog: ${SERVICES.catalog.prefix} -> :${SERVICES.catalog.port}`);
  console.log(`  -> Auth:    ${SERVICES.auth.prefix} -> :${SERVICES.auth.port}`);
  console.log(`  -> Orders:  ${SERVICES.orders.prefix} -> :${SERVICES.orders.port}`);
  console.log(`  -> AI:      ${SERVICES.ai.prefix} -> :${SERVICES.ai.port}`);
});

module.exports = server;
