// Farve + kort badge pr. turnering (til crests i listen).
export const competitionMeta: Record<string, { color: string; badge: string }> = {
  PL: { color: '#1B458F', badge: 'PL' },
  PD: { color: '#E01A22', badge: 'PD' },
  BL1: { color: '#D20515', badge: 'BL' },
  SA: { color: '#0A5CA8', badge: 'SA' },
  FL1: { color: '#1A2896', badge: 'L1' },
  CL: { color: '#1E88E5', badge: 'CL' },
};

export function metaFor(code: string) {
  return competitionMeta[code] ?? { color: '#2A4A54', badge: code.slice(0, 3) };
}
