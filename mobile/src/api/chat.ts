import * as signalR from '@microsoft/signalr';

import { getAuthToken, TOKEN_KEY } from './authToken';
import { apiFetch } from './client';
import { API_BASE_URL } from './config';
import { storeGet } from '@/auth/storage';

export type ChatMessageDto = {
  id: string;
  senderUserId: string;
  senderName: string;
  text: string;
  sentUtc: string;
};

export type ChatState = { canSend: boolean; messages: ChatMessageDto[] };

// null = ingen adgang / findes ikke (404).
export async function getChat(eventId: string): Promise<ChatState | null> {
  const res = await apiFetch(`/api/events/${eventId}/chat`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Kunne ikke hente chat (HTTP ${res.status})`);
  return (await res.json()) as ChatState;
}

export async function sendMessage(eventId: string, text: string): Promise<ChatMessageDto> {
  const res = await apiFetch(`/api/events/${eventId}/chat`, { method: 'POST', body: JSON.stringify({ text }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Kunne ikke sende (HTTP ${res.status})`);
  return data as ChatMessageDto;
}

export async function attendEvent(eventId: string, answer: 'Yes' | 'No'): Promise<void> {
  const res = await apiFetch(`/api/events/${eventId}/rsvp`, { method: 'POST', body: JSON.stringify({ answer }) });
  if (!res.ok) throw new Error(`Kunne ikke svare (HTTP ${res.status})`);
}

// Realtidsforbindelse: modtager nye beskeder via 'ReceiveMessage'.
export function connectChat(eventId: string, onMessage: (m: ChatMessageDto) => void): signalR.HubConnection {
  const conn = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/chat`, {
      accessTokenFactory: async () => getAuthToken() ?? (await storeGet(TOKEN_KEY)) ?? '',
    })
    .withAutomaticReconnect()
    .build();

  conn.on('ReceiveMessage', (msg: ChatMessageDto) => onMessage(msg));
  conn.onreconnected(() => void conn.invoke('JoinEvent', eventId));

  conn
    .start()
    .then(() => conn.invoke('JoinEvent', eventId))
    .catch(() => {
      /* forbindelse fejlede — historik er hentet, og send går via REST */
    });

  return conn;
}
