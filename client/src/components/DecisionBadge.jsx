import { getPolicyClass, getClassificationClass } from '../utils/status';

export default function DecisionBadge({ value, type = 'policy' }) {
  if (!value) return <span className="badge badge-neutral">—</span>;
  const cls = type === 'classification'
    ? getClassificationClass(value)
    : getPolicyClass(value);
  return (
    <span className={`badge ${cls}`} aria-label={`${type}: ${value}`}>
      {value}
    </span>
  );
}
