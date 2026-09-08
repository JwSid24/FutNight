import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Chip, Crest, T } from '@/components/ui';
import type { FeedEvent } from '@/data/mock';
import { colors, font, gradient, radius } from '@/theme/theme';

export function EventCard({ event, onOpenChat }: { event: FeedEvent; onOpenChat: () => void }) {
  const [coming, setComing] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <View style={styles.card}>
      {/* Head */}
      <View style={styles.head}>
        <Avatar initials={event.hostInitials} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hostName}>{event.host}</Text>
          <Text style={styles.hostSub}>{event.timeAgo}</Text>
        </View>
        <View style={styles.hostTag}>
          <Text style={styles.hostTagTxt}>{event.mode === 'home' ? '🏠 Lægger hus til' : '📍 Sted aftales'}</Text>
        </View>
      </View>

      {/* Match */}
      <View style={[styles.match, event.cl && styles.matchCl]}>
        <Text style={[styles.comp, event.cl && { color: '#7fc0f5' }]}>{event.competition}</Text>
        <View style={styles.team}>
          <Crest abbr={event.home.abbr} color={event.home.color} textDark={event.home.textDark} />
          <Text style={styles.tname}>{event.home.name}</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 3 }}>
          <Text style={styles.time}>{event.time}</Text>
          <Text style={styles.day}>{event.day}</Text>
        </View>
        <View style={styles.team}>
          <Crest abbr={event.away.abbr} color={event.away.color} textDark={event.away.textDark} />
          <Text style={styles.tname}>{event.away.name}</Text>
        </View>
      </View>

      {/* Venue */}
      <View style={{ paddingHorizontal: 13, paddingTop: 11 }}>
        <Chip label={event.venue} tone={event.mode === 'home' ? 'home' : 'tbd'} />
      </View>

      {/* Attendees */}
      <View style={styles.attend}>
        <View style={{ flexDirection: 'row' }}>
          {event.attendees.map((a, i) => (
            <View key={i} style={[styles.stackA, { backgroundColor: a.color, marginLeft: i === 0 ? 0 : -9 }]}>
              <Text style={styles.stackTxt}>{a.initials}</Text>
            </View>
          ))}
          <View style={[styles.stackA, { backgroundColor: colors.accent, marginLeft: -9 }]}>
            <Text style={styles.stackTxt}>+{event.extra}</Text>
          </View>
        </View>
        <T style={{ color: colors.muted, fontSize: 12 }}>{event.summary}</T>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={{ flex: 1 }} onPress={() => setComing((v) => !v)}>
          {coming ? (
            <View style={[styles.btn, styles.btnOn]}>
              <Feather name="check" size={15} color={colors.accent} />
              <Text style={[styles.btnTxt, { color: colors.accent }]}>Du kommer!</Text>
            </View>
          ) : (
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
              <Text style={[styles.btnTxt, { color: colors.onAccent }]}>Jeg kommer</Text>
            </LinearGradient>
          )}
        </Pressable>
        <Pressable style={[styles.btn, styles.btnBlue]} onPress={onOpenChat}>
          <Feather name="message-circle" size={15} color="#bfe0fb" />
          <Text style={[styles.btnTxt, { color: '#bfe0fb' }]}>Chat</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setShared((v) => !v)}>
          <Feather name={shared ? 'check' : 'share-2'} size={15} color={colors.text} />
          <Text style={[styles.btnTxt, { color: colors.text }]}>{shared ? 'Kopieret' : 'Del'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  hostName: { color: colors.text, fontFamily: font.bold, fontSize: 14 },
  hostSub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5 },
  hostTag: { backgroundColor: colors.floodlightSoft, borderColor: colors.floodlightBorder, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 8, borderRadius: radius.pill },
  hostTagTxt: { color: colors.floodlight, fontFamily: font.displayBold, fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase' },

  match: { marginHorizontal: 13, borderRadius: radius.sm, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchCl: { borderColor: colors.blueBorder },
  comp: { position: 'absolute', top: 8, alignSelf: 'center', color: colors.muted2, fontFamily: font.displaySemi, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  team: { alignItems: 'center', gap: 7, width: 96 },
  tname: { color: colors.text, fontFamily: font.semi, fontSize: 11.5, textAlign: 'center' },
  time: { color: colors.text, fontFamily: font.display, fontSize: 19 },
  day: { color: colors.muted, fontFamily: font.med, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },

  attend: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingTop: 10, paddingBottom: 12 },
  stackA: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  stackTxt: { fontFamily: font.displayBold, fontSize: 10.5, color: colors.onAccent },

  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 13, paddingBottom: 13 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, borderRadius: 12 },
  btnTxt: { fontFamily: font.bold, fontSize: 13 },
  btnOn: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder },
  btnBlue: { backgroundColor: colors.blueSoft, borderWidth: 1, borderColor: colors.blueBorder },
  btnGhost: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
});
