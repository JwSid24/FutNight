import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Crest, SectionLabel } from '@/components/ui';
import { colors, font, gradient, radius } from '@/theme/theme';

export function CreateScreen() {
  const [mode, setMode] = useState<'home' | 'tbd'>('home');
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <SectionLabel label="Opret event" />

      <View style={{ gap: 8 }}>
        <Text style={styles.label}>Kamp</Text>
        <View style={styles.picker}>
          <Crest abbr="CRY" color="#1B458F" size={38} round={11} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pickTitle}>Crystal Palace — Man City</Text>
            <Text style={styles.pickSub}>Premier League · i aften 21:00</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </View>
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
      </View>

      <Pressable onPress={() => setCreated(true)}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createBtn}>
          <Text style={styles.createTxt}>Opret & få delbart link</Text>
        </LinearGradient>
      </Pressable>

      {created && (
        <View style={styles.share}>
          <Feather name="link" size={18} color={colors.accent} />
          <Text style={styles.shareCode} numberOfLines={1}>futnight.app/e/9fA2-crys-mci</Text>
          <Pressable style={styles.copy} onPress={() => setCopied(true)}>
            <Text style={styles.copyTxt}>{copied ? 'Kopieret ✓' : 'Kopiér'}</Text>
          </Pressable>
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
  pickTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 15 },
  pickSub: { color: colors.muted, fontFamily: font.med, fontSize: 12, marginTop: 2 },
  vopt: { flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, padding: 14, gap: 6 },
  voptSel: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  voptSelAmber: { borderColor: colors.floodlight, backgroundColor: colors.floodlightSoft },
  voptIc: { fontSize: 22 },
  voptTitle: { color: colors.text, fontFamily: font.displayBold, fontSize: 15 },
  voptSub: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, lineHeight: 16 },
  createBtn: { paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  createTxt: { color: colors.onAccent, fontFamily: font.display, fontSize: 16, letterSpacing: 0.6, textTransform: 'uppercase' },
  share: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.accent, borderStyle: 'dashed', borderRadius: radius.sm, padding: 12 },
  shareCode: { flex: 1, color: colors.accent, fontFamily: font.semi, fontSize: 12 },
  copy: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 11 },
  copyTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 12 },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center' },
});
