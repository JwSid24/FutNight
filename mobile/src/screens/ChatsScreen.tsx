import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getMyEvents, type EventDto } from '@/api/events';
import { formatKickoff, shortTeam } from '@/api/format';
import { ChatThread } from '@/components/ChatThread';
import { SectionLabel } from '@/components/ui';
import { metaFor } from '@/data/competitions';
import { colors, font, radius } from '@/theme/theme';

export function ChatsScreen() {
  const [events, setEvents] = useState<EventDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    setEvents(null);
    getMyEvents()
      .then((e) => alive && setEvents(e))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [reload]);

  const openEvent = events?.find((e) => e.id === openId) ?? null;
  if (openEvent) return <ChatThread event={openEvent} onBack={() => setOpenId(null)} />;

  if (error) {
    return (
      <View style={styles.center}>
        <Feather name="wifi-off" size={24} color={colors.muted} />
        <Text style={styles.sub}>{error}</Text>
        <Pressable style={styles.retry} onPress={() => setReload((k) => k + 1)}>
          <Text style={styles.retryTxt}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  if (!events) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Feather name="message-circle" size={28} color={colors.accent} />
        </View>
        <Text style={styles.title}>Ingen chats endnu</Text>
        <Text style={styles.sub}>Opret et event — så får det en chat, hvor I aftaler sted og tid.</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <SectionLabel label="Dine event-chats" />
      {events.map((ev) => {
        const meta = metaFor(ev.competitionCode);
        return (
          <Pressable key={ev.id} style={styles.row} onPress={() => setOpenId(ev.id)}>
            <View style={[styles.dot, { backgroundColor: meta.color }]}>
              <Feather name="message-circle" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {shortTeam(ev.homeTeam)} — {shortTeam(ev.awayTeam)}
              </Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {ev.competitionName} · {formatKickoff(ev.utcKickoff)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 36, paddingBottom: 60 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontFamily: font.display, fontSize: 20 },
  sub: { color: colors.muted, fontFamily: font.med, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  retry: { marginTop: 4, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18 },
  retryTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 13 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12 },
  dot: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 14.5 },
  rowSub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, marginTop: 1 },
});
