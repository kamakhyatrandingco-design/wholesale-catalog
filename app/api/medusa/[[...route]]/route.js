import { NextResponse } from 'next/server';
import { MedusaCommerce } from '@/lib/medusa/index.js';

export async function GET(req, context) {
  const params = await context.params;
  const routeSegments = params?.route || [];
  const scope = routeSegments[0]; // 'admin' or 'store'
  const domain = routeSegments[1]; // 'inventory', 'orders', 'price-lists', 'customers', 'promotions', 'health'
  const targetId = routeSegments[2];

  try {
    // Health / Diagnostics
    if (!scope || scope === 'health') {
      return NextResponse.json({
        status: 'UP',
        engine: 'Medusa 2.0 Headless B2B Engine',
        version: '2.0.4-ktc',
        modules: ['product', 'inventory', 'pricing', 'order', 'customer', 'promotion', 'workflows'],
        timestamp: new Date().toISOString()
      });
    }

    // 1. Inventory Endpoints
    if (domain === 'inventory') {
      if (targetId === 'locations') {
        return NextResponse.json({ locations: MedusaCommerce.inventory.listLocations() });
      }
      if (targetId) {
        return NextResponse.json(MedusaCommerce.inventory.getProductTotalStock(targetId));
      }
      return NextResponse.json({
        locations: MedusaCommerce.inventory.listLocations()
      });
    }

    // 2. Orders Endpoints
    if (domain === 'orders') {
      if (targetId) {
        const order = MedusaCommerce.orders.getOrder(targetId);
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        return NextResponse.json(order);
      }
      return NextResponse.json({
        orders: MedusaCommerce.orders.listOrders()
      });
    }

    // 3. Price Lists Endpoints
    if (domain === 'price-lists') {
      return NextResponse.json({
        price_lists: MedusaCommerce.pricing.listPriceLists()
      });
    }

    // 4. Customers Endpoints
    if (domain === 'customers') {
      if (targetId === 'groups') {
        return NextResponse.json({
          groups: MedusaCommerce.customers.listCustomerGroups()
        });
      }
      return NextResponse.json({
        customers: MedusaCommerce.customers.listCustomers(),
        groups: MedusaCommerce.customers.listCustomerGroups()
      });
    }

    // 5. Promotions Endpoints
    if (domain === 'promotions') {
      return NextResponse.json({
        promotions: MedusaCommerce.promotions.listPromotions()
      });
    }

    return NextResponse.json({ error: `Medusa domain '${domain}' not found` }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  const params = await context.params;
  const routeSegments = params?.route || [];
  const domain = routeSegments[1]; // 'inventory', 'orders', 'pricing', 'workflows'
  const action = routeSegments[2];

  try {
    const body = await req.json().catch(() => ({}));

    // Run Medusa Workflows
    if (domain === 'workflows' && action === 'run') {
      const { workflowName, input } = body;
      const workflow = MedusaCommerce.workflows[workflowName];
      if (!workflow) {
        return NextResponse.json({ error: `Workflow '${workflowName}' not registered.` }, { status: 400 });
      }
      const executionResult = await workflow.run(input || {});
      return NextResponse.json(executionResult);
    }

    // Inventory Adjustment
    if (domain === 'inventory' && action === 'adjust') {
      const { productId, locationId, delta, reason } = body;
      const result = MedusaCommerce.inventory.adjustStock(productId, locationId, delta, reason);
      return NextResponse.json(result);
    }

    // Create Draft Order
    if (domain === 'orders' && (action === 'create-draft' || !action)) {
      const newOrder = MedusaCommerce.orders.createDraftOrder(body);
      return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    }

    // Update Order Status
    if (domain === 'orders' && action === 'status') {
      const { orderId, status, payment_status, fulfillment_status } = body;
      const updated = MedusaCommerce.orders.updateOrderStatus(orderId, { status, payment_status, fulfillment_status });
      return NextResponse.json({ success: true, order: updated });
    }

    // Calculate Price Quote
    if (domain === 'pricing' && (action === 'calculate' || !action)) {
      const quote = MedusaCommerce.pricing.calculateBulkOrderQuote(body);
      return NextResponse.json(quote);
    }

    // Evaluate Promotion
    if (domain === 'promotions' && action === 'evaluate') {
      const evalResult = MedusaCommerce.promotions.evaluatePromotion(body);
      return NextResponse.json(evalResult);
    }

    return NextResponse.json({ error: `Action '${action}' under '${domain}' not supported.` }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
