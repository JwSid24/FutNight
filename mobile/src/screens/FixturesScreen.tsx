import { Feather } from '@expo/vector-icons';
import { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getUpcomingFixtures, type FixtureDto } from '@/api/fixtures';
import { formatKickoff, shortTeam } from '@/api/format';
import { Crest, SectionLabel } from '@/components/ui';
import { metaFor } from '@/data/competitions';
import { colors, font, radius } from '@/theme/theme';

type Group = { league: string; code: string; cl: boolean; matches: FixtureDto[] };

function groupByCompetition(fixtures: FixtureDto[]): Group[] {
  const map = new Map<string, FixtureDto[]>();
  for (const f of fixtures) {
    const arr = map.get(f.competitionName) ?? [];
    if (arr.length < 5) arr.push(f); // vis de næste ~5 pr. turnering
    map.set(f.competitionName, arr);
  }
  return [...map.entries()].map(([league, matches]) => ({
    league,
    matches,
    code: matches[0].competitionCode,
    cl: matches[0].competitionCode === 'CL',
  }));
}

export function FixturesScreen({ onCreate }: { onCreate: (f: FixtureDto) => void }) {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    setGroups(null);
    getUpcomingFixtures()
      .then((fx) => alive && setGroups(groupByCompetition(fx)))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  if (error) {
    return (
      <View style={styles.center}>
        <Feather name="wifi-off" size={26} color={colors.muted} />
        <Text style={styles.errTitle}>Kunne ikke hente kampe</Text>
        <Text style={styles.errSub}>{error}</Text>
        <Text style={styles.errHint}>Kører backend på http://localhost:5080?</Text>
        <Pressable style={styles.retry} onPress={() => setReloadKey((k) => k + 1)}>
          <Text style={styles.retryTxt}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  if (!groups) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.errSub}>Henter kampe…</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View style={styles.center}>
        <Feather name="calendar" size={26} color={colors.muted} />
        <Text style={styles.errTitle}>Ingen kommende kampe</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {groups.map((g) => {
        const meta = metaFor(g.code);
        return (
          <Fragment key={g.league}>
            <SectionLabel label={g.league} tone={g.cl ? 'cl' : undefined} />
            {g.matches.map((m) => (
              <View key={m.id} style={[styles.fix, g.cl && { borderColor: colors.blueBorder }]}>
                <Crest abbr={meta.badge} color={meta.color} size={34} round={10} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    {shortTeam(m.homeTeam)} — {shortTeam(m.awayTeam)}
                  </Text>
                  <Text style={styles.when}>{formatKickoff(m.utcKickoff)}</Text>
                </View>
                <Pressable style={styles.go} onPress={() => onCreate(m)}>
                  <Feather name="plus" size={13} color={colors.accent} />
                  <Text style={styles.goTxt}>Event</Text>
                </Pressable>
              </View>
            ))}
          </Fragment>
        );
      })}
      <Text style={styles.hint}>Live fra GET /api/fixtures — cachet i backend.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  errTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 17 },
  errSub: { color: colors.muted, fontFamily: font.med, fontSize: 12.5, textAlign: 'center' },
  errHint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center' },
  retry: { marginTop: 6, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18 },
  retryTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 13 },
  fix: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 11 },
  title: { color: colors.text, fontFamily: font.displayBold, fontSize: 14, letterSpacing: 0.2 },
  when: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, marginTop: 1 },
  go: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11 },
  goTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 12 },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center', paddingTop: 6 },
});
