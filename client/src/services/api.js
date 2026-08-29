const BASE = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error || body.reason || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

export const getHealth              = ()       => request('/health');
export const getAnalyticsOverview   = ()       => request('/analytics/overview');
export const getTransactions        = ()       => request('/transactions');
export const getTransactionById     = (id)     => request(`/transactions/${id}`);
export const analyzeRecovery        = (id)     => request(`/recovery/${id}/analyze`, { method: 'POST' });
export const retryTransaction       = (id)     => request(`/transactions/${id}/retry`, { method: 'POST' });
export const getAllRecoveryAttempts  = ()       => request('/recovery-attempts');
export const getRecoveryAttemptsByTransaction = (id) => request(`/recovery-attempts/${id}`);
export const getAuditLogs           = ()       => request('/audit');
export const getAuditLogsBySeverity = (sev)    => request(`/audit/severity/${sev}`);
export const getAuditByTransaction  = (id)     => request(`/audit/${id}`);
