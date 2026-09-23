import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import * as authApi from '@/api/auth';
import { setAuthToken, TOKEN_KEY } from '@/api/authToken';
import { storeDelete, storeGet, storeSet } from '@/auth/storage';

type User = { email: string; displayName: string };

type AuthState = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_KEY = 'futnight.user';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Genskab session ved opstart.
  useEffect(() => {
    (async () => {
      try {
        const token = await storeGet(TOKEN_KEY);
        const userJson = await storeGet(USER_KEY);
        if (token && userJson) {
          setAuthToken(token);
          setUser(JSON.parse(userJson) as User);
        }
      } catch {
        /* ignore */
      }
      setIsLoading(false);
    })();
  }, []);

  const persist = async (res: authApi.AuthResponse) => {
    const u: User = { email: res.email, displayName: res.displayName };
    setAuthToken(res.token);
    await storeSet(TOKEN_KEY, res.token);
    await storeSet(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => persist(await authApi.login(email, password));

  const register = async (email: string, password: string, displayName: string) =>
    persist(await authApi.register(email, password, displayName));

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    await storeDelete(TOKEN_KEY);
    await storeDelete(USER_KEY);
  };

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth skal bruges inde i en AuthProvider');
  return ctx;
}
