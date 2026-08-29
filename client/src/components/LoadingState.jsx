import './LoadingState.css';

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="skeleton-row" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><span className="skeleton-cell" /></td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="table-wrap">
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card card" aria-hidden="true">
      <span className="skeleton-line skeleton-line--sm" />
      <span className="skeleton-line skeleton-line--lg" />
      <span className="skeleton-line skeleton-line--sm" />
    </div>
  );
}

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-label={message}>
      <div className="loading-spinner" aria-hidden="true" />
      <span className="loading-text">{message}</span>
    </div>
  );
}
