import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/AppBar';
import { AppDrawer, type NavKey } from '@/components/AppDrawer';
import { BottomTabs, type TabKey } from '@/components/BottomTabs';
import { ChatsScreen } from '@/screens/ChatsScreen';
import { CreateScreen } from '@/screens/CreateScreen';
import { FeedScreen } from '@/screens/FeedScreen';
import { FixturesScreen } from '@/screens/FixturesScreen';
import { GuestScreen } from '@/screens/GuestScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { colors } from '@/theme/theme';

const TAB_KEYS: TabKey[] = ['home', 'kampe', 'opret', 'chats', 'profil'];

export default function App() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<NavKey>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeTab: TabKey = TAB_KEYS.includes(view as TabKey) ? (view as TabKey) : 'home';

  return (
    <View style={styles.root}>
      <AppBar onMenu={() => setDrawerOpen(true)} topInset={insets.top} />

      <View style={{ flex: 1 }}>
        {view === 'home' && <FeedScreen onOpenChat={() => setView('chats')} />}
        {view === 'kampe' && <FixturesScreen onCreate={() => setView('opret')} />}
        {view === 'opret' && <CreateScreen />}
        {view === 'chats' && <ChatsScreen />}
        {view === 'profil' && <ProfileScreen />}
        {view === 'guest' && <GuestScreen onBack={() => setView('home')} />}
      </View>

      <BottomTabs active={activeTab} onChange={setView} bottomInset={insets.bottom} />

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(k: NavKey) => {
          setView(k);
          setDrawerOpen(false);
        }}
        topInset={insets.top}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
});
