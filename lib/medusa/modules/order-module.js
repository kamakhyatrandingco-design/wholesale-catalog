/**
 * Medusa Order Module
 * Handles Draft Orders, Wholesale Purchase Orders (POs), Status Lifecycles, and Invoice Projections.
 */

import { OrderStatus, PaymentStatus, FulfillmentStatus } from '../types.js';
import { pricingModule } from './pricing-module.js';

class OrderModule {
  constructor() {
    this.orders = new Map();
    this.initSampleOrders();
  }

  initSampleOrders() {
    const sampleOrders = [
      {
        id: 'ktc_po_1082',
        display_id: 'PO-1082',
        customer_name: 'Vogue Boutique Jaipur',
        customer_phone: '+91 98290 12345',
        customer_city: 'Jaipur, Rajasthan',
        customer_gstin: '08ABCDE1234F1Z5',
        tier: 'Boutique Gold Network',
        status: OrderStatus.PROCESSING,
        payment_status: PaymentStatus.AUTHORIZED,
        fulfillment_status: FulfillmentStatus.PARTIALLY_FULFILLED,
        items: [
          { id: 'anarkali-suit-set', title: 'Chanderi Silk Anarkali Set', quantity: 45, unit_price: 1195, subtotal: 53775 },
          { id: 'pure-cotton-kurti', title: 'Jaipuri Printed Cotton Kurti', quantity: 60, unit_price: 367, subtotal: 22020 }
        ],
        total_pieces: 105,
        subtotal: 75795,
        gst_total: 4890,
        grand_total: 80685,
        notes: 'Priority dispatch for festive pre-season.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'ktc_po_1083',
        display_id: 'PO-1083',
        customer_name: 'Surat Textiles Wholesale Hub',
        customer_phone: '+91 98795 67890',
        customer_city: 'Surat, Gujarat',
        customer_gstin: '24AABCS9876G1Z2',
        tier: 'Diamond Mega-Distributor',
        status: OrderStatus.PENDING_PAYMENT,
        payment_status: PaymentStatus.PENDING,
        fulfillment_status: FulfillmentStatus.NOT_FULFILLED,
        items: [
          { id: 'embroidered-velvet-lehenga', title: 'Heavy Velvet Bridal Lehenga', quantity: 30, unit_price: 2464, subtotal: 73920 },
          { id: 'rayon-daily-wear-kurti', title: 'Daily Wear Rayon Kurti Lot', quantity: 150, unit_price: 254, subtotal: 38100 }
        ],
        total_pieces: 180,
        subtotal: 112020,
        gst_total: 10740,
        grand_total: 122760,
        notes: 'Delivery via V-Trans transport ledger.',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'ktc_po_1084',
        display_id: 'PO-1084',
        customer_name: 'Guwahati Ethnic Emporium',
        customer_phone: '+91 94350 44556',
        customer_city: 'Guwahati, Assam',
        customer_gstin: '18AAEFG5566H1Z9',
        tier: 'Standard Wholesale Tier',
        status: OrderStatus.FULFILLED,
        payment_status: PaymentStatus.PAID,
        fulfillment_status: FulfillmentStatus.SHIPPED,
        items: [
          { id: 'festive-sharara-set', title: 'Organza Festive Sharara Set', quantity: 35, unit_price: 799, subtotal: 27965 }
        ],
        total_pieces: 35,
        subtotal: 27965,
        gst_total: 1398,
        grand_total: 29363,
        notes: 'Dispatched through Blue Dart Surface Air.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];

    sampleOrders.forEach(order => this.orders.set(order.id, order));
  }

  listOrders() {
    return Array.from(this.orders.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getOrder(id) {
    return this.orders.get(id);
  }

  /**
   * Create a new draft wholesale purchase order
   */
  createDraftOrder({
    customerName = 'Walk-in Boutique Client',
    customerPhone = '+91 99999 00000',
    customerCity = 'New Delhi',
    customerGstin = '',
    priceListId = 'pl_standard',
    items = [],
    notes = ''
  }) {
    const calc = pricingModule.calculateBulkOrderQuote({ items, priceListId });
    const orderNum = 1085 + this.orders.size;
    const orderId = `ktc_po_${orderNum}`;

    const newOrder = {
      id: orderId,
      display_id: `PO-${orderNum}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_city: customerCity,
      customer_gstin: customerGstin || 'URP (Unregistered Dealer)',
      tier: priceListId,
      status: OrderStatus.DRAFT,
      payment_status: PaymentStatus.PENDING,
      fulfillment_status: FulfillmentStatus.NOT_FULFILLED,
      items: calc.items.map(it => ({
        id: it.id,
        title: it.title,
        quantity: it.quantity,
        unit_price: it.effectiveUnitPrice,
        subtotal: it.subtotal
      })),
      total_pieces: calc.totalPieces,
      subtotal: calc.subtotal,
      gst_total: calc.totalGst,
      grand_total: calc.grandTotal,
      free_freight: calc.freeFreight,
      notes,
      created_at: new Date().toISOString()
    };

    this.orders.set(orderId, newOrder);
    return newOrder;
  }

  /**
   * Update order lifecycle status
   */
  updateOrderStatus(orderId, { status, payment_status, fulfillment_status }) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    if (fulfillment_status) order.fulfillment_status = fulfillment_status;
    order.updated_at = new Date().toISOString();

    return order;
  }
}

export const orderModule = new OrderModule();
