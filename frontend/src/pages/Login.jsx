import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api';

export default function Login() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your email.');
      return;
    }
    const u = users.find((x) => (x.email || '').toLowerCase() === trimmed);
    if (!u) {
      setError('No account found for this email.');
      return;
    }
    login(u);
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  if (loading) {
    return (
      <div className="login-page">
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="card" style={{ maxWidth: '360px', margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Trimble WorkRide</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
          Sign in with your work email to book the office shuttle. (Dummy login — no password.)
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          Try: admin@company.com, testuser1@company.com, testuser2@company.com, testuser3@company.com
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. testuser1@company.com"
              style={{ width: '100%' }}
              autoComplete="email"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}
