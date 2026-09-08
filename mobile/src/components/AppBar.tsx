import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, gradient } from '@/theme/theme';

export function AppBar({ onMenu, topInset }: { onMenu: () => void; topInset: number }) {
  return (
    <View style={[styles.bar, { paddingTop: topInset + 10 }]}>
      <Pressable style={styles.iconBtn} onPress={onMenu} hitSlop={8}>
        <Feather name="menu" size={20} color={colors.text} />
      </Pressable>

      <View style={styles.wordmark}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dot} />
        <Text style={styles.fut}>FUT</Text>
        <Text style={styles.night}>NIGHT</Text>
      </View>

      <Pressable style={styles.iconBtn} hitSlop={8}>
        <Feather name="bell" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.ground,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  fut: { fontFamily: font.display, fontSize: 22, color: colors.green, letterSpacing: 0.4 },
  night: { fontFamily: font.display, fontSize: 22, color: colors.blue, letterSpacing: 0.4 },
});
