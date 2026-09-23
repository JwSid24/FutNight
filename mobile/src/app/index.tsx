import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { FixtureDto } from '@/api/fixtures';
import { useAuth } from '@/auth/AuthContext';
import { AuthScreen } from '@/screens/AuthScreen';
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
  const { user, isLoading } = useAuth();
  const [view, setView] = useState<NavKey>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<FixtureDto | null>(null);

  const activeTab: TabKey = TAB_KEYS.includes(view as TabKey) ? (view as TabKey) : 'home';

  // Åbn Opret med en konkret kamp (fra Hjem/Kampe).
  const openCreate = (f: FixtureDto) => {
    setSelectedFixture(f);
    setView('opret');
  };

  // Direkte tryk på fanerne — ryd valgt kamp når man går til Opret fra tabbaren.
  const handleTab = (t: TabKey) => {
    if (t === 'opret') setSelectedFixture(null);
    setView(t);
  };

  if (isLoading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <View style={styles.root}>
      <AppBar onMenu={() => setDrawerOpen(true)} topInset={insets.top} />

      <View style={{ flex: 1 }}>
        {view === 'home' && <FeedScreen onCreate={openCreate} />}
        {view === 'kampe' && <FixturesScreen onCreate={openCreate} />}
        {view === 'opret' && <CreateScreen fixture={selectedFixture} />}
        {view === 'chats' && <ChatsScreen />}
        {view === 'profil' && <ProfileScreen />}
        {view === 'guest' && <GuestScreen onBack={() => setView('home')} />}
      </View>

      <BottomTabs active={activeTab} onChange={handleTab} bottomInset={insets.bottom} />

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
  center: { alignItems: 'center', justifyContent: 'center' },
});
