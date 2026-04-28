import { useState } from 'react';
import { useAuth, HARDCODED_USERS, ROLE_COLOR, ROLE_LABEL } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError('Invalid credentials');
  };

  const quickLogin = (u: { username: string; password: string }) => {
    login(u.username, u.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Pharma Supply Chain</h1>
          <p>Blockchain-Based Drug Tracking System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
            />
          </div>
          {error && <div className="api-error">{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-label">Quick login (test credentials)</p>
          <div className="user-cards">
            {HARDCODED_USERS.map((u) => (
              <button
                key={u.username}
                className="user-card"
                style={{ borderLeftColor: ROLE_COLOR[u.role] }}
                onClick={() => quickLogin(u)}
              >
                <span className="user-role" style={{ color: ROLE_COLOR[u.role] }}>
                  {ROLE_LABEL[u.role]}
                </span>
                <span className="user-name">{u.name}</span>
                <span className="user-cred">{u.username} / {u.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
