/**
 * Safely convert a PostgreSQL numeric string or number to a JS number.
 * Never throws — returns 0 on invalid input.
 */
export function formatAmount(raw) {
  const n = Number(raw);
  return isNaN(n) ? 0 : n;
}

/**
 * Format as INR currency: ₹4,999
 */
export function formatCurrency(amount, currency = 'INR') {
  const n = formatAmount(amount);
  if (currency === 'INR') {
    return '\u20B9' + n.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return n.toLocaleString('en-IN') + ' ' + currency;
}

/**
 * Format as a percentage string: "100%" or "81.5%"
 */
export function formatPercent(value) {
  const n = formatAmount(value);
  return n.toFixed(n % 1 === 0 ? 0 : 1) + '%';
}

/**
 * Format an ISO date string as a human-readable local date+time.
 */
export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}
