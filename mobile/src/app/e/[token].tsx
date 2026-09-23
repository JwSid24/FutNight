import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEventByToken, submitRsvp, type GuestEventDto } from '@/api/events';
import { GuestScreen } from '@/screens/GuestScreen';
import { colors, font } from '@/theme/theme';

type Phase = 'loading' | 'ready' | 'notfound' | 'error';

export default function GuestRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const insets = useSafeAreaInsets();

  const [event, setEvent] = useState<GuestEventDto | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answered, setAnswered] = useState<'Yes' | 'No' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setPhase('loading');
    getEventByToken(token)
      .then((ev) => {
        if (!alive) return;
        if (ev) {
          setEvent(ev);
          setPhase('ready');
        } else {
          setPhase('notfound');
        }
      })
      .catch((e: Error) => {
        if (!alive) return;
        setLoadError(e.message);
        setPhase('error');
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const onSubmit = async (name: string, answer: 'Yes' | 'No') => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const updated = await submitRsvp(token, name, answer);
      setEvent(updated);
      setAnswered(answer);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === 'loading') {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (phase === 'notfound' || phase === 'error') {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Feather name="link-2" size={26} color={colors.muted} />
        <Text style={styles.msg}>
          {phase === 'notfound' ? 'Linket findes ikke eller er udløbet.' : loadError ?? 'Noget gik galt.'}
        </Text>
      </View>
    );
  }

  return (
    <GuestScreen event={event!} onSubmit={onSubmit} submitting={submitting} answered={answered} error={submitError} />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.ground, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  msg: { color: colors.muted, fontFamily: font.med, fontSize: 13.5, textAlign: 'center' },
});
