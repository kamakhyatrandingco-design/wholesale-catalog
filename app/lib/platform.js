'use client';

import { useSyncExternalStore } from 'react';

/**
 * Determines whether the current deployment or visitor is on Vercel (Retail mode)
 * or Netlify (Wholesale B2B portal).
 *
 * Rules:
 * - Vercel is Pure Retail:
 *   - No wholesale lots
 *   - No MOQ requirements (buy 1 piece)
 *   - Retail prices displayed directly
 *   - Shopping bag checkout
 * - Netlify is Wholesale B2B:
 *   - Standard wholesale lots with 25-30 pc MOQs
 *   - Ex-mill rates + optional single piece sample mode
 *   - Commercial Purchase Order drawer
 */
export function isVercelPlatform() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('vercel.app') || host.includes('vercel')) {
      return true;
    }
    // Allow query parameter override for testing in any environment
    const params = new URLSearchParams(window.location.search);
    if (params.get('platform') === 'vercel' || params.get('mode') === 'retail') {
      return true;
    }
    if (params.get('platform') === 'netlify' || params.get('mode') === 'wholesale') {
      return false;
    }
  }

  if (
    process.env.NEXT_PUBLIC_IS_VERCEL === 'true' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.VERCEL === '1' ||
    process.env.NEXT_PUBLIC_STORE_MODE === 'retail'
  ) {
    return true;
  }

  return false;
}

function subscribe(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getSnapshot() {
  return isVercelPlatform();
}

function getServerSnapshot() {
  return Boolean(
    process.env.NEXT_PUBLIC_IS_VERCEL === 'true' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.VERCEL === '1' ||
    process.env.NEXT_PUBLIC_STORE_MODE === 'retail'
  );
}

export function useIsVercel() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
