import './StatCard.css';

export default function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className={`stat-card card ${accent ? 'stat-card--accent' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
