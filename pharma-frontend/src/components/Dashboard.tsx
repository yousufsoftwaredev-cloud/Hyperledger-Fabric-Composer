import { useEffect, useState } from 'react';
import { healthCheck, ping } from '../services/api';
import { useAuth, ROLE_COLOR, ROLE_LABEL } from '../context/AuthContext';
import ApiResult from './shared/ApiResult';

export default function Dashboard() {
  const { user } = useAuth();
  const [health, setHealth] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: true });
  const [pingResult, setPingResult] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: false });

  useEffect(() => {
    healthCheck().then((res) => {
      if (res.success) setHealth({ loading: false, data: res.data });
      else setHealth({ loading: false, error: res.error });
    });
  }, []);

  const handlePing = () => {
    setPingResult({ loading: true });
    ping().then((res) => {
      if (res.success) setPingResult({ loading: false, data: res.data });
      else setPingResult({ loading: false, error: res.error });
    });
  };

  if (!user) return null;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back, <strong>{user.name}</strong></p>
      </div>

      <div className="dashboard-cards">
        <div className="dash-card" style={{ borderTopColor: ROLE_COLOR[user.role] }}>
          <div className="dash-card-label">Logged In As</div>
          <div className="dash-card-value">{user.name}</div>
          <div style={{ color: ROLE_COLOR[user.role], fontWeight: 600 }}>
            {ROLE_LABEL[user.role]}
          </div>
          <div className="dash-card-sub">ID: {user.id}</div>
        </div>

        <div className="dash-card" style={{ borderTopColor: '#10b981' }}>
          <div className="dash-card-label">API Base URL</div>
          <div className="dash-card-value" style={{ fontSize: '0.9rem' }}>
            {window.location.origin}
          </div>
          <div className="dash-card-sub">Hyperledger Composer REST</div>
        </div>

        <div className="dash-card" style={{ borderTopColor: '#f59e0b' }}>
          <div className="dash-card-label">System Health</div>
          {health.loading ? (
            <div className="dash-card-value">Checking…</div>
          ) : health.error ? (
            <div style={{ color: '#dc2626', fontWeight: 600 }}>Offline</div>
          ) : (
            <div style={{ color: '#10b981', fontWeight: 600 }}>Online</div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>System Health</h3>
        <ApiResult loading={health.loading} error={health.error} data={health.data} />
      </div>

      <div className="section">
        <h3>Composer Ping</h3>
        <button className="btn-primary" onClick={handlePing}>
          Ping Composer REST Server
        </button>
        <ApiResult loading={pingResult.loading} error={pingResult.error} data={pingResult.data} />
      </div>
    </div>
  );
}
