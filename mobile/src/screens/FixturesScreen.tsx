import { Feather } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Crest, SectionLabel } from '@/components/ui';
import { fixtureGroups } from '@/data/mock';
import { colors, font, radius } from '@/theme/theme';

export function FixturesScreen({ onCreate }: { onCreate: () => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {fixtureGroups.map((g) => (
        <Fragment key={g.league}>
          <SectionLabel label={g.league} tone={g.cl ? 'cl' : undefined} />
          {g.matches.map((m) => (
            <View key={m.title} style={[styles.fix, g.cl && { borderColor: colors.blueBorder }]}>
              <Crest abbr={m.abbr} color={m.color} size={34} round={10} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{m.title}</Text>
                <Text style={styles.when}>{m.when}</Text>
              </View>
              <Pressable style={styles.go} onPress={onCreate}>
                <Feather name="plus" size={13} color={colors.accent} />
                <Text style={styles.goTxt}>Event</Text>
              </Pressable>
            </View>
          ))}
        </Fragment>
      ))}
      <Text style={styles.hint}>Fra GET /api/fixtures — 1941 kampe cachet i backend.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12, paddingBottom: 120 },
  fix: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 11 },
  title: { color: colors.text, fontFamily: font.displayBold, fontSize: 14, letterSpacing: 0.2 },
  when: { color: colors.muted, fontFamily: font.med, fontSize: 11.5, marginTop: 1 },
  go: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11 },
  goTxt: { color: colors.accent, fontFamily: font.bold, fontSize: 12 },
  hint: { color: colors.muted2, fontFamily: font.med, fontSize: 12, textAlign: 'center', paddingTop: 6 },
});
