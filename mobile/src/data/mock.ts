// Midlertidig mock-data. Erstattes af GET /api/fixtures + events-endpoints senere.

export type Team = { abbr: string; name: string; color: string; textDark?: boolean };
export type VenueMode = 'home' | 'tbd';

export type FeedEvent = {
  id: string;
  host: string;
  hostInitials: string;
  timeAgo: string;
  mode: VenueMode;
  competition: string;
  cl?: boolean;
  home: Team;
  away: Team;
  time: string;
  day: string;
  venue: string;
  attendees: { initials: string; color: string }[];
  extra: number;
  summary: string;
};

export const events: FeedEvent[] = [
  {
    id: 'e1',
    host: 'Jwan',
    hostInitials: 'JW',
    timeAgo: 'arrangerer · 2t siden',
    mode: 'home',
    competition: 'Premier League',
    home: { abbr: 'CRY', name: 'Crystal Palace', color: '#1B458F' },
    away: { abbr: 'MCI', name: 'Man City', color: '#6CABDD', textDark: true },
    time: '21:00',
    day: 'i aften',
    venue: '🏠 Hos Jwan · Nørrebrogade 12',
    attendees: [
      { initials: 'JW', color: '#8ff2ba' },
      { initials: 'MK', color: '#F5C451' },
      { initials: 'SØ', color: '#6CABDD' },
    ],
    extra: 4,
    summary: '6 kommer · 1 måske',
  },
  {
    id: 'e2',
    host: 'Mikkel',
    hostInitials: 'MK',
    timeAgo: 'arrangerer · i går',
    mode: 'tbd',
    competition: 'Champions League',
    cl: true,
    home: { abbr: 'LIV', name: 'Liverpool', color: '#DA020E' },
    away: { abbr: 'PSG', name: 'Paris SG', color: '#004170' },
    time: '21:00',
    day: 'tirs 2/9',
    venue: '📍 Sted aftales — foreslå en bar i chatten',
    attendees: [
      { initials: 'MK', color: '#F5C451' },
      { initials: 'JW', color: '#8ff2ba' },
    ],
    extra: 2,
    summary: '4 kommer',
  },
];

export type FixtureGroup = {
  league: string;
  cl?: boolean;
  matches: { abbr: string; color: string; title: string; when: string }[];
};

export const fixtureGroups: FixtureGroup[] = [
  {
    league: 'Premier League',
    matches: [
      { abbr: 'CRY', color: '#1B458F', title: 'Crystal Palace — Man City', when: 'I aften · 21:00' },
      { abbr: 'LIV', color: '#DA020E', title: 'Liverpool — Nottm Forest', when: 'Lør 29/8 · 13:30' },
    ],
  },
  {
    league: 'Bundesliga',
    matches: [
      { abbr: 'FCB', color: '#DC052D', title: 'Bayern — Stuttgart', when: 'I aften · 20:30' },
      { abbr: 'KÖL', color: '#ED1C24', title: 'Köln — Hoffenheim', when: 'Lør 29/8 · 15:30' },
    ],
  },
  {
    league: 'La Liga',
    matches: [
      { abbr: 'ALA', color: '#00519E', title: 'Alavés — Villarreal', when: 'I aften · 21:30' },
    ],
  },
  {
    league: 'Serie A · Ligue 1',
    matches: [
      { abbr: 'MIL', color: '#FB090B', title: 'Milan — Venezia', when: 'I aften · 20:45' },
      { abbr: 'LIL', color: '#E01E13', title: 'Lille — Paris SG', when: 'I aften · 20:45' },
    ],
  },
  {
    league: 'Champions League',
    cl: true,
    matches: [
      { abbr: 'CL', color: '#1E88E5', title: 'Liverpool — Paris SG', when: 'Tirs 2/9 · 21:00' },
    ],
  },
];

export const chats = [
  { id: 'c1', initials: 'CM', title: 'Crystal Palace — Man City', last: 'Mikkel: Jeg tager chips med 🍟', when: '21:02', unread: 3 },
  { id: 'c2', initials: 'LP', title: 'Liverpool — Paris SG', last: 'Sofie: Barbette på Vesterbro?', when: 'i går', unread: 0 },
];

export const favoriteTeams = [
  { abbr: 'LIV', name: 'Liverpool', color: '#DA020E' },
  { abbr: 'MCI', name: 'Man City', color: '#6CABDD', textDark: true },
  { abbr: 'FCB', name: 'Bayern', color: '#DC052D' },
  { abbr: 'PSG', name: 'PSG', color: '#004170' },
  { abbr: 'MIL', name: 'Milan', color: '#FB090B' },
];
