import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type AdminAuthContextValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

// Demo credentials - in production, use Supabase Auth with real user accounts
const ADMIN_EMAIL = 'admin@spicegarden.demo';
const ADMIN_PASSWORD = 'spicegarden123';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored admin session
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.expiresAt && session.expiresAt > Date.now()) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Create a session that expires in 24 hours
    const session = {
      email,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('admin_session', JSON.stringify(session));
    setIsLoggedIn(true);

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
