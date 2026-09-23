import { getAuthToken, notifyUnauthorized, setAuthToken, TOKEN_KEY } from './authToken';
import { API_BASE_URL } from './config';
import { storeGet } from '@/auth/storage';

// Genskab token fra storage hvis hukommelsen er tom (fx efter hot-reload under udvikling).
async function currentToken(): Promise<string | null> {
  let token = getAuthToken();
  if (!token) {
    token = await storeGet(TOKEN_KEY);
    if (token) setAuthToken(token);
  }
  return token;
}

// Central fetch: sætter base-URL, JSON-header og Authorization (hvis logget ind).
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };

  const token = await currentToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  // Token afvist på et beskyttet endpoint → sessionen er udløbet/ugyldig → log ud.
  if (res.status === 401 && token) notifyUnauthorized();

  return res;
}
