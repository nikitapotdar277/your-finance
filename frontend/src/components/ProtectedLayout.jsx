import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../api';

function ProtectedLayout({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'unauthorized'

  useEffect(() => {
    getMe()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('unauthorized'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="app-shell">
        <div className="container py-4 py-lg-5 text-center">
          <p className="text-muted">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedLayout;
