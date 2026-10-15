/**
 * Medusa Commerce Core Container
 * Exports all decoupled commerce modules and the workflow orchestrator.
 */

import { inventoryModule } from './modules/inventory-module.js';
import { pricingModule } from './modules/pricing-module.js';
import { orderModule } from './modules/order-module.js';
import { customerModule } from './modules/customer-module.js';
import { promotionModule } from './modules/promotion-module.js';
import { WorkflowsRegistry } from './workflows/index.js';
import * as MedusaTypes from './types.js';

export const MedusaCommerce = {
  inventory: inventoryModule,
  pricing: pricingModule,
  orders: orderModule,
  customers: customerModule,
  promotions: promotionModule,
  workflows: WorkflowsRegistry,
  types: MedusaTypes
};

export default MedusaCommerce;
