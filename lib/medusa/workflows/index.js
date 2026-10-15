/**
 * Medusa Workflows Engine
 * Step-based composable transaction runner with compensation (rollback) and telemetry.
 * Modeled after Medusa 2.0 Workflow Orchestration specifications.
 */

import { inventoryModule } from '../modules/inventory-module.js';
import { pricingModule } from '../modules/pricing-module.js';
import { orderModule } from '../modules/order-module.js';
import { promotionModule } from '../modules/promotion-module.js';

export class WorkflowStep {
  constructor(name, invokeFn, compensateFn = null) {
    this.name = name;
    this.invokeFn = invokeFn;
    this.compensateFn = compensateFn;
  }
}

export class WorkflowExecutionResult {
  constructor(workflowName) {
    this.workflowName = workflowName;
    this.success = false;
    this.startedAt = new Date().toISOString();
    this.finishedAt = null;
    this.durationMs = 0;
    this.steps = [];
    this.result = null;
    this.error = null;
    this.rolledBack = false;
  }
}

export class MedusaWorkflow {
  constructor(name, steps = []) {
    this.name = name;
    this.steps = steps;
  }

  async run(initialInput) {
    const startTime = performance.now();
    const execLog = new WorkflowExecutionResult(this.name);
    const context = { input: initialInput, state: {}, executedSteps: [] };

    try {
      let currentPayload = initialInput;

      for (const step of this.steps) {
        const stepStart = performance.now();
        let stepOutput;
        try {
          stepOutput = await step.invokeFn(currentPayload, context);
          const stepDuration = Math.round((performance.now() - stepStart) * 100) / 100;
          execLog.steps.push({
            name: step.name,
            status: 'completed',
            durationMs: stepDuration,
            outputSummary: typeof stepOutput === 'object' ? Object.keys(stepOutput || {}) : typeof stepOutput
          });
          context.executedSteps.push(step);
          currentPayload = stepOutput !== undefined ? stepOutput : currentPayload;
        } catch (stepErr) {
          const stepDuration = Math.round((performance.now() - stepStart) * 100) / 100;
          execLog.steps.push({
            name: step.name,
            status: 'failed',
            durationMs: stepDuration,
            error: stepErr.message
          });
          throw stepErr;
        }
      }

      execLog.success = true;
      execLog.result = currentPayload;
    } catch (err) {
      execLog.success = false;
      execLog.error = err.message;

      // Execute Compensations in Reverse Order (Medusa Saga Rollback)
      for (const executedStep of context.executedSteps.reverse()) {
        if (typeof executedStep.compensateFn === 'function') {
          try {
            await executedStep.compensateFn(context);
            execLog.steps.push({
              name: `rollback:${executedStep.name}`,
              status: 'compensated',
              durationMs: 1
            });
          } catch (compErr) {
            console.error(`Compensation failed for ${executedStep.name}:`, compErr);
          }
        }
      }
      execLog.rolledBack = true;
    } finally {
      execLog.durationMs = Math.round((performance.now() - startTime) * 100) / 100;
      execLog.finishedAt = new Date().toISOString();
    }

    return execLog;
  }
}

// ----------------------------------------------------
// 1. Create Product Workflow
// ----------------------------------------------------
export const createProductWorkflow = new MedusaWorkflow('createProductWorkflow', [
  new WorkflowStep('validateProductSchema', async (input) => {
    if (!input.title || !input.wholesale_price) {
      throw new Error('Validation failed: title and wholesale_price are required.');
    }
    const cleanHandle = (input.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      ...input,
      handle: input.slug || cleanHandle,
      wholesale_price: Number(input.wholesale_price),
      retail_price: Number(input.retail_price || input.wholesale_price * 1.8),
      moq: Number(input.moq || 30)
    };
  }),

  new WorkflowStep('persistProductRecord', async (productData, ctx) => {
    ctx.state.savedProduct = productData;
    return productData;
  }, async (ctx) => {
    // Rollback record if subsequent warehouse step fails
    delete ctx.state.savedProduct;
  }),

  new WorkflowStep('initializeWarehouseStock', async (productData) => {
    const initialStock = Number(productData.stock || 120);
    inventoryModule.initProductStock(productData.id || productData.handle, initialStock);
    return {
      ...productData,
      stockAllocation: inventoryModule.getProductTotalStock(productData.id || productData.handle)
    };
  }),

  new WorkflowStep('indexSearchMetadata', async (productWithStock) => {
    return {
      ...productWithStock,
      searchIndexed: true,
      indexedAt: new Date().toISOString()
    };
  })
]);

