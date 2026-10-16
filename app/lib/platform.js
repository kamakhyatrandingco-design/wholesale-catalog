'use client';

import { useSyncExternalStore } from 'react';

/**
 * Determines whether the current deployment or visitor is on:
 * - Netlify (ktcfashion.netlify.app) => RETAIL ONLY (Single pieces, no MOQs, doorstep delivery)
 * - Vercel (wholesale-catalog-ktc8.vercel.app) => WHOLESALE ONLY (B2B lots, ex-mill wholesale rates, bulk POs)
 *
 * Query Parameter Overrides (for instant testing on all devices & links):
 * - ?mode=retail or ?platform=netlify => RETAIL
 * - ?mode=wholesale or ?platform=vercel => WHOLESALE
 */
export function getStoreMode() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    // 1. Explicit query parameter override (works on all devices & links)
    const modeParam = params.get('mode');
    if (modeParam === 'retail') return 'retail';
    if (modeParam === 'wholesale') return 'wholesale';

    const platformParam = params.get('platform');
    if (platformParam === 'netlify') return 'retail';
    if (platformParam === 'vercel') return 'wholesale';

    // 2. Netlify URL detection => RETAIL ONLY
    if (host.includes('netlify.app') || host.includes('ktcfashion') || host.includes('retail')) {
      return 'retail';
    }

    // 3. Vercel URL detection => WHOLESALE ONLY
    if (host.includes('vercel.app') || host.includes('wholesale')) {
      return 'wholesale';
    }
  }

  // Build-time / SSR defaults
  if (process.env.NEXT_PUBLIC_STORE_MODE === 'retail' || process.env.NETLIFY === 'true') {
    return 'retail';
  }
  if (process.env.NEXT_PUBLIC_STORE_MODE === 'wholesale' || process.env.VERCEL === '1') {
    return 'wholesale';
  }

  // Default to wholesale for root localhost unless specified
  return 'wholesale';
}

function subscribe(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getSnapshot() {
  return getStoreMode();
}

function getServerSnapshot() {
  if (process.env.NEXT_PUBLIC_STORE_MODE === 'retail' || process.env.NETLIFY === 'true') {
    return 'retail';
  }
  return 'wholesale';
}

export function useStoreMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Convenience helpers
export function useIsRetail() {
  const mode = useStoreMode();
  return mode === 'retail';
}

export function useIsWholesale() {
  const mode = useStoreMode();
  return mode === 'wholesale';
}

// Deprecated alias for backwards compatibility
export function useIsVercel() {
  // Backwards compat: if old code called useIsVercel expecting retail,
  // we now return useIsRetail() so existing prop passes work cleanly as retail mode
  return useIsRetail();
}
