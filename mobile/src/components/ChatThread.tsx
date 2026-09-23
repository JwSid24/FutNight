import { Feather } from '@expo/vector-icons';
import type { HubConnection } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { connectChat, getChat, sendMessage, type ChatMessageDto } from '@/api/chat';
import { formatKickoff, shortTeam } from '@/api/format';
import type { EventDto } from '@/api/events';
import { useAuth } from '@/auth/AuthContext';
import { colors, font, radius } from '@/theme/theme';

export function ChatThread({ event, onBack }: { event: EventDto; onBack: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [canSend, setCanSend] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const append = (m: ChatMessageDto) =>
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));

  useEffect(() => {
    let alive = true;
    let conn: HubConnection | null = null;

    (async () => {
      try {
        const state = await getChat(event.id);
        if (!alive) return;
        if (!state) {
          setError('Du har ikke adgang til denne chat.');
          setLoading(false);
          return;
        }
        setMessages(state.messages);
        setCanSend(state.canSend);
        setLoading(false);
        conn = connectChat(event.id, (m) => alive && append(m));
      } catch (e) {
        if (alive) {
          setError((e as Error).message);
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
      conn?.stop();
    };
  }, [event.id]);

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError(null);
    try {
      const msg = await sendMessage(event.id, t);
      append(msg);
      setText('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={8} style={styles.back}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {shortTeam(event.homeTeam)} — {shortTeam(event.awayTeam)}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {event.competitionName} · {formatKickoff(event.utcKickoff)}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.length === 0 && (
            <Text style={styles.empty}>Ingen beskeder endnu — sig hej og aftal stedet 👋</Text>
          )}
          {messages.map((m) => {
            const mine = m.senderUserId === user?.id;
            return (
              <View key={m.id} style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowThem]}>
                <View style={[styles.bubble, mine ? styles.mine : styles.them]}>
                  {!mine && <Text style={styles.author}>{m.senderName}</Text>}
                  <Text style={[styles.msg, mine && { color: colors.onAccent }]}>{m.text}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.ttl}>Beskeder forsvinder 24 timer efter de er sendt.</Text>
        </ScrollView>
      )}

      {error && <Text style={styles.err}>{error}</Text>}

      {!loading && (
        canSend ? (
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Skriv en besked…"
              placeholderTextColor={colors.muted2}
              style={styles.input}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Pressable style={styles.sendBtn} onPress={send} disabled={sending}>
              {sending ? (
                <ActivityIndicator color={colors.onAccent} size="small" />
              ) : (
                <Feather name="send" size={18} color={colors.onAccent} />
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.closed}>
            <Feather name="lock" size={14} color={colors.muted} />
            <Text style={styles.closedTxt}>Chatten er lukket (24 timer efter kampen).</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontFamily: font.displayBold, fontSize: 16 },
  sub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  messages: { padding: 14, gap: 8, paddingBottom: 20 },
  empty: { color: colors.muted, fontFamily: font.med, fontSize: 13, textAlign: 'center', marginTop: 40 },
  bubbleRow: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowThem: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingVertical: 9, paddingHorizontal: 12 },
  them: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 14, borderBottomLeftRadius: 4 },
  mine: { backgroundColor: colors.accent, borderRadius: 14, borderBottomRightRadius: 4 },
  author: { color: colors.floodlight, fontFamily: font.displayBold, fontSize: 11, marginBottom: 2 },
  msg: { color: colors.text, fontFamily: font.med, fontSize: 14, lineHeight: 19 },
  ttl: { color: colors.muted2, fontFamily: font.med, fontSize: 11, textAlign: 'center', marginTop: 12 },

  err: { color: colors.live, fontFamily: font.semi, fontSize: 12.5, textAlign: 'center', paddingHorizontal: 14, paddingBottom: 6 },

  inputRow: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.borderSoft },
  input: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 16, color: colors.text, fontFamily: font.med, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  closed: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderTopWidth: 1, borderTopColor: colors.borderSoft },
  closedTxt: { color: colors.muted, fontFamily: font.semi, fontSize: 12.5 },
});
