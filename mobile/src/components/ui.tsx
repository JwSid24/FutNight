import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';

import { colors, font, gradient, radius } from '@/theme/theme';

export function T({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[{ color: colors.text, fontFamily: font.med }, style]} />;
}

export function Avatar({
  initials,
  size = 38,
  style,
}: {
  initials: string;
  size?: number;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}>
      <Text style={{ fontFamily: font.displayBold, color: colors.onAccent, fontSize: size * 0.4 }}>{initials}</Text>
    </LinearGradient>
  );
}

export function Crest({
  abbr,
  color,
  size = 44,
  round = 13,
  textDark = false,
}: {
  abbr: string;
  color: string;
  size?: number;
  round?: number;
  textDark?: boolean;
}) {
  return (
    <View style={{ width: size, height: size, borderRadius: round, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: font.display, color: textDark ? '#06130c' : '#fff', fontSize: size * 0.32, letterSpacing: 0.3 }}>
        {abbr}
      </Text>
    </View>
  );
}

const chipTones = {
  home: { color: colors.green, bg: 'rgba(51,209,122,0.10)', border: 'rgba(51,209,122,0.30)' },
  tbd: { color: colors.floodlight, bg: colors.floodlightSoft, border: colors.floodlightBorder },
  cl: { color: '#7fc0f5', bg: colors.blueSoft, border: colors.blueBorder },
} as const;

export function Chip({ label, tone = 'home' }: { label: string; tone?: keyof typeof chipTones }) {
  const t = chipTones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Text style={{ color: t.color, fontFamily: font.semi, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function SectionLabel({ label, tone }: { label: string; tone?: 'cl' }) {
  const color = tone === 'cl' ? '#7fc0f5' : colors.muted;
  return (
    <View style={styles.sectionLabel}>
      <Text style={{ color, fontFamily: font.displayBold, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <View style={[styles.line, tone === 'cl' && { backgroundColor: colors.blueBorder }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 2, paddingTop: 2 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
});
