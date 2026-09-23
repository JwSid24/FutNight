import { apiFetch } from './client';

// Spejler backendens FixtureDto. Ingen spor af kilden (Football-Data.org) — kun vores API.
export type FixtureDto = {
  id: string;
  competitionCode: string;
  competitionName: string;
  homeTeam: string;
  awayTeam: string;
  utcKickoff: string;
  status: string;
  matchday: number | null;
};

export async function getUpcomingFixtures(competition?: string): Promise<FixtureDto[]> {
  const query = competition ? `?competition=${encodeURIComponent(competition)}` : '';
  const res = await apiFetch(`/api/fixtures${query}`);
  if (!res.ok) throw new Error(`Kunne ikke hente kampe (HTTP ${res.status})`);
  return (await res.json()) as FixtureDto[];
}
