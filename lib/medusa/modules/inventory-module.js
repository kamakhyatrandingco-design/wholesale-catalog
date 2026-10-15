/**
 * Medusa Inventory Module
 * Multi-warehouse inventory tracking, reservations, and Available-to-Promise (ATP) calculations.
 */

import { DefaultLocations, StockStatus } from '../types.js';

class InventoryModule {
  constructor() {
    this.locations = new Map(DefaultLocations.map(loc => [loc.id, { ...loc }]));
    // Item stock map: key = `${itemId}:${locationId}`, value = { onHand, reserved }
    this.itemStock = new Map();
    this.initialized = false;
  }

  /**
   * Initialize default warehouse stock distribution for a product
   */
  initProductStock(productId, baseStock = 120) {
    // Distribute stock across locations: 60% Surat, 25% Jaipur, 15% Guwahati
    const suratStock = Math.round(baseStock * 0.60);
    const jaipurStock = Math.round(baseStock * 0.25);
    const guwahatiStock = Math.max(0, baseStock - suratStock - jaipurStock);

    this.setStock(productId, 'loc_surat_central', suratStock, 0);
    this.setStock(productId, 'loc_jaipur_studio', jaipurStock, 0);
    this.setStock(productId, 'loc_guwahati_hub', guwahatiStock, 0);
  }

  setStock(productId, locationId, onHand, reserved = 0) {
    const key = `${productId}:${locationId}`;
    this.itemStock.set(key, {
      productId,
      locationId,
      onHand: Math.max(0, Number(onHand)),
      reserved: Math.max(0, Number(reserved))
    });
  }

  getStock(productId, locationId) {
    const key = `${productId}:${locationId}`;
    return this.itemStock.get(key) || {
      productId,
      locationId,
      onHand: 0,
      reserved: 0
    };
  }

  /**
   * Get total stock across all warehouse locations for a product
   */
  getProductTotalStock(productId) {
    let totalOnHand = 0;
    let totalReserved = 0;
    const locationBreakdown = [];

    for (const [locId, location] of this.locations.entries()) {
      const stock = this.getStock(productId, locId);
      const available = Math.max(0, stock.onHand - stock.reserved);
      totalOnHand += stock.onHand;
      totalReserved += stock.reserved;

      locationBreakdown.push({
        locationId: locId,
        locationName: location.name,
        state: location.state,
        onHand: stock.onHand,
        reserved: stock.reserved,
        available
      });
    }

    const availableToPromise = Math.max(0, totalOnHand - totalReserved);
    let status = StockStatus.IN_STOCK;
    if (availableToPromise === 0) {
      status = StockStatus.OUT_OF_STOCK;
    } else if (availableToPromise < 30) {
      status = StockStatus.LOW_STOCK;
    }

    return {
      productId,
      totalOnHand,
      totalReserved,
      availableToPromise,
      status,
      locations: locationBreakdown
    };
  }

  /**
   * Adjust inventory at a specific location
   */
  adjustStock(productId, locationId, delta, reason = 'manual_adjustment') {
    const current = this.getStock(productId, locationId);
    const updatedOnHand = Math.max(0, current.onHand + Number(delta));
    this.setStock(productId, locationId, updatedOnHand, current.reserved);

    return {
      success: true,
      productId,
      locationId,
      previousOnHand: current.onHand,
      currentOnHand: updatedOnHand,
      delta: Number(delta),
      reason,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reserve stock for a wholesale draft order
   */
  reserveStock(productId, locationId, quantity) {
    const current = this.getStock(productId, locationId);
    const available = current.onHand - current.reserved;
    if (available < quantity) {
      return {
        success: false,
        error: `Insufficient stock at ${locationId}. Requested: ${quantity}, Available: ${available}`
      };
    }

    const updatedReserved = current.reserved + quantity;
    this.setStock(productId, locationId, current.onHand, updatedReserved);

    return {
      success: true,
      productId,
      locationId,
      reservedQuantity: quantity,
      remainingAvailable: current.onHand - updatedReserved
    };
  }

  /**
   * Release stock reservation
   */
  releaseReservation(productId, locationId, quantity) {
    const current = this.getStock(productId, locationId);
    const updatedReserved = Math.max(0, current.reserved - quantity);
    this.setStock(productId, locationId, current.onHand, updatedReserved);
    return { success: true };
  }

  listLocations() {
    return Array.from(this.locations.values());
  }
}

export const inventoryModule = new InventoryModule();
