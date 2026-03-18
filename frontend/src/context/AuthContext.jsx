import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'shuttle_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Restore session from storage (dummy auth). Later: replace with Okta token/session check.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) setUser(parsed);
      }
    } catch (_) {}
    setReady(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const value = { user, login, logout, ready, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
