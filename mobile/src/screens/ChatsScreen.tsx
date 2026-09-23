import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, font } from '@/theme/theme';

export function ChatsScreen() {
  return (
    <View style={styles.center}>
      <View style={styles.iconWrap}>
        <Feather name="message-circle" size={30} color={colors.accent} />
      </View>
      <Text style={styles.title}>Ingen chats endnu</Text>
      <Text style={styles.sub}>
        Når du opretter et event eller svarer ja til en invitation, dukker event-chatten op her — så I kan aftale sted og tid.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 36, paddingBottom: 80 },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, fontFamily: font.display, fontSize: 20 },
  sub: { color: colors.muted, fontFamily: font.med, fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
