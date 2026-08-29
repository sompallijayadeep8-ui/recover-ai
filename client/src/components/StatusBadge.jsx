import { getStatusClass } from '../utils/status';

const DOTS = {
  SUCCESS: '●',
  FAILED:  '●',
  BLOCKED: '●',
};

export default function StatusBadge({ status }) {
  if (!status) return <span className="badge badge-neutral">—</span>;
  const cls  = getStatusClass(status);
  const dot  = DOTS[status.toUpperCase()] || '●';
  return (
    <span className={`badge ${cls}`} aria-label={`Status: ${status}`}>
      <span aria-hidden="true">{dot}</span>
      {status}
    </span>
  );
}
