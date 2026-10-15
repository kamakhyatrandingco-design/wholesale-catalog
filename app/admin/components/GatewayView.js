'use client';

import { useState } from 'react';

export default function GatewayView() {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  const services = [
    {
      name: 'Decoupled API Gateway',
      port: 5000,
      role: 'Ingress routing, circuit breakers, request correlation (x-request-id)',
      status: 'Ready / Universal Adapter Active',
      path: '/api/v1/*'
    },
    {
      name: 'Catalog & Inventory Service',
      port: 5001,
      role: 'SKU repository, multi-location warehouse allocations, line-sheet feeds',
      status: 'Ready / In-Process Fallback',
      path: '/api/v1/catalog/*'
    },
    {
      name: 'Auth & Boutique Profile Service',
      port: 5002,
      role: 'Stateless HMAC tokens, master PIN authentication, OTP recovery queues',
      status: 'Ready / In-Process Fallback',
      path: '/api/v1/auth/*'
    },
    {
      name: 'Order & Quotation Service',
      port: 5003,
      role: 'B2B price lists, volume tier calculations, apparel GST tax engines',
      status: 'Ready / In-Process Fallback',
      path: '/api/v1/orders/*'
    },
    {
      name: 'AI & Try-On Studio Service',
      port: 5004,
      role: 'Neural Try-On simulations, natural language search parsing, recommendations',
      status: 'Ready / In-Process Fallback',
      path: '/api/v1/ai/*'
    }
  ];

  const handlePingGateway = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/v1/health');
      const data = await res.json();
      setPingResult({
        success: true,
        data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      setPingResult({
        success: false,
        error: err.message,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Decoupled Microservice Gateway Status</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              Universal Adapter Active
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            The headless presentation layer uses a dual-mode communication bus. It dynamically probes ports 5000-5004 and seamlessly executes in-process microservice logic if offline.
          </p>
        </div>

        <button
          onClick={handlePingGateway}
          disabled={isPinging}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-semibold rounded-lg border border-zinc-700 shadow-sm transition-all"
        >
          {isPinging ? 'Pinging...' : '⚡ Probe Health (/api/v1/health)'}
        </button>
      </div>

      {pingResult && (
        <div className={`p-4 rounded-xl border text-xs font-mono ${
          pingResult.success ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' : 'bg-red-950/40 border-red-800/60 text-red-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">Gateway Health Ping Response ({pingResult.timestamp}):</span>
            <span className="uppercase text-[10px]">{pingResult.success ? 'HTTP 200 OK' : 'Probe Error'}</span>
          </div>
          <pre className="text-[11px] overflow-x-auto text-zinc-300">
            {JSON.stringify(pingResult.data || pingResult.error, null, 2)}
          </pre>
        </div>
      )}

      {/* 2. Microservice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(svc => (
          <div key={svc.name} className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{svc.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                Port {svc.port}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{svc.role}</p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {svc.status}
              </span>
              <span className="text-zinc-500">{svc.path}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
