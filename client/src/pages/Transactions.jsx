import { useEffect, useState, useRef, useMemo } from 'react';
import { getTransactions } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import ErrorState from '../components/ErrorState';
import { SkeletonTable } from '../components/LoadingState';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [reasonFilter, setReason] = useState('');
  const retryRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactions();
        if (!cancelled) setTransactions(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load transactions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    retryRef.current = fetchAll;
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const statuses = useMemo(() => {
    const s = new Set(transactions.map(t => t.status).filter(Boolean));
    return [...s].sort();
  }, [transactions]);

  const reasons = useMemo(() => {
    const s = new Set(transactions.map(t => t.failureReason).filter(Boolean));
    return [...s].sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchReason = !reasonFilter || t.failureReason === reasonFilter;
      return matchSearch && matchStatus && matchReason;
    });
  }, [transactions, search, statusFilter, reasonFilter]);

  const hasFilters = search || statusFilter || reasonFilter;
  const clearFilters = () => { setSearch(''); setStatus(''); setReason(''); };

  if (error) {
    return <ErrorState title="Unable to load transactions" message={error} onRetry={() => retryRef.current?.()} />;
  }

  return (
    <div className="transactions-page">
      <div className="filters-bar card">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="txn-search" className="filter-label">Search</label>
            <input id="txn-search" type="search" className="filter-input" placeholder="Transaction ID..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search by transaction ID" />
          </div>
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">Status</label>
            <select id="status-filter" className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="">All statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="reason-filter" className="filter-label">Failure Reason</label>
            <select id="reason-filter" className="filter-select" value={reasonFilter} onChange={e => setReason(e.target.value)} aria-label="Filter by failure reason">
              <option value="">All reasons</option>
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button className="btn btn-ghost btn-sm clear-filters-btn" onClick={clearFilters}>✕ Clear filters</button>
          )}
        </div>
        <div className="filter-meta">
          {!loading && <span className="text-muted" style={{ fontSize: '0.8rem' }}>{filtered.length} of {transactions.length} transactions</span>}
        </div>
      </div>
      {loading ? <SkeletonTable rows={8} cols={7} /> : <TransactionTable transactions={filtered} />}
    </div>
  );
}
