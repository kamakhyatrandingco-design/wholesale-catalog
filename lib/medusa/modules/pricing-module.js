/**
 * Medusa Pricing Module
 * B2B wholesale price lists, volume tier discounts, and Apparel GST calculation engine.
 */

import { DefaultPriceLists } from '../types.js';

class PricingModule {
  constructor() {
    this.priceLists = new Map(DefaultPriceLists.map(pl => [pl.id, { ...pl }]));
  }

  listPriceLists() {
    return Array.from(this.priceLists.values());
  }

  getPriceList(id) {
    return this.priceLists.get(id) || this.priceLists.get('pl_standard');
  }

  /**
   * Calculate wholesale item price and taxes for a given buyer tier & lot quantity
   */
  calculateItemPrice({
    baseWholesalePrice,
    quantity = 30,
    priceListId = 'pl_standard',
    category = 'Ethnic Wear'
  }) {
    const priceList = this.getPriceList(priceListId);
    const basePrice = Number(baseWholesalePrice) || 0;

    // 1. Tier percentage discount
    const tierDiscountPct = priceList.discount_pct || 0;
    let unitPrice = basePrice * (1 - (tierDiscountPct / 100));

    // 2. Volume scale discount
    let volumeDiscountPct = 0;
    if (quantity >= 200) {
      volumeDiscountPct = 7;
    } else if (quantity >= 100) {
      volumeDiscountPct = 4;
    } else if (quantity >= 50) {
      volumeDiscountPct = 2;
    }

    unitPrice = Math.round(unitPrice * (1 - (volumeDiscountPct / 100)));

    // 3. Indian Apparel GST Slab calculation
    // Standard rule: <= ₹1000 = 5% GST, > ₹1000 = 12% GST
    const gstRate = unitPrice <= 1000 ? 5 : 12;
    const gstPerUnit = Math.round((unitPrice * gstRate) / 100);
    const effectiveUnitPriceWithTax = unitPrice + gstPerUnit;

    const subtotal = unitPrice * quantity;
    const totalGst = gstPerUnit * quantity;
    const grandTotal = subtotal + totalGst;

    return {
      baseWholesalePrice: basePrice,
      effectiveUnitPrice: unitPrice,
      gstRate,
      gstPerUnit,
      effectiveUnitPriceWithTax,
      quantity,
      subtotal,
      totalGst,
      grandTotal,
      tierApplied: priceList.name,
      discounts: {
        tierDiscountPct,
        volumeDiscountPct,
        totalSavings: Math.round(((basePrice - unitPrice) * quantity))
      },
      category
    };
  }

  /**
   * Bulk order quotation calculation across multiple line items
   */
  calculateBulkOrderQuote({ items = [], priceListId = 'pl_standard', promoDiscountPct = 0 }) {
    let subtotal = 0;
    let totalGst = 0;
    let totalPieces = 0;
    const itemBreakdown = [];

    for (const item of items) {
      const lineCalc = this.calculateItemPrice({
        baseWholesalePrice: item.wholesale_price || item.price,
        quantity: item.quantity,
        priceListId,
        category: item.category
      });

      subtotal += lineCalc.subtotal;
      totalGst += lineCalc.totalGst;
      totalPieces += item.quantity;

      itemBreakdown.push({
        id: item.id,
        title: item.title,
        ...lineCalc
      });
    }

    const promoDiscountAmount = Math.round((subtotal * (promoDiscountPct / 100)));
    const taxableSubtotal = Math.max(0, subtotal - promoDiscountAmount);
    const finalGrandTotal = taxableSubtotal + totalGst;

    return {
      itemCount: items.length,
      totalPieces,
      subtotal,
      promoDiscountPct,
      promoDiscountAmount,
      taxableSubtotal,
      totalGst,
      grandTotal: finalGrandTotal,
      freeFreight: totalPieces >= 100 || priceListId === 'pl_diamond',
      items: itemBreakdown
    };
  }
}

export const pricingModule = new PricingModule();
