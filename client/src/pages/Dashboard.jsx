import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsOverview, getTransactions } from '../services/api';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import ErrorState from '../components/ErrorState';
import { SkeletonCard, SkeletonTable } from '../components/LoadingState';
import { formatCurrency, formatPercent } from '../utils/formatters';
import './Dashboard.css';

function BarMetric({ label, value, max, colorClass }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="bar-metric">
      <div className="bar-metric-row">
        <span className="bar-metric-label">{label}</span>
        <span className="bar-metric-value">{value}</span>
      </div>
      <div className="bar-track" role="meter" aria-label={`${label}: ${value} of ${max}`} aria-valuenow={value} aria-valuemax={max}>
        <div className={`bar-fill ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [analyticsData, txnData] = await Promise.all([
          getAnalyticsOverview(),
          getTransactions(),
        ]);
        if (!cancelled) {
          setAnalytics(analyticsData);
          setTransactions(txnData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    retryRef.current = fetchAll;
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState title="Unable to load dashboard" message={error} onRetry={() => retryRef.current?.()} />;
  }

  const { overview = {}, decisions = {}, recovery = {} } = analytics || {};

  const aiTotal = (decisions.aiRecoverable || 0) +
                  (decisions.aiUncertain || 0) +
                  (decisions.aiNotRecoverable || 0);
  const policyTotal = (decisions.policyApproved || 0) +
                      (decisions.policyReview || 0) +
                      (decisions.policyBlocked || 0);

  return (
    <div className="dashboard">
      <section className="dash-section">
        <div className="kpi-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard label="Failed Payments"   value={overview.failedPayments ?? '—'}          sub="Currently unresolved"           icon="✕" />
              <StatCard label="Revenue at Risk"    value={formatCurrency(overview.revenueAtRisk)}   sub="From failed transactions"       icon="₹" />
              <StatCard label="Recovery Rate"      value={formatPercent(recovery.recoveryRate)}     sub={`${recovery.successfulRecoveries ?? 0} of ${recovery.retriesExecuted ?? 0} retries succeeded`} icon="↑" />
              <StatCard label="Revenue Recovered"  value={formatCurrency(recovery.revenueRecovered)} sub={`${recovery.failedRecoveries ?? 0} failed recoveries`} icon="✓" accent />
            </>
          )}
        </div>
      </section>

      <section className="dash-section">
        <h2 className="section-title">Decision Intelligence</h2>
        <div className="decision-grid">
          <div className="card">
            <div className="decision-card-header">
              <span className="decision-card-title">AI Analysis</span>
              <span className="badge badge-accent">{loading ? '—' : `${decisions.aiAnalyzed ?? 0} analyzed`}</span>
            </div>
            {loading ? (
              <div style={{ paddingTop: 8 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 12, background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 12 }} />)}
              </div>
            ) : (
              <div className="bar-metrics">
                <BarMetric label="Recoverable"    value={decisions.aiRecoverable    ?? 0} max={aiTotal || 1} colorClass="bar-success" />
                <BarMetric label="Uncertain"       value={decisions.aiUncertain      ?? 0} max={aiTotal || 1} colorClass="bar-warning" />
                <BarMetric label="Not Recoverable" value={decisions.aiNotRecoverable ?? 0} max={aiTotal || 1} colorClass="bar-danger"  />
              </div>
            )}
          </div>

          <div className="card">
            <div className="decision-card-header">
              <span className="decision-card-title">Policy Outcomes</span>
              <span className="badge badge-neutral">{loading ? '—' : `${policyTotal} decisions`}</span>
            </div>
            {loading ? (
              <div style={{ paddingTop: 8 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 12, background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 12 }} />)}
              </div>
            ) : (
              <div className="bar-metrics">
                <BarMetric label="Approved" value={decisions.policyApproved ?? 0} max={policyTotal || 1} colorClass="bar-success" />
                <BarMetric label="Review"   value={decisions.policyReview   ?? 0} max={policyTotal || 1} colorClass="bar-warning" />
                <BarMetric label="Blocked"  value={decisions.policyBlocked  ?? 0} max={policyTotal || 1} colorClass="bar-danger"  />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transactions')}>View all →</button>
        </div>
        {loading ? <SkeletonTable rows={5} cols={7} /> : <TransactionTable transactions={transactions.slice(0, 8)} />}
      </section>
    </div>
  );
}
