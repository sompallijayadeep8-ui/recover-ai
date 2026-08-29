/**
 * Returns a badge CSS class for a transaction/attempt status.
 * SUCCESS → green, FAILED → red, BLOCKED → red, fallback → neutral
 */
export function getStatusClass(status) {
  switch ((status || '').toUpperCase()) {
    case 'SUCCESS': return 'badge-success';
    case 'FAILED':  return 'badge-danger';
    case 'BLOCKED': return 'badge-danger';
    default:        return 'badge-neutral';
  }
}

/**
 * Returns a badge CSS class for a policy decision.
 * APPROVE → green, REVIEW → warning, BLOCK → red
 */
export function getPolicyClass(decision) {
  switch ((decision || '').toUpperCase()) {
    case 'APPROVE': return 'badge-success';
    case 'REVIEW':  return 'badge-warning';
    case 'BLOCK':   return 'badge-danger';
    default:        return 'badge-neutral';
  }
}

/**
 * Returns a badge CSS class for an AI classification.
 * RECOVERABLE → green, NOT_RECOVERABLE → red, UNCERTAIN → warning
 */
export function getClassificationClass(classification) {
  switch ((classification || '').toUpperCase()) {
    case 'RECOVERABLE':     return 'badge-success';
    case 'NOT_RECOVERABLE': return 'badge-danger';
    case 'UNCERTAIN':       return 'badge-warning';
    default:                return 'badge-neutral';
  }
}

/**
 * Returns a badge CSS class for a severity level.
 * HIGH → red, MEDIUM → warning, LOW → info
 */
export function getSeverityClass(severity) {
  switch ((severity || '').toUpperCase()) {
    case 'HIGH':   return 'badge-danger';
    case 'MEDIUM': return 'badge-warning';
    case 'LOW':    return 'badge-info';
    default:       return 'badge-neutral';
  }
}
