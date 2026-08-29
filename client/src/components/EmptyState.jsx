import './EmptyState.css';

export default function EmptyState({ icon = '○', title, message }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {message && <div className="empty-state-msg">{message}</div>}
    </div>
  );
}
