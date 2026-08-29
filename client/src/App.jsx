import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar  from './components/Topbar';

import Dashboard          from './pages/Dashboard';
import Transactions       from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import RecoveryAttempts   from './pages/RecoveryAttempts';
import AuditLogs          from './pages/AuditLogs';

const ROUTES = [
  { path: '/dashboard',        label: 'Dashboard',          sub: 'Monitor payment failures, recovery decisions, and policy outcomes.' },
  { path: '/transactions',     label: 'Transactions',       sub: 'Browse, search, and analyze all payment transactions.' },
  { path: '/recovery-attempts',label: 'Recovery Attempts',  sub: 'History of all recovery execution attempts.' },
  { path: '/audit',            label: 'Audit Logs',         sub: 'Decision trail — AI analysis, policy outcomes, and reasoning.' },
];

function AppShell({ children, routes }) {
  return (
    <div className="app-shell">
      <Sidebar routes={routes} />
      <div className="main-area">
        <Topbar routes={routes} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <AppShell routes={ROUTES}>
            <Dashboard />
          </AppShell>
        } />
        <Route path="/transactions" element={
          <AppShell routes={ROUTES}>
            <Transactions />
          </AppShell>
        } />
        <Route path="/transactions/:id" element={
          <AppShell routes={ROUTES}>
            <TransactionDetails />
          </AppShell>
        } />
        <Route path="/recovery-attempts" element={
          <AppShell routes={ROUTES}>
            <RecoveryAttempts />
          </AppShell>
        } />
        <Route path="/audit" element={
          <AppShell routes={ROUTES}>
            <AuditLogs />
          </AppShell>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
