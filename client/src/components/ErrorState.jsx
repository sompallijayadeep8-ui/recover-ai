import './ErrorState.css';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-icon" aria-hidden="true">⚠</div>
      <div className="error-state-title">{title}</div>
      {message && <div className="error-state-msg">{message}</div>}
      {onRetry && (
        <button className="btn btn-ghost btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
