import { apiFetch } from './client';

export type AuthResponse = { token: string; email: string; displayName: string };

async function authRequest(path: string, body: object): Promise<AuthResponse> {
  const res = await apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Noget gik galt (HTTP ${res.status})`);
  return data as AuthResponse;
}

export const register = (email: string, password: string, displayName: string) =>
  authRequest('/api/auth/register', { email, password, displayName });

export const login = (email: string, password: string) =>
  authRequest('/api/auth/login', { email, password });
