import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/formatters';

export default function TransactionRow({ txn }) {
  const navigate = useNavigate();
  return (
    <tr className="clickable" onClick={() => navigate(`/transactions/${txn.id}`)}>
      <td><span className="mono text-accent">{txn.id}</span></td>
      <td><span className="mono text-secondary">{txn.customerId}</span></td>
      <td style={{ fontWeight: 600 }}>{formatCurrency(txn.amount, txn.currency)}</td>
      <td><StatusBadge status={txn.status} /></td>
      <td><span className="text-secondary">{txn.failureReason || '—'}</span></td>
      <td style={{ textAlign: 'center' }}>{txn.retryCount ?? '—'}</td>
      <td>
        <button
          className="btn btn-ghost btn-sm"
          onClick={e => { e.stopPropagation(); navigate(`/transactions/${txn.id}`); }}
          aria-label={`View transaction ${txn.id}`}
        >
          View →
        </button>
      </td>
    </tr>
  );
}
