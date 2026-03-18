import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api';

export default function Login() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getUsers()
      .then((list) => {
        setUsers(list);
        if (list.length && !selectedId) setSelectedId(String(list[0].id));
      })
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
    const u = users.find((x) => String(x.id) === selectedId);
    if (!u) return;
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
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Sign in to book the office shuttle. (Dummy login — no password. Okta will be integrated later.)
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem' }}>Select your account</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ width: '100%' }}
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.email}
                </option>
              ))}
            </select>
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
