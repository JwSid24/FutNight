import { apiFetch } from './client';

export type VenueMode = 'HostHome' | 'ToBeDecided';

export type EventDto = {
  id: string;
  fixtureId: string;
  competitionCode: string;
  competitionName: string;
  homeTeam: string;
  awayTeam: string;
  utcKickoff: string;
  venueMode: VenueMode;
  venueText: string | null;
  inviteToken: string;
  hostName: string;
  createdUtc: string;
};

export async function createEvent(
  fixtureId: string,
  venueMode: VenueMode,
  venueText?: string,
): Promise<EventDto> {
  const res = await apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify({ fixtureId, venueMode, venueText: venueText?.trim() || null }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Kunne ikke oprette event (HTTP ${res.status})`);
  return data as EventDto;
}

export async function getMyEvents(): Promise<EventDto[]> {
  const res = await apiFetch('/api/events/mine');
  if (!res.ok) throw new Error(`Kunne ikke hente events (HTTP ${res.status})`);
  return (await res.json()) as EventDto[];
}
