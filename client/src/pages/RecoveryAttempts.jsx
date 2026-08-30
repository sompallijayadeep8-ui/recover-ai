import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecoveryAttempts } from '../services/api';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { SkeletonTable } from '../components/LoadingState';
import { formatCurrency, formatDate } from '../utils/formatters';
import './RecoveryAttempts.css';

export default function RecoveryAttempts() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllRecoveryAttempts();
        if (!cancelled) setAttempts(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load recovery attempts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    retryRef.current = fetchAll;
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  if (error) return <ErrorState title="Unable to load recovery attempts" message={error} onRetry={() => retryRef.current?.()} />;
  if (loading) return <SkeletonTable rows={8} cols={6} />;
  if (attempts.length === 0) return (
    <EmptyState icon="↺" title="No recovery attempts found" message="Recovery attempts will appear here after transactions are retried." />
  );

  return (
    <div className="recovery-page">
      <div className="table-wrap recovery-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Attempt #</th>
              <th>Action</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map(a => (
              <tr key={a.id} className="clickable" onClick={() => navigate(`/transactions/${a.transaction_id}`)}>
                <td><span className="mono text-accent">{a.transaction_id}</span></td>
                <td className="mono text-secondary">#{a.attempt_number}</td>
                <td><span className="badge badge-accent">{a.action}</span></td>
                <td><StatusBadge status={a.status} /></td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(a.amount)}</td>
                <td className="text-muted">{formatDate(a.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
