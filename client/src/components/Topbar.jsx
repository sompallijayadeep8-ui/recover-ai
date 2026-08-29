import { useLocation } from 'react-router-dom';

export default function Topbar({ routes }) {
  const location = useLocation();

  // Find the best matching route for current path
  const match = routes
    .slice()
    .sort((a, b) => b.path.length - a.path.length)
    .find(r => location.pathname.startsWith(r.path));

  const isDetail = location.pathname.match(/\/transactions\/.+/);

  const title = isDetail ? 'Transaction Details' : (match ? match.label : 'RecoverAI');
  const sub   = isDetail ? 'Full analysis, policy decision, and recovery controls.' : (match ? match.sub : '');

  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {sub && <p className="topbar-sub">{sub}</p>}
      </div>
    </header>
  );
}
