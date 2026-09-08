import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, gradient } from '@/theme/theme';

export type TabKey = 'home' | 'kampe' | 'opret' | 'chats' | 'profil';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap; center?: boolean }[] = [
  { key: 'home', label: 'Hjem', icon: 'home' },
  { key: 'kampe', label: 'Kampe', icon: 'calendar' },
  { key: 'opret', label: 'Opret', icon: 'plus', center: true },
  { key: 'chats', label: 'Chats', icon: 'message-circle' },
  { key: 'profil', label: 'Profil', icon: 'user' },
];

export function BottomTabs({
  active,
  onChange,
  bottomInset,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  bottomInset: number;
}) {
  return (
    <View style={[styles.bar, { paddingBottom: bottomInset + 10 }]}>
      {TABS.map((t) => {
        const isActive = active === t.key;
        if (t.center) {
          return (
            <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)}>
              <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.plus}>
                <Feather name="plus" size={22} color={colors.onAccent} />
              </LinearGradient>
              <Text style={[styles.label, { color: colors.muted2 }]}>{t.label}</Text>
            </Pressable>
          );
        }
        const color = isActive ? colors.accent : colors.muted2;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)}>
            <Feather name={t.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.ground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontFamily: font.semi, fontSize: 10 },
  plus: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
});
