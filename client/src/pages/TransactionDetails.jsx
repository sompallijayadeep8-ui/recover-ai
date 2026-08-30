import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTransactionById,
  analyzeRecovery,
  retryTransaction,
  getRecoveryAttemptsByTransaction,
  getAuditByTransaction,
} from '../services/api';
import StatusBadge from '../components/StatusBadge';
import DecisionBadge from '../components/DecisionBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { SkeletonCard, SkeletonTable } from '../components/LoadingState';
import { formatCurrency, formatDate, formatAmount } from '../utils/formatters';
import { getPolicyClass, getSeverityClass } from '../utils/status';
import './TransactionDetails.css';

function RetryModal({ onConfirm, onCancel, busy }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="retry-modal-title">
      <div className="modal-box">
        <h3 id="retry-modal-title">Retry this payment?</h3>
        <p>
          RecoverAI will execute the retry according to the latest approved policy decision.
          This action will attempt to process the payment again.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={busy}>
            {busy ? 'Retrying…' : 'Confirm Retry'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PipelineStep({ label, badge, sub, last }) {
  return (
    <div className="pipeline-step">
      <div className="pipeline-node">
        <div className="pipeline-step-label">{label}</div>
        <div className="pipeline-step-content">
          {badge}
          {sub && <span className="pipeline-step-sub">{sub}</span>}
        </div>
      </div>
      {!last && <div className="pipeline-arrow" aria-hidden="true">↓</div>}
    </div>
  );
}

function RecoveryScore({ score }) {
  const n = formatAmount(score);
  const colorClass = n >= 70 ? 'score-high' : n >= 40 ? 'score-mid' : 'score-low';
  return (
    <div className={`score-ring ${colorClass}`} aria-label={`Recovery score: ${n} out of 100`}>
      <span className="score-value">{n}</span>
      <span className="score-max">/100</span>
    </div>
  );
}

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [txn, setTxn]           = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [audits, setAudits]     = useState([]);

  const [loadingTxn, setLoadingTxn] = useState(true);
  const [loadingAux, setLoadingAux] = useState(true);
  const [analyzing, setAnalyzing]   = useState(false);
  const [retrying, setRetrying]     = useState(false);
  const [showModal, setShowModal]   = useState(false);

  const [txnError, setTxnError]         = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [retryError, setRetryError]     = useState(null);
  const [retrySuccess, setRetrySuccess] = useState(null);

  const txnRetryRef = useRef(null);

  // Load main transaction
  useEffect(() => {
    let cancelled = false;
    async function fetchTxn() {
      setLoadingTxn(true);
      setTxnError(null);
      try {
        const data = await getTransactionById(id);
        if (!cancelled) setTxn(data);
      } catch (err) {
        if (!cancelled) setTxnError(err.message || 'Failed to load transaction');
      } finally {
        if (!cancelled) setLoadingTxn(false);
      }
    }
    txnRetryRef.current = fetchTxn;
    fetchTxn();
    return () => { cancelled = true; };
  }, [id]);

  // Load auxiliary data (attempts + audit)
  useEffect(() => {
    let cancelled = false;
    async function fetchAux() {
      setLoadingAux(true);
      try {
        const [att, aud] = await Promise.all([
          getRecoveryAttemptsByTransaction(id),
          getAuditByTransaction(id),
        ]);
        if (cancelled) return;
        setAttempts(att || []);
        setAudits(aud || []);
        if (aud && aud.length > 0) {
          const latest = aud[0];
          setAnalysis({
            baseline: {
              classification: latest.baseline_classification,
              recoveryScore:  latest.baseline_score,
              recommendedAction: latest.baseline_action,
            },
            aiDecision: {
              classification: latest.ai_classification,
              recoveryScore:  latest.ai_score,
              recommendedAction: latest.ai_action,
            },
            comparison: {
              classificationAgreement: latest.classification_agreement,
              scoreDifference: latest.score_difference,
              severity: latest.severity,
            },
            policy: {
              decision: latest.policy_decision,
              action: latest.policy_action,
              reason: latest.policy_reason,
            },
            auditId: `AUDIT_${latest.id}`,
          });
        }
      } catch { /* aux is secondary */ }
      finally { if (!cancelled) setLoadingAux(false); }
    }
    fetchAux();
    return () => { cancelled = true; };
  }, [id]);

  const reloadAll = () => {
    let cancelled = false;
    setLoadingTxn(true);
    setLoadingAux(true);
    Promise.all([
      getTransactionById(id),
      getRecoveryAttemptsByTransaction(id),
      getAuditByTransaction(id),
    ]).then(([txnData, att, aud]) => {
      if (cancelled) return;
      setTxn(txnData);
      setAttempts(att || []);
      setAudits(aud || []);
      if (aud && aud.length > 0) {
        const latest = aud[0];
        setAnalysis({
          baseline:   { classification: latest.baseline_classification, recoveryScore: latest.baseline_score, recommendedAction: latest.baseline_action },
          aiDecision: { classification: latest.ai_classification, recoveryScore: latest.ai_score, recommendedAction: latest.ai_action },
          comparison: { classificationAgreement: latest.classification_agreement, scoreDifference: latest.score_difference, severity: latest.severity },
          policy:     { decision: latest.policy_decision, action: latest.policy_action, reason: latest.policy_reason },
          auditId: `AUDIT_${latest.id}`,
        });
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) { setLoadingTxn(false); setLoadingAux(false); }
    });
    return () => { cancelled = true; };
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const result = await analyzeRecovery(id);
      setAnalysis(result);
      reloadAll();
    } catch (err) {
      setAnalyzeError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRetryConfirm = async () => {
    setRetrying(true);
    setRetryError(null);
    setRetrySuccess(null);
    try {
      const result = await retryTransaction(id);
      setRetrySuccess(result.message || 'Retry executed.');
      setShowModal(false);
      reloadAll();
    } catch (err) {
      setRetryError(err.message || 'Retry failed');
      setShowModal(false);
    } finally {
      setRetrying(false);
    }
  };

  const canRetry =
    txn &&
    txn.status !== 'SUCCESS' &&
    analysis?.policy?.decision === 'APPROVE' &&
    analysis?.policy?.action   === 'RETRY';

  if (txnError) {
    return <ErrorState title="Unable to load transaction" message={txnError} onRetry={() => txnRetryRef.current?.()} />;
  }

  return (
    <div className="txn-details">
      {showModal && (
        <RetryModal onConfirm={handleRetryConfirm} onCancel={() => setShowModal(false)} busy={retrying} />
      )}

      <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/transactions')}>
        ← Back to transactions
      </button>

      {loadingTxn ? (
        <SkeletonCard />
      ) : txn ? (
        <div className="card txn-header-card">
          <div className="txn-header-top">
            <div>
              <div className="txn-id mono text-accent">{txn.id}</div>
              <div className="txn-amount">{formatCurrency(txn.amount, txn.currency)}</div>
              <div className="txn-currency text-muted">{txn.currency}</div>
            </div>
            <div className="txn-header-badges">
              <StatusBadge status={txn.status} />
            </div>
          </div>

          <hr className="divider" />

          <div className="txn-meta-grid">
            <div className="txn-meta-item">
              <span className="txn-meta-label">Customer</span>
              <span className="txn-meta-value mono">{txn.customerId}</span>
            </div>
            <div className="txn-meta-item">
              <span className="txn-meta-label">Failure Reason</span>
              <span className="txn-meta-value">{txn.failureReason || '—'}</span>
            </div>
            <div className="txn-meta-item">
              <span className="txn-meta-label">Retry Count</span>
              <span className="txn-meta-value">{txn.retryCount ?? '—'}</span>
            </div>
            <div className="txn-meta-item">
              <span className="txn-meta-label">Status</span>
              <span className="txn-meta-value">{txn.status}</span>
            </div>
          </div>

          <div className="txn-actions">
            {txn.status === 'SUCCESS' ? (
              <div className="success-notice" role="status">
                <span className="success-notice-icon" aria-hidden="true">✓</span>
                <span>Payment successful — no recovery action required.</span>
              </div>
            ) : !analysis ? (
              <button className="btn btn-ghost" onClick={handleAnalyze} disabled={analyzing} aria-label="Analyze recovery">
                {analyzing ? 'Analyzing…' : '⊙ Analyze Recovery'}
              </button>
            ) : analysis.policy?.decision === 'BLOCK' ? (
              <div className="blocked-notice" role="status">
                <span className="blocked-notice-icon" aria-hidden="true">⛔</span>
                <span>Recovery blocked — {analysis.policy?.reason || 'this transaction is not eligible for automatic recovery.'}</span>
              </div>
            ) : analysis.policy?.decision === 'REVIEW' ? (
              <div className="review-notice" role="status">
                <span className="review-notice-icon" aria-hidden="true">◐</span>
                <span>Flagged for human review — {analysis.policy?.reason || 'a manual decision is required.'}</span>
              </div>
            ) : canRetry ? (
              <div className="retry-section">
                <span className="retry-hint text-muted">Latest policy decision allows retry.</span>
                <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={retrying} aria-label="Retry payment">
                  {retrying ? 'Retrying…' : '↺ Retry Payment'}
                </button>
              </div>
            ) : null}
          </div>

          {txn.status !== 'SUCCESS' && analyzeError && <div className="inline-error" role="alert">⚠ {analyzeError}</div>}
          {txn.status !== 'SUCCESS' && retryError   && <div className="inline-error" role="alert">⚠ Retry failed: {retryError}</div>}
          {retrySuccess  && <div className="inline-success" role="status">✓ {retrySuccess}</div>}
        </div>
      ) : null}

      <section>
        <h2 className="detail-section-title">Recovery Intelligence</h2>
        {!analysis && !loadingAux && (
          <div className="card no-analysis">
            <div className="no-analysis-icon" aria-hidden="true">⊙</div>
            <div className="no-analysis-text">No recovery analysis available</div>
            <div className="no-analysis-sub text-muted">
              Click <strong>Analyze Recovery</strong> above to run AI + policy analysis on this transaction.
            </div>
          </div>
        )}
        {!analysis && loadingAux && <SkeletonCard />}

        {analysis && (
          <div className="analysis-layout">
            <div className="card score-card">
              <div className="score-card-label">Recovery Score</div>
              <RecoveryScore score={analysis.aiDecision?.recoveryScore ?? analysis.baseline?.recoveryScore} />
              {analysis.auditId && (
                <div className="audit-id-badge">
                  <span className="badge badge-neutral mono">{analysis.auditId}</span>
                </div>
              )}
            </div>

            <div className="card pipeline-card">
              <div className="pipeline-title">Decision Pipeline</div>
              <div className="pipeline">
                <PipelineStep label="Baseline" badge={<DecisionBadge value={analysis.baseline?.classification} type="classification" />} sub={analysis.baseline?.recommendedAction} />
                <PipelineStep label="AI Decision" badge={<DecisionBadge value={analysis.aiDecision?.classification} type="classification" />} sub={analysis.aiDecision?.recommendedAction} />
                <PipelineStep label="Comparison" badge={<span className={`badge ${getSeverityClass(analysis.comparison?.severity)}`}>{analysis.comparison?.severity || '—'}</span>} sub={analysis.comparison?.classificationAgreement === true ? '✓ Agreement' : analysis.comparison?.classificationAgreement === false ? '✗ Disagreement' : undefined} />
                <PipelineStep label="Policy" badge={<DecisionBadge value={analysis.policy?.decision} type="policy" />} sub={analysis.policy?.action} last />
              </div>
            </div>

            <div className="card reason-card">
              <div className="reason-label">Policy Reason</div>
              <div className="reason-text">{analysis.policy?.reason || '—'}</div>
              {analysis.comparison?.scoreDifference !== undefined && (
                <div className="score-diff">Score difference (Baseline vs AI): <strong>{formatAmount(analysis.comparison.scoreDifference)}</strong></div>
              )}
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="detail-section-title">Recovery Attempts</h2>
        {loadingAux ? (
          <SkeletonTable rows={3} cols={5} />
        ) : attempts.length === 0 ? (
          <div className="table-wrap">
            <EmptyState icon="↺" title="No recovery attempts" message="No recovery attempts have been made for this transaction." />
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Action</th><th>Status</th><th>Amount</th><th>Timestamp</th></tr>
              </thead>
              <tbody>
                {attempts.map(a => (
                  <tr key={a.id || a.attempt_number}>
                    <td>{a.attempt_number}</td>
                    <td><span className="badge badge-accent">{a.action}</span></td>
                    <td><span className={`badge ${a.status === 'SUCCESS' ? 'badge-success' : a.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(a.amount)}</td>
                    <td className="text-muted">{formatDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="detail-section-title">Audit Trail</h2>
        {loadingAux ? (
          <SkeletonTable rows={2} cols={6} />
        ) : audits.length === 0 ? (
          <div className="table-wrap">
            <EmptyState icon="⊙" title="No audit logs" message="No audit records found for this transaction." />
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Audit ID</th><th>Severity</th><th>Policy</th><th>AI Decision</th><th>Score</th><th>Created</th></tr>
              </thead>
              <tbody>
                {audits.map(a => (
                  <tr key={a.id}>
                    <td><span className="mono text-muted">AUDIT_{a.id}</span></td>
                    <td><span className={`badge ${getSeverityClass(a.severity)}`}>{a.severity || '—'}</span></td>
                    <td>
                      <span className={`badge ${getPolicyClass(a.policy_decision)}`}>{a.policy_decision || '—'}</span>
                      <span className="text-muted" style={{ marginLeft: 6, fontSize: '0.78rem' }}>{a.policy_action}</span>
                    </td>
                    <td>{a.ai_classification || '—'}</td>
                    <td>{a.ai_score ?? '—'}</td>
                    <td className="text-muted">{formatDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
