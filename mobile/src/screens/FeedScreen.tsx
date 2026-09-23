import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getUpcomingFixtures, type FixtureDto } from '@/api/fixtures';
import { formatKickoff, shortTeam, teamAbbr } from '@/api/format';
import { Crest } from '@/components/ui';
import { metaFor } from '@/data/competitions';
import { favoriteTeams } from '@/data/mock';
import { colors, font, gradient, radius } from '@/theme/theme';

function Story({ abbr, name, color, textDark }: { abbr: string; name: string; color: string; textDark?: boolean }) {
  return (
    <View style={styles.story}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.ring}>
        <View style={[styles.crest, { backgroundColor: color }]}>
          <Text style={{ fontFamily: font.display, fontSize: 14, color: textDark ? '#06130c' : '#fff' }}>{abbr}</Text>
        </View>
      </LinearGradient>
      <Text style={styles.storyLabel} numberOfLines={1}>{name}</Text>
    </View>
  );
}

function FixtureFeedCard({ f, onCreate }: { f: FixtureDto; onCreate: (f: FixtureDto) => void }) {
  const meta = metaFor(f.competitionCode);
  const parts = (formatKickoff(f.utcKickoff) || '').split(' · ');
  const day = parts[0] ?? '';
  const time = parts[1] ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.compRow}>
          <View style={[styles.compDot, { backgroundColor: meta.color }]} />
          <Text style={styles.compName}>{f.competitionName}</Text>
        </View>
        <Text style={styles.kick}>{time ? `${day} · ${time}` : day}</Text>
      </View>

      <View style={[styles.match, f.competitionCode === 'CL' && { borderColor: colors.blueBorder }]}>
        <View style={styles.team}>
          <Crest abbr={teamAbbr(f.homeTeam)} color={meta.color} />
          <Text style={styles.tname}>{shortTeam(f.homeTeam)}</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 3 }}>
          <Text style={styles.time}>{time || '—'}</Text>
          <Text style={styles.vs}>VS</Text>
        </View>
        <View style={styles.team}>
          <Crest abbr={teamAbbr(f.awayTeam)} color={meta.color} />
          <Text style={styles.tname}>{shortTeam(f.awayTeam)}</Text>
        </View>
      </View>

      <Pressable onPress={() => onCreate(f)}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
          <Feather name="plus" size={16} color={colors.onAccent} />
          <Text style={styles.ctaTxt}>Opret event</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export function FeedScreen({ onCreate }: { onCreate: (f: FixtureDto) => void }) {
  const [fixtures, setFixtures] = useState<FixtureDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    setFixtures(null);
    getUpcomingFixtures()
      .then((fx) => alive && setFixtures(fx.slice(0, 20)))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}>
        <View style={styles.story}>
          <View style={[styles.ring, styles.addRing]}>
            <View style={[styles.crest, { backgroundColor: colors.surface2 }]}>
              <Feather name="plus" size={22} color={colors.accent} />
            </View>
          </View>
          <Text style={styles.storyLabel}>Følg hold</Text>
        </View>
        {favoriteTeams.map((t) => (
          <Story key={t.abbr} abbr={t.abbr} name={t.name} color={t.color} textDark={t.textDark} />
        ))}
      </ScrollView>

      {error && (
        <View style={styles.state}>
          <Feather name="wifi-off" size={24} color={colors.muted} />
          <Text style={styles.stateSub}>{error}</Text>
          <Text style={styles.stateHint}>Kører backend på http://localhost:5080?</Text>
          <Pressable style={styles.retry} onPress={() => setReloadKey((k) => k + 1)}>
            <Text style={styles.retryTxt}>Prøv igen</Text>
          </Pressable>
        </View>
      )}

      {!error && !fixtures && (
        <View style={styles.state}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.stateSub}>Henter kommende kampe…</Text>
        </View>
      )}

      {fixtures?.map((f) => (
        <FixtureFeedCard key={f.id} f={f} onCreate={onCreate} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14, paddingBottom: 120 },
  stories: { gap: 12, paddingVertical: 2, paddingRight: 8 },
  story: { width: 60, alignItems: 'center', gap: 6 },
  ring: { width: 56, height: 56, borderRadius: 28, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
  addRing: { backgroundColor: colors.border },
  crest: { width: '100%', height: '100%', borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ground },
  storyLabel: { color: colors.muted, fontFamily: font.med, fontSize: 10.5, maxWidth: 60 },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 13, gap: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  compRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compDot: { width: 8, height: 8, borderRadius: 4 },
  compName: { color: colors.text, fontFamily: font.displayBold, fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase' },
  kick: { color: colors.muted, fontFamily: font.semi, fontSize: 12 },

  match: {
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: { alignItems: 'center', gap: 8, width: 108 },
  tname: { color: colors.text, fontFamily: font.semi, fontSize: 12, textAlign: 'center' },
  time: { color: colors.text, fontFamily: font.display, fontSize: 20 },
  vs: { color: colors.muted2, fontFamily: font.displaySemi, fontSize: 10, letterSpacing: 2 },

  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12, borderRadius: 12 },
  ctaTxt: { color: colors.onAccent, fontFamily: font.bold, fontSize: 13.5 },

  state: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 40 },
  stateSub: { color: colors.muted, fontFamily: font.med, fontSize: 12.5, textAlign: 'center' },
  stateHint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center' },
  retry: { marginTop: 6, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18 },
  retryTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 13 },
});
