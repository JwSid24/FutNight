import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui';
import { colors, font } from '@/theme/theme';

export type NavKey = 'home' | 'kampe' | 'opret' | 'chats' | 'profil' | 'guest';

const WIDTH = 290;

const items: { icon: keyof typeof Feather.glyphMap; label: string; tag?: string; go?: NavKey }[] = [
  { icon: 'home', label: 'Feed', tag: 'Events', go: 'home' },
  { icon: 'calendar', label: 'Kommende kampe', tag: '#2', go: 'kampe' },
  { icon: 'star', label: 'Favorithold', tag: '#2', go: 'profil' },
  { icon: 'check-circle', label: 'Mine events', tag: 'Host', go: 'home' },
  { icon: 'link', label: 'Gæste-visning', tag: '#6', go: 'guest' },
  { icon: 'settings', label: 'Indstillinger' },
];

export function AppDrawer({
  open,
  onClose,
  onNavigate,
  topInset,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (k: NavKey) => void;
  topInset: number;
}) {
  const x = useRef(new Animated.Value(-WIDTH - 20)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(x, { toValue: open ? 0 : -WIDTH - 20, duration: 260, useNativeDriver: true }),
      Animated.timing(fade, { toValue: open ? 1 : 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [open, x, fade]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View style={[styles.scrim, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { paddingTop: topInset + 20, transform: [{ translateX: x }] }]}>
        <View style={styles.head}>
          <Avatar initials="JW" size={44} />
          <View>
            <Text style={styles.name}>Jwan</Text>
            <Text style={styles.sub}>Arrangør · logget ind</Text>
          </View>
        </View>

        {items.map((it) => (
          <Pressable key={it.label} style={styles.item} onPress={() => (it.go ? onNavigate(it.go) : onClose())}>
            <Feather name={it.icon} size={19} color={colors.accent} />
            <Text style={styles.itemTxt}>{it.label}</Text>
            {it.tag ? (
              <View style={styles.tag}>
                <Text style={styles.tagTxt}>{it.tag}</Text>
              </View>
            ) : null}
          </Pressable>
        ))}

        <Pressable style={[styles.item, { marginTop: 'auto' }]} onPress={onClose}>
          <Feather name="log-out" size={19} color={colors.live} />
          <Text style={[styles.itemTxt, { color: colors.live }]}>Log ud</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(3,10,7,0.6)' },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: WIDTH,
    backgroundColor: '#0C1F27',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 4,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingBottom: 14, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { color: colors.text, fontFamily: font.display, fontSize: 17 },
  sub: { color: colors.muted, fontFamily: font.med, fontSize: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  itemTxt: { color: colors.text, fontFamily: font.semi, fontSize: 14.5 },
  tag: { marginLeft: 'auto', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 999 },
  tagTxt: { color: colors.muted2, fontFamily: font.displayBold, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
});
