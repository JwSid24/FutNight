import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, SectionLabel } from '@/components/ui';
import { chats } from '@/data/mock';
import { colors, font, radius } from '@/theme/theme';

export function ChatsScreen() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable style={styles.back} onPress={() => setOpen(false)}>
          <Feather name="arrow-left" size={16} color={colors.accent} />
          <Text style={styles.backTxt}>Tilbage · Aftal stedet</Text>
        </Pressable>

        <View style={{ gap: 9 }}>
          <View style={[styles.bubble, styles.them]}>
            <Text style={[styles.author, { color: colors.floodlight }]}>Mikkel</Text>
            <Text style={styles.msg}>Skal vi bare være hos dig Jwan?</Text>
          </View>
          <View style={[styles.bubble, styles.me]}>
            <Text style={[styles.msg, { color: colors.onAccent }]}>Ja! Kom fra 20.30, jeg lægger hus til 🏠</Text>
          </View>
          <View style={[styles.bubble, styles.them]}>
            <Text style={[styles.author, { color: '#8ff2ba' }]}>Sofie</Text>
            <Text style={styles.msg}>Perfekt, jeg tager øl med 🍺</Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.input}>
            <Text style={{ color: colors.muted, fontFamily: font.med, fontSize: 13 }}>Skriv en besked…</Text>
          </View>
          <View style={styles.send}>
            <Feather name="send" size={18} color={colors.onAccent} />
          </View>
        </View>
        <Text style={styles.hint}>Realtid via SignalR (#7)</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <SectionLabel label="Event-chats" />
      {chats.map((c) => (
        <Pressable key={c.id} style={styles.row} onPress={() => setOpen(true)}>
          <Avatar initials={c.initials} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{c.title}</Text>
            <Text style={styles.rowLast} numberOfLines={1}>{c.last}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 5 }}>
            <Text style={styles.when}>{c.when}</Text>
            {c.unread > 0 && (
              <View style={styles.unread}>
                <Text style={styles.unreadTxt}>{c.unread}</Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 11 },
  rowTitle: { color: colors.text, fontFamily: font.bold, fontSize: 14 },
  rowLast: { color: colors.muted, fontFamily: font.med, fontSize: 12, marginTop: 1 },
  when: { color: colors.muted2, fontFamily: font.med, fontSize: 10.5 },
  unread: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  unreadTxt: { color: colors.onAccent, fontFamily: font.displayBold, fontSize: 11 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 2 },
  backTxt: { color: colors.accent, fontFamily: font.displayBold, fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase' },
  bubble: { maxWidth: '80%', paddingVertical: 9, paddingHorizontal: 12 },
  them: { alignSelf: 'flex-start', backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 14, borderBottomLeftRadius: 4 },
  me: { alignSelf: 'flex-end', backgroundColor: colors.accent, borderRadius: 14, borderBottomRightRadius: 4 },
  author: { fontFamily: font.displayBold, fontSize: 11, marginBottom: 2 },
  msg: { color: colors.text, fontFamily: font.med, fontSize: 13.5, lineHeight: 19 },
  inputRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  input: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 14, justifyContent: 'center' },
  send: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center' },
});
