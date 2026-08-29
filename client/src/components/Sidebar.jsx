import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getHealth } from '../services/api';

const NAV_ICONS = {
  '/dashboard':          '▣',
  '/transactions':       '≡',
  '/recovery-attempts':  '↺',
  '/audit':              '⊙',
};

export default function Sidebar({ routes }) {
  const [apiStatus, setApiStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then(() => { if (!cancelled) setApiStatus('online'); })
      .catch(() => { if (!cancelled) setApiStatus('offline'); });
    return () => { cancelled = true; };
  }, []);

  const statusLabel = {
    online:   'API Connected',
    offline:  'API Unavailable',
    checking: 'Checking...',
  }[apiStatus];

  const statusColor = {
    online:   'var(--success)',
    offline:  'var(--danger)',
    checking: 'var(--warning)',
  }[apiStatus];

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">
          <span className="brand-dot" aria-hidden="true" />
          RecoverAI
        </div>
        <div className="sidebar-brand-sub">Payment Recovery Intelligence</div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {routes.map(route => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            aria-label={route.label}
          >
            <span className="nav-link-icon" aria-hidden="true">
              {NAV_ICONS[route.path] || '○'}
            </span>
            {route.label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-label">System Status</div>
          <div className="status-indicator" style={{ color: statusColor }}>
            <span className={`status-dot ${apiStatus}`} aria-hidden="true" />
            {statusLabel}
          </div>
        </div>
      </div>
    </nav>
  );
}
