import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { GuestEventDto } from '@/api/events';
import { formatKickoff, shortTeam, teamAbbr } from '@/api/format';
import { Chip, Crest } from '@/components/ui';
import { metaFor } from '@/data/competitions';
import { colors, font, gradient, radius } from '@/theme/theme';

export function GuestScreen({
  event,
  onSubmit,
  submitting,
  answered,
  error,
}: {
  event: GuestEventDto;
  onSubmit: (name: string, answer: 'Yes' | 'No') => void;
  submitting: boolean;
  answered: 'Yes' | 'No' | null;
  error?: string | null;
}) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const meta = metaFor(event.competitionCode);
  const parts = (formatKickoff(event.utcKickoff) || '').split(' · ');
  const day = parts[0] ?? '';
  const time = parts[1] ?? '';
  const canAnswer = name.trim().length > 0 && !submitting;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.ground }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.brand}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dot} />
        <Text style={styles.fut}>FUT</Text>
        <Text style={styles.night}>NIGHT</Text>
      </View>
      <Text style={styles.invite}>{event.hostName || 'En ven'} har inviteret dig til at se kampen</Text>

      <View style={styles.card}>
        <View style={[styles.match, event.competitionCode === 'CL' && { borderColor: colors.blueBorder }]}>
          <Text style={styles.comp}>{event.competitionName}</Text>
          <View style={styles.team}>
            <Crest abbr={teamAbbr(event.homeTeam)} color={meta.color} />
            <Text style={styles.tname}>{shortTeam(event.homeTeam)}</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Text style={styles.time}>{time || '—'}</Text>
            <Text style={styles.day}>{day}</Text>
          </View>
          <View style={styles.team}>
            <Crest abbr={teamAbbr(event.awayTeam)} color={meta.color} />
            <Text style={styles.tname}>{shortTeam(event.awayTeam)}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 13, paddingTop: 12 }}>
          {event.venueMode === 'HostHome' ? (
            <Chip label={`🏠 ${event.venueText || `Hos ${event.hostName}`}`} tone="home" />
          ) : (
            <Chip label="📍 Sted aftales — I finder en bar" tone="tbd" />
          )}
        </View>

        <View style={styles.comingRow}>
          <Feather name="users" size={14} color={colors.muted} />
          <Text style={styles.comingTxt}>
            {event.comingCount} {event.comingCount === 1 ? 'kommer' : 'kommer'}
          </Text>
        </View>

        {answered ? (
          <View style={styles.answered}>
            <Feather name={answered === 'Yes' ? 'check-circle' : 'x-circle'} size={20} color={answered === 'Yes' ? colors.accent : colors.muted} />
            <Text style={styles.answeredTxt}>
              {answered === 'Yes' ? 'Du er noteret som kommende. Vi ses!' : 'Okay — måske en anden gang.'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 13, paddingTop: 12, gap: 10 }}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Dit navn"
              placeholderTextColor={colors.muted2}
              autoCapitalize="words"
              style={styles.input}
            />
            {error && <Text style={styles.err}>{error}</Text>}
            <View style={styles.actions}>
              <Pressable style={{ flex: 1 }} disabled={!canAnswer} onPress={() => onSubmit(name.trim(), 'Yes')}>
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.btn, !canAnswer && { opacity: 0.5 }]}>
                  {submitting ? (
                    <ActivityIndicator color={colors.onAccent} />
                  ) : (
                    <Text style={[styles.btnTxt, { color: colors.onAccent }]}>✔ Ja, jeg kommer</Text>
                  )}
                </LinearGradient>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnGhost, { flex: 1 }, !canAnswer && { opacity: 0.5 }]}
                disabled={!canAnswer}
                onPress={() => onSubmit(name.trim(), 'No')}>
                <Text style={[styles.btnTxt, { color: colors.text }]}>Nej tak</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.hint}>Ingen konto nødvendig — bare svar.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  dot: { width: 11, height: 11, borderRadius: 5.5 },
  fut: { fontFamily: font.display, fontSize: 26, color: colors.green },
  night: { fontFamily: font.display, fontSize: 26, color: colors.blue },
  invite: { color: colors.muted, fontFamily: font.med, fontSize: 13, textAlign: 'center', marginBottom: 20 },

  card: { alignSelf: 'stretch', maxWidth: 440, width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, paddingBottom: 4, overflow: 'hidden' },
  match: { marginTop: 14, marginHorizontal: 13, borderRadius: radius.sm, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  comp: { position: 'absolute', top: 8, alignSelf: 'center', color: colors.muted2, fontFamily: font.displaySemi, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  team: { alignItems: 'center', gap: 8, width: 104 },
  tname: { color: colors.text, fontFamily: font.semi, fontSize: 12, textAlign: 'center' },
  time: { color: colors.text, fontFamily: font.display, fontSize: 20 },
  day: { color: colors.muted, fontFamily: font.med, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },

  comingRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13, paddingTop: 12 },
  comingTxt: { color: colors.muted, fontFamily: font.semi, fontSize: 12.5 },

  input: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 14, color: colors.text, fontFamily: font.med, fontSize: 15 },
  err: { color: colors.live, fontFamily: font.semi, fontSize: 12.5 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  btnGhost: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  btnTxt: { fontFamily: font.bold, fontSize: 13.5 },

  answered: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 13, marginTop: 12, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: radius.sm, padding: 13 },
  answeredTxt: { flex: 1, color: colors.text, fontFamily: font.semi, fontSize: 13.5 },

  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center', paddingHorizontal: 13, paddingTop: 12, paddingBottom: 12 },
});
