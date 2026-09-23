import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Avatar, Crest, SectionLabel } from '@/components/ui';
import { colors, font, radius } from '@/theme/theme';

export function ProfileScreen() {
  const { user } = useAuth();
  const initials = (user?.displayName || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.head}>
        <Avatar initials={initials} size={82} />
        <Text style={styles.name}>{user?.displayName ?? 'Bruger'}</Text>
        <Text style={styles.handle}>{user?.email ?? 'Arrangør'}</Text>
      </View>

      <View style={styles.stats}>
        {[
          { n: '12', l: 'Events' },
          { n: '3', l: 'Som host' },
          { n: '48', l: 'Venner' },
        ].map((s, i) => (
          <View key={s.l} style={[styles.stat, i > 0 && styles.statBorder]}>
            <Text style={styles.statN}>{s.n}</Text>
            <Text style={styles.statL}>{s.l}</Text>
          </View>
        ))}
      </View>

      <SectionLabel label="Mit favorithold" />
      <View style={styles.item}>
        <Crest abbr="LIV" color="#DA020E" size={40} round={11} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>Liverpool FC</Text>
          <Text style={styles.itemSub}>Premier League · følger kampe</Text>
        </View>
        <Pressable style={styles.chg}>
          <Text style={styles.chgTxt}>Skift</Text>
        </Pressable>
      </View>

      <SectionLabel label="Konto" />
      {[
        { t: 'Login & sikkerhed', s: 'JWT · ASP.NET Identity (#1)' },
        { t: 'Notifikationer', s: 'Når nogen svarer på dit event' },
      ].map((r) => (
        <View key={r.t} style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{r.t}</Text>
            <Text style={styles.itemSub}>{r.s}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  head: { alignItems: 'center', gap: 10, paddingTop: 12, paddingBottom: 4 },
  name: { color: colors.text, fontFamily: font.display, fontSize: 22 },
  handle: { color: colors.muted, fontFamily: font.med, fontSize: 12 },
  stats: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
  stat: { flex: 1, padding: 13, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statN: { color: colors.text, fontFamily: font.display, fontSize: 20 },
  statL: { color: colors.muted, fontFamily: font.med, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 14 },
  itemTitle: { color: colors.text, fontFamily: font.semi, fontSize: 14 },
  itemSub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, marginTop: 1 },
  chg: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  chgTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 12 },
});
