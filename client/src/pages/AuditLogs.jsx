import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuditLogs, getAuditLogsBySeverity } from '../services/api';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/LoadingState';
import { formatDate, formatAmount } from '../utils/formatters';
import { getPolicyClass, getSeverityClass } from '../utils/status';
import './AuditLogs.css';

const SEVERITIES = ['ALL', 'LOW', 'MEDIUM', 'HIGH'];

export default function AuditLogs() {
  const navigate = useNavigate();
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [severity, setSeverity] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const retryRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const handleCopyAuditId = (e, auditIdText) => {
    e.stopPropagation();
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(auditIdText).then(() => {
      setCopiedId(auditIdText);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => { /* clipboard unavailable — ignore */ });
  };

  useEffect(() => () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const data = severity === 'ALL'
          ? await getAuditLogs()
          : await getAuditLogsBySeverity(severity);
        if (!cancelled) setLogs(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load audit logs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    retryRef.current = fetchAll;
    fetchAll();
    return () => { cancelled = true; };
  }, [severity]);

  if (error) return <ErrorState title="Unable to load audit logs" message={error} onRetry={() => retryRef.current?.()} />;

  return (
    <div className="audit-page">
      <div className="audit-filters card">
        <div className="audit-filter-label">Severity</div>
        <div className="severity-tabs" role="group" aria-label="Filter by severity">
          {SEVERITIES.map(sev => (
            <button
              key={sev}
              className={`severity-tab ${severity === sev ? 'active' : ''}`}
              onClick={() => setSeverity(sev)}
              aria-pressed={severity === sev}
            >
              {sev}
            </button>
          ))}
        </div>
        {!loading && <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{logs.length} records</span>}
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={8} />
      ) : logs.length === 0 ? (
        <EmptyState icon="⊙" title="No audit logs found" message={severity !== 'ALL' ? `No ${severity} severity audit logs found.` : 'No audit records in the system yet.'} />
      ) : (
        <div className="table-wrap audit-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Transaction</th>
                <th>Severity</th>
                <th>Baseline</th>
                <th>AI Decision</th>
                <th>Score Δ</th>
                <th>Policy</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const auditIdText = `AUDIT_${log.id}`;
                return (
                <tr key={log.id} className="clickable" onClick={() => navigate(`/transactions/${log.transaction_id}`)}>
                  <td>
                    <button
                      type="button"
                      className="audit-id-copy"
                      onClick={e => handleCopyAuditId(e, auditIdText)}
                      aria-label={`Copy audit ID ${auditIdText}`}
                    >
                      <span className="mono text-muted">{auditIdText}</span>
                      <span className={`audit-id-copy-label${copiedId === auditIdText ? ' audit-id-copy-label--copied' : ''}`}>
                        {copiedId === auditIdText ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </td>
                  <td><span className="mono text-accent">{log.transaction_id}</span></td>
                  <td><span className={`badge ${getSeverityClass(log.severity)}`}>{log.severity || '—'}</span></td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>{log.baseline_classification || '—'}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Score: {formatAmount(log.baseline_score)} · {log.baseline_action}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>{log.ai_classification || '—'}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Score: {formatAmount(log.ai_score)} · {log.ai_action}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{formatAmount(log.score_difference)}</td>
                  <td>
                    <span className={`badge ${getPolicyClass(log.policy_decision)}`}>{log.policy_decision || '—'}</span>
                    <div className="text-muted" style={{ fontSize: '0.72rem', marginTop: 3 }}>{log.policy_action}</div>
                  </td>
                  <td className="text-muted" style={{ fontSize: '0.78rem' }}>{formatDate(log.created_at)}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
