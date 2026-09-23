const dage = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];

// Formatér kickoff til dansk, i brugerens lokale tid. utcKickoff er ISO med Z.
export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';

  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const time = `${hh}:${mm}`;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (d.toDateString() === now.toDateString()) return `I dag · ${time}`;
  if (d.toDateString() === tomorrow.toDateString()) return `I morgen · ${time}`;
  return `${dage[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1} · ${time}`;
}

// Kort holdnavn til listevisning (fjern almindelige suffikser/præfikser).
export function shortTeam(name: string): string {
  return name
    .replace(/^1\.\s?FC\s+/i, '')
    .replace(/\s+(FC|CF|AC|SC|BK|SK|CP|AS|SS|SSC|US)$/i, '')
    .trim();
}

// Kort holdforkortelse til crests (fx "Real Madrid" -> "RM").
export function teamAbbr(name: string): string {
  const clean = shortTeam(name);
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 3).toUpperCase();
}
