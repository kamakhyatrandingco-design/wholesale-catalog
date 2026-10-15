/**
 * Medusa Promotion Module
 * B2B promotional codes, volume campaigns, and condition matching.
 */

class PromotionModule {
  constructor() {
    this.promotions = new Map([
      [
        'FESTIVE10',
        {
          code: 'FESTIVE10',
          type: 'percentage',
          value: 10,
          description: '10% Festive Season Incentive on lots > ₹50,000',
          min_subtotal: 50000,
          active: true,
          expiry: '2026-12-31'
        }
      ],
      [
        'FREESHIP',
        {
          code: 'FREESHIP',
          type: 'free_freight',
          value: 0,
          description: 'Free Surface Freight Delivery across India on > 100 pcs',
          min_pieces: 100,
          active: true,
          expiry: '2026-12-31'
        }
      ],
      [
        'VOLUME5',
        {
          code: 'VOLUME5',
          type: 'percentage',
          value: 5,
          description: '5% Extra Cash Discount on Pre-Paid RTGS Orders',
          min_subtotal: 30000,
          active: true,
          expiry: '2026-12-31'
        }
      ]
    ]);
  }

  listPromotions() {
    return Array.from(this.promotions.values());
  }

  getPromotion(code) {
    if (!code) return null;
    return this.promotions.get(code.toUpperCase().trim()) || null;
  }

  evaluatePromotion({ code, subtotal = 0, totalPieces = 0 }) {
    const promo = this.getPromotion(code);
    if (!promo || !promo.active) {
      return { valid: false, error: 'Invalid or inactive promotional code.' };
    }

    if (promo.min_subtotal && subtotal < promo.min_subtotal) {
      return {
        valid: false,
        error: `Minimum subtotal for ${promo.code} is ₹${promo.min_subtotal.toLocaleString('en-IN')}`
      };
    }

    if (promo.min_pieces && totalPieces < promo.min_pieces) {
      return {
        valid: false,
        error: `Minimum lot size for ${promo.code} is ${promo.min_pieces} pieces`
      };
    }

    let discountAmount = 0;
    if (promo.type === 'percentage') {
      discountAmount = Math.round((subtotal * promo.value) / 100);
    }

    return {
      valid: true,
      promo,
      discountAmount,
      freeFreight: promo.type === 'free_freight'
    };
  }
}

export const promotionModule = new PromotionModule();
