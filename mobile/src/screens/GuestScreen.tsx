import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip, Crest } from '@/components/ui';
import { colors, font, gradient, radius } from '@/theme/theme';

export function GuestScreen({ onBack }: { onBack: () => void }) {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Pressable style={styles.back} onPress={onBack}>
        <Feather name="arrow-left" size={16} color={colors.accent} />
        <Text style={styles.backTxt}>Sådan ser gæsten linket</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={{ alignItems: 'center', paddingTop: 14, paddingHorizontal: 13 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dot} />
            <Text style={styles.fut}>FUT</Text>
            <Text style={styles.night}>NIGHT</Text>
          </View>
          <Text style={styles.invite}>Jwan har inviteret dig til at se kampen</Text>
        </View>

        <View style={styles.match}>
          <Text style={styles.comp}>Premier League</Text>
          <View style={styles.team}>
            <Crest abbr="CRY" color="#1B458F" />
            <Text style={styles.tname}>Crystal Palace</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Text style={styles.time}>21:00</Text>
            <Text style={styles.day}>i aften</Text>
          </View>
          <View style={styles.team}>
            <Crest abbr="MCI" color="#6CABDD" textDark />
            <Text style={styles.tname}>Man City</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 13, paddingTop: 11 }}>
          <Chip label="🏠 Hos Jwan · Nørrebrogade 12" tone="home" />
        </View>

        <View style={styles.actions}>
          <Pressable style={{ flex: 1 }} onPress={() => setAnswer('yes')}>
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
              <Text style={[styles.btnTxt, { color: colors.onAccent }]}>{answer === 'yes' ? '✔ Du kommer!' : '✔ Ja, jeg kommer'}</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnGhost, { flex: 1 }]} onPress={() => setAnswer('no')}>
            <Text style={[styles.btnTxt, { color: answer === 'no' ? colors.live : colors.text }]}>Nej tak</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>Ingen konto nødvendig — bare svar. (#6)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  backTxt: { color: colors.accent, fontFamily: font.displayBold, fontSize: 13, letterSpacing: 0.6, textTransform: 'uppercase' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, overflow: 'hidden' },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  fut: { fontFamily: font.display, fontSize: 20, color: colors.green },
  night: { fontFamily: font.display, fontSize: 20, color: colors.blue },
  invite: { color: colors.muted, fontFamily: font.med, fontSize: 12 },
  match: { marginTop: 8, marginHorizontal: 13, borderRadius: radius.sm, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  comp: { position: 'absolute', top: 8, alignSelf: 'center', color: colors.muted2, fontFamily: font.displaySemi, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  team: { alignItems: 'center', gap: 7, width: 96 },
  tname: { color: colors.text, fontFamily: font.semi, fontSize: 11.5, textAlign: 'center' },
  time: { color: colors.text, fontFamily: font.display, fontSize: 19 },
  day: { color: colors.muted, fontFamily: font.med, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: 8, padding: 13 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  btnGhost: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  btnTxt: { fontFamily: font.bold, fontSize: 13 },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center', paddingHorizontal: 13, paddingBottom: 14 },
});
