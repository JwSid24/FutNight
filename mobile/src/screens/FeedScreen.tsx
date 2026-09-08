import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EventCard } from '@/components/EventCard';
import { events, favoriteTeams } from '@/data/mock';
import { colors, font, gradient } from '@/theme/theme';

function Story({ abbr, name, color, textDark }: { abbr: string; name: string; color: string; textDark?: boolean }) {
  return (
    <View style={styles.story}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.ring}>
        <View style={[styles.crest, { backgroundColor: color }]}>
          <Text style={{ fontFamily: font.display, fontSize: 14, color: textDark ? '#06130c' : '#fff' }}>{abbr}</Text>
        </View>
      </LinearGradient>
      <Text style={styles.storyLabel} numberOfLines={1}>{name}</Text>
    </View>
  );
}

export function FeedScreen({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stories}>
        <View style={styles.story}>
          <View style={[styles.ring, styles.addRing]}>
            <View style={[styles.crest, { backgroundColor: colors.surface2 }]}>
              <Feather name="plus" size={22} color={colors.accent} />
            </View>
          </View>
          <Text style={styles.storyLabel}>Følg hold</Text>
        </View>
        {favoriteTeams.map((t) => (
          <Story key={t.abbr} abbr={t.abbr} name={t.name} color={t.color} textDark={t.textDark} />
        ))}
      </ScrollView>

      {events.map((e) => (
        <EventCard key={e.id} event={e} onOpenChat={onOpenChat} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14, paddingBottom: 120 },
  stories: { gap: 12, paddingVertical: 2, paddingRight: 8 },
  story: { width: 60, alignItems: 'center', gap: 6 },
  ring: { width: 56, height: 56, borderRadius: 28, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
  addRing: { backgroundColor: colors.border },
  crest: { width: '100%', height: '100%', borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ground },
  storyLabel: { color: colors.muted, fontFamily: font.med, fontSize: 10.5, maxWidth: 60 },
});
