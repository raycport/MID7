import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency based on user locale.
 * Base price is assumed to be in Philippine Pesos (₱).
 */
export function formatCurrency(priceInPHP: number): string {
  // Simple heuristic for demo: If timezone is in US, convert to USD.
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isUS = timeZone.includes('America') || navigator.language.includes('en-US');
  
  if (isUS) {
    const usdPrice = priceInPHP * 0.018; // Approximate conversion
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usdPrice);
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(priceInPHP);
}
