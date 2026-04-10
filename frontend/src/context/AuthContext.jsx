import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useTrimbleAuth } from '@trimble-oss/trimble-id-react';

const STORAGE_KEY = 'shuttle_user';
// NOTE: Access token is stored in-memory by the SDK (v1.0.3+)
// Do NOT store it in localStorage for security reasons

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const trimbleAuth = useTrimbleAuth();

  useEffect(() => {
    // Initialize user data from localStorage on mount
    console.log('🚀 AuthContext initializing...');
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('📖 Retrieved user from localStorage:', stored ? JSON.parse(stored) : null);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.id || parsed.email)) {
          console.log('✓ User restored from localStorage:', parsed);
          setUser(parsed);
        } else {
          console.log('⚠ Stored user object lacks id or email:', parsed);
        }
      } else {
        console.log('ℹ No stored user found in localStorage');
      }
    } catch (err) {
      console.error('✗ Error initializing user from localStorage:', err);
    }
    setReady(true);
  }, []);

  const login = (userData) => {
    console.log('🔐 login() called with user:', userData);
    
    setUser(userData);
    
    // Save only USER data to localStorage (for persistence)
    // Token is managed by the SDK in-memory
    if (userData) {
      try {
        const userStr = JSON.stringify(userData);
        localStorage.setItem(STORAGE_KEY, userStr);
        console.log('✓ User data stored in localStorage');
      } catch (err) {
        console.error('✗ Failed to store user data in localStorage:', err);
      }
    }
  };

  const logout = () => {
    console.log('🚪 logout() called');
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('✓ Cleared user data from localStorage');
    } catch (err) {
      console.error('✗ Error clearing localStorage:', err);
    }
    // Call Trimble logout if available (SDK manages token cleanup)
    if (trimbleAuth?.logout) {
      console.log('→ Calling Trimble SDK logout');
      trimbleAuth.logout();
    }
  };

  const value = {
    user,
    login,
    logout,
    ready,
    isAuthenticated: !!user,
    trimbleAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