// ----------------------------------------------------
// 2. Update Inventory Workflow
// ----------------------------------------------------
export const updateInventoryWorkflow = new MedusaWorkflow('updateInventoryWorkflow', [
  new WorkflowStep('verifyLocationAndDelta', async (input) => {
    const { productId, locationId, delta } = input;
    if (!productId || !locationId || delta === undefined) {
      throw new Error('productId, locationId, and delta are required for inventory update.');
    }
    return input;
  }),

  new WorkflowStep('commitStockDelta', async (input, ctx) => {
    const adjustment = inventoryModule.adjustStock(input.productId, input.locationId, input.delta, input.reason);
    ctx.state.adjustment = adjustment;
    return adjustment;
  }, async (ctx) => {
    // Rollback delta
    if (ctx.state.adjustment) {
      const { productId, locationId, delta } = ctx.state.adjustment;
      inventoryModule.adjustStock(productId, locationId, -delta, 'compensation_rollback');
    }
  }),

  new WorkflowStep('evaluateStockAlerts', async (adjustment) => {
    const total = inventoryModule.getProductTotalStock(adjustment.productId);
    return {
      ...adjustment,
      currentTotalStock: total.availableToPromise,
      stockStatus: total.status
    };
  })
]);

// ----------------------------------------------------
// 3. Create Draft Order Workflow
// ----------------------------------------------------
export const createDraftOrderWorkflow = new MedusaWorkflow('createDraftOrderWorkflow', [
  new WorkflowStep('validateOrderItems', async (input) => {
    if (!input.items || input.items.length === 0) {
      throw new Error('Draft order must contain at least one catalog item.');
    }
    return input;
  }),

  new WorkflowStep('computeTierPricingAndGst', async (input) => {
    const quotation = pricingModule.calculateBulkOrderQuote({
      items: input.items,
      priceListId: input.priceListId || 'pl_standard',
      promoDiscountPct: input.promoDiscountPct || 0
    });
    return {
      ...input,
      quotation
    };
  }),

  new WorkflowStep('generateOrderRecord', async (inputWithQuote) => {
    const order = orderModule.createDraftOrder({
      customerName: inputWithQuote.customerName,
      customerPhone: inputWithQuote.customerPhone,
      customerCity: inputWithQuote.customerCity,
      customerGstin: inputWithQuote.customerGstin,
      priceListId: inputWithQuote.priceListId,
      items: inputWithQuote.items,
      notes: inputWithQuote.notes
    });
    return order;
  })
]);

// ----------------------------------------------------
// 4. Calculate B2B Price Workflow
// ----------------------------------------------------
export const calculateB2BPriceWorkflow = new MedusaWorkflow('calculateB2BPriceWorkflow', [
  new WorkflowStep('resolveBuyerTier', async (input) => {
    const tier = pricingModule.getPriceList(input.priceListId || 'pl_standard');
    return { ...input, tier };
  }),

  new WorkflowStep('calculateItemBreakdown', async (input) => {
    return pricingModule.calculateItemPrice({
      baseWholesalePrice: input.wholesale_price,
      quantity: input.quantity,
      priceListId: input.tier.id,
      category: input.category
    });
  }),

  new WorkflowStep('applyPromotionalRule', async (priceResult, ctx) => {
    const promoCode = ctx.input.promoCode;
    let promoDetails = null;
    if (promoCode) {
      promoDetails = promotionModule.evaluatePromotion({
        code: promoCode,
        subtotal: priceResult.subtotal,
        totalPieces: priceResult.quantity
      });
    }
    return {
      ...priceResult,
      promotion: promoDetails
    };
  })
]);

export const WorkflowsRegistry = {
  createProductWorkflow,
  updateInventoryWorkflow,
  createDraftOrderWorkflow,
  calculateB2BPriceWorkflow
};
