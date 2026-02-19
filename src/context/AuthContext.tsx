import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../types';
import { sendLoginNotification } from '../services/authApi';

const AUTH_TOKEN_KEY = 'netput_auth_token';
const AUTH_USER_KEY = 'netput_auth_user';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(() => {
    try {
      const token =
        localStorage.getItem(AUTH_TOKEN_KEY) ||
        sessionStorage.getItem(AUTH_TOKEN_KEY);
      const userData =
        localStorage.getItem(AUTH_USER_KEY) ||
        sessionStorage.getItem(AUTH_USER_KEY);
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, token });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = useCallback(
    async (email: string, _password: string, rememberMe = false) => {
      setIsLoading(true);
      try {
        // Simulated API call - in production, replace with real auth API
        await new Promise((resolve) => setTimeout(resolve, 800));
        const token = `jwt_${btoa(email + ':' + Date.now())}`;
        const userData: User = { email, token };
        if (rememberMe) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email }));
        } else {
          sessionStorage.setItem(AUTH_TOKEN_KEY, token);
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email }));
        }
        setUser(userData);
        sendLoginNotification(email).catch(() => {});
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (email: string, _password: string) => {
      setIsLoading(true);
      try {
        // Simulated API call - in production, replace with real auth API
        await new Promise((resolve) => setTimeout(resolve, 800));
        const token = `jwt_${btoa(email + ':' + Date.now())}`;
        const userData: User = { email, token };
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email }));
        setUser(userData);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const checkStorage = () => {
      const token =
        localStorage.getItem(AUTH_TOKEN_KEY) ||
        sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (!token && user) {
        setUser(null);
      }
    };
    window.addEventListener('storage', checkStorage);
    return () => window.removeEventListener('storage', checkStorage);
  }, [user]);

  const value: AuthState = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
