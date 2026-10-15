'use client';

import { useState } from 'react';
import { WorkflowsRegistry } from '@/lib/medusa/workflows/index.js';

export default function WorkflowsView() {
  const [activeWorkflow, setActiveWorkflow] = useState('createProductWorkflow');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const workflows = [
    {
      id: 'createProductWorkflow',
      name: 'createProductWorkflow',
      description: 'Validates schema, allocates warehouse stock across Surat/Jaipur/Guwahati, and indexes catalog metadata.',
      steps: [
        'validateProductSchema',
        'persistProductRecord',
        'initializeWarehouseStock',
        'indexSearchMetadata'
      ],
      sampleInput: {
        title: 'Chanderi Gold Zari Suit',
        wholesale_price: 649,
        category: 'Ethnic Wear',
        stock: 150
      }
    },
    {
      id: 'updateInventoryWorkflow',
      name: 'updateInventoryWorkflow',
      description: 'Atomic warehouse stock delta commit with compensation rollback and stock status alert evaluation.',
      steps: [
        'verifyLocationAndDelta',
        'commitStockDelta',
        'evaluateStockAlerts'
      ],
      sampleInput: {
        productId: 'anarkali-suit-set',
        locationId: 'loc_surat_central',
        delta: 25,
        reason: 'mill_weft_delivery'
      }
    },
    {
      id: 'createDraftOrderWorkflow',
      name: 'createDraftOrderWorkflow',
      description: 'Orchestrates wholesale quotation, buyer tier calculation, Indian Apparel GST application, and proforma generation.',
      steps: [
        'validateOrderItems',
        'computeTierPricingAndGst',
        'generateOrderRecord'
      ],
      sampleInput: {
        customerName: 'Kolkata Saree Emporium',
        customerPhone: '+91 98300 11223',
        customerCity: 'Kolkata, WB',
        priceListId: 'pl_gold',
        items: [
          { id: 'pure-cotton-kurti', title: 'Jaipuri Cotton Kurti', wholesale_price: 367, quantity: 50 }
        ]
      }
    },
    {
      id: 'calculateB2BPriceWorkflow',
      name: 'calculateB2BPriceWorkflow',
      description: 'Dynamic price matrix resolving customer groups, volume slabs, apparel GST rates, and promotional coupons.',
      steps: [
        'resolveBuyerTier',
        'calculateItemBreakdown',
        'applyPromotionalRule'
      ],
      sampleInput: {
        wholesale_price: 899,
        quantity: 120,
        priceListId: 'pl_diamond',
        promoCode: 'FREESHIP',
        category: 'Bridal'
      }
    }
  ];

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    const wfDef = workflows.find(w => w.id === activeWorkflow);
    const workflowInstance = WorkflowsRegistry[activeWorkflow];

    try {
      if (workflowInstance) {
        const res = await workflowInstance.run(wfDef.sampleInput);
        setExecutionResult(res);
      }
    } catch (err) {
      setExecutionResult({
        success: false,
        error: err.message,
        steps: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const currentWf = workflows.find(w => w.id === activeWorkflow);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Medusa Workflows Orchestrator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Saga Engine
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Medusa 2.0 Workflows orchestrate multi-step commerce transactions with step execution tracking, timing benchmarks, and automatic compensation (rollback) if any step fails.
            </p>
          </div>

          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>▶</span>
            <span>{isRunning ? 'Executing Steps...' : `Run ${currentWf.name}`}</span>
          </button>
        </div>
      </div>

      {/* 2. Workflow Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => {
              setActiveWorkflow(wf.id);
              setExecutionResult(null);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeWorkflow === wf.id
                ? 'bg-zinc-800/90 border-amber-400/40 text-white shadow-sm'
                : 'bg-[#0b0f17] border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="font-mono text-xs font-semibold text-amber-300 truncate">{wf.name}</div>
            <div className="text-[10px] text-zinc-400 mt-1">{wf.steps.length} transaction steps</div>
          </button>
        ))}
      </div>

      {/* 3. Visual Step Diagram */}
      <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h4 className="font-mono font-bold text-white text-sm">{currentWf.name}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{currentWf.description}</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Step Graph Flow:</span>
        </div>

        {/* Step Nodes */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {currentWf.steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="font-mono text-zinc-200">{step}</span>
              </div>
              {idx < currentWf.steps.length - 1 && (
                <span className="text-zinc-600 font-mono text-sm">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Execution Telemetry Log */}
      {executionResult && (
        <div className="bg-[#0b0f17] border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${executionResult.success ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <h4 className="font-mono font-bold text-white text-sm">
                Execution Telemetry: {executionResult.workflowName}
              </h4>
            </div>
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-3">
              <span>Duration: <strong className="text-amber-300">{executionResult.durationMs}ms</strong></span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                executionResult.success
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  : 'bg-red-950/60 text-red-300 border border-red-800/40'
              }`}>
                {executionResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900 text-[10px] text-zinc-400 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Step Name</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Output Schema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {executionResult.steps.map((st, i) => (
                  <tr key={i} className="hover:bg-zinc-900/40">
                    <td className="py-2.5 px-3 font-semibold text-zinc-100">{st.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span>✓</span> {st.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">{st.durationMs} ms</td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[11px]">
                      {Array.isArray(st.outputSummary) ? st.outputSummary.join(', ') : st.outputSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
