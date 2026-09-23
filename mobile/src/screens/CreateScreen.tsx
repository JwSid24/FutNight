import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { createEvent, type EventDto } from '@/api/events';
import type { FixtureDto } from '@/api/fixtures';
import { formatKickoff, shortTeam, teamAbbr } from '@/api/format';
import { Crest, SectionLabel } from '@/components/ui';
import { metaFor } from '@/data/competitions';
import { colors, font, gradient, radius } from '@/theme/theme';

export function CreateScreen({ fixture }: { fixture: FixtureDto | null }) {
  const [mode, setMode] = useState<'home' | 'tbd'>('home');
  const [venueText, setVenueText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<EventDto | null>(null);
  const [copied, setCopied] = useState(false);

  const meta = fixture ? metaFor(fixture.competitionCode) : null;

  const submit = async () => {
    if (!fixture) return;
    setError(null);
    setBusy(true);
    try {
      const ev = await createEvent(
        fixture.id,
        mode === 'home' ? 'HostHome' : 'ToBeDecided',
        mode === 'home' ? venueText : undefined,
      );
      setCreated(ev);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <SectionLabel label="Opret event" />

      <View style={{ gap: 8 }}>
        <Text style={styles.label}>Kamp</Text>
        {fixture && meta ? (
          <View style={styles.picker}>
            <Crest abbr={teamAbbr(fixture.homeTeam)} color={meta.color} size={38} round={11} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickTitle}>
                {shortTeam(fixture.homeTeam)} — {shortTeam(fixture.awayTeam)}
              </Text>
              <Text style={styles.pickSub}>
                {fixture.competitionName} · {formatKickoff(fixture.utcKickoff)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </View>
        ) : (
          <View style={[styles.picker, styles.pickerEmpty]}>
            <Feather name="calendar" size={20} color={colors.muted} />
            <Text style={styles.emptyTxt}>Ingen kamp valgt — vælg en fra Hjem eller Kampe</Text>
          </View>
        )}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={styles.label}>Sted-status</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable style={[styles.vopt, mode === 'home' && styles.voptSel]} onPress={() => setMode('home')}>
            <Text style={styles.voptIc}>🏠</Text>
            <Text style={styles.voptTitle}>Jeg lægger hus til</Text>
            <Text style={styles.voptSub}>Du er host. Din adresse vises til gæster.</Text>
          </Pressable>
          <Pressable style={[styles.vopt, mode === 'tbd' && styles.voptSelAmber]} onPress={() => setMode('tbd')}>
            <Text style={styles.voptIc}>📍</Text>
            <Text style={styles.voptTitle}>Sted aftales</Text>
            <Text style={styles.voptSub}>I finder en bar sammen i chatten.</Text>
          </Pressable>
        </View>

        {mode === 'home' && (
          <TextInput
            value={venueText}
            onChangeText={setVenueText}
            placeholder="Adresse (valgfri) — fx Nørrebrogade 12"
            placeholderTextColor={colors.muted2}
            style={styles.input}
          />
        )}
      </View>

      {error && <Text style={styles.err}>{error}</Text>}

      {!created ? (
        <Pressable disabled={!fixture || busy} onPress={submit} style={!fixture || busy ? { opacity: 0.5 } : undefined}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createBtn}>
            {busy ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.createTxt}>Opret & få delbart link</Text>
            )}
          </LinearGradient>
        </Pressable>
      ) : (
        <View style={{ gap: 10 }}>
          <View style={styles.okRow}>
            <Feather name="check-circle" size={18} color={colors.accent} />
            <Text style={styles.okTxt}>Event oprettet!</Text>
          </View>
          <View style={styles.share}>
            <Feather name="link" size={18} color={colors.accent} />
            <Text style={styles.shareCode} numberOfLines={1}>futnight.app/e/{created.inviteToken}</Text>
            <Pressable style={styles.copy} onPress={() => setCopied(true)}>
              <Text style={styles.copyTxt}>{copied ? 'Kopieret ✓' : 'Kopiér'}</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.hint}>Gæster åbner linket og svarer ja/nej uden konto (#5 + #6).</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 16, paddingBottom: 120 },
  label: { color: colors.muted, fontFamily: font.displayBold, fontSize: 11.5, letterSpacing: 1.1, textTransform: 'uppercase' },
  picker: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 13 },
  pickerEmpty: { borderStyle: 'dashed' },
  emptyTxt: { flex: 1, color: colors.muted, fontFamily: font.med, fontSize: 12.5 },
  pickTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 15 },
  pickSub: { color: colors.muted, fontFamily: font.med, fontSize: 12, marginTop: 2 },
  vopt: { flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, padding: 14, gap: 6 },
  voptSel: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  voptSelAmber: { borderColor: colors.floodlight, backgroundColor: colors.floodlightSoft },
  voptIc: { fontSize: 22 },
  voptTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 15 },
  voptSub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, lineHeight: 16 },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: colors.text,
    fontFamily: font.med,
    fontSize: 14.5,
  },
  err: { color: colors.live, fontFamily: font.semi, fontSize: 12.5 },
  createBtn: { paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  createTxt: { color: colors.onAccent, fontFamily: font.display, fontSize: 16, letterSpacing: 0.6, textTransform: 'uppercase' },
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  okTxt: { color: colors.accent, fontFamily: font.displayBold, fontSize: 15 },
  share: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.accent, borderStyle: 'dashed', borderRadius: radius.sm, padding: 12 },
  shareCode: { flex: 1, color: colors.accent, fontFamily: font.semi, fontSize: 12 },
  copy: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 11 },
  copyTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 12 },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center' },
});
