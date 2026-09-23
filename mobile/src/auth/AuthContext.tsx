import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import * as authApi from '@/api/auth';
import { setAuthToken, setOnUnauthorized, TOKEN_KEY } from '@/api/authToken';
import { storeDelete, storeGet, storeSet } from '@/auth/storage';

type User = { email: string; displayName: string };

type AuthState = {
  user: User | null;
  isLoading: boolean;
  notice: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_KEY = 'futnight.user';
const EXPIRED_NOTICE = 'Din session er udløbet — log ind igen.';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Læs 'exp' (udløb) ud af JWT'et → millisekunder siden epoch, eller null hvis ukendt.
function tokenExpiryMs(token: string): number | null {
  try {
    let payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    const json = JSON.parse(atob(payload));
    return typeof json.exp === 'number' ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const doLogout = async (reason?: string) => {
    clearTimer();
    setAuthToken(null);
    setUser(null);
    setNotice(reason ?? null);
    await storeDelete(TOKEN_KEY);
    await storeDelete(USER_KEY);
  };

  // Planlæg auto-logout præcis når token'et udløber.
  const scheduleExpiry = (token: string) => {
    clearTimer();
    const expMs = tokenExpiryMs(token);
    if (expMs === null) return; // ukendt udløb → stol på 401-håndteringen
    const ms = expMs - Date.now();
    if (ms <= 0) {
      void doLogout(EXPIRED_NOTICE);
      return;
    }
    timer.current = setTimeout(() => void doLogout(EXPIRED_NOTICE), Math.min(ms, 2_000_000_000));
  };

  // 401 fra et beskyttet endpoint → log ud.
  useEffect(() => {
    setOnUnauthorized(() => void doLogout(EXPIRED_NOTICE));
    return () => setOnUnauthorized(null);
  }, []);

  // Genskab session ved opstart (men ikke hvis token'et allerede er udløbet).
  useEffect(() => {
    (async () => {
      try {
        const token = await storeGet(TOKEN_KEY);
        const userJson = await storeGet(USER_KEY);
        if (token && userJson) {
          const expMs = tokenExpiryMs(token);
          if (expMs !== null && expMs <= Date.now()) {
            await storeDelete(TOKEN_KEY);
            await storeDelete(USER_KEY);
          } else {
            setAuthToken(token);
            setUser(JSON.parse(userJson) as User);
            scheduleExpiry(token);
          }
        }
      } catch {
        /* ignore */
      }
      setIsLoading(false);
    })();
    return clearTimer;
  }, []);

  const persist = async (res: authApi.AuthResponse) => {
    const u: User = { email: res.email, displayName: res.displayName };
    setAuthToken(res.token);
    await storeSet(TOKEN_KEY, res.token);
    await storeSet(USER_KEY, JSON.stringify(u));
    setNotice(null);
    setUser(u);
    scheduleExpiry(res.token);
  };

  const login = async (email: string, password: string) => persist(await authApi.login(email, password));

  const register = async (email: string, password: string, displayName: string) =>
    persist(await authApi.register(email, password, displayName));

  const logout = () => doLogout();

  return (
    <AuthContext.Provider value={{ user, isLoading, notice, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth skal bruges inde i en AuthProvider');
  return ctx;
}
