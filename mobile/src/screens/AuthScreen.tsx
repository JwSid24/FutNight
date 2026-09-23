import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/AuthContext';
import { colors, font, gradient, radius } from '@/theme/theme';

function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted2} style={styles.input} {...props} />
    </View>
  );
}

export function AuthScreen() {
  const { login, register, notice } = useAuth();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(email.trim(), password, displayName.trim());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.brand}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dot} />
          <Text style={styles.fut}>FUT</Text>
          <Text style={styles.night}>NIGHT</Text>
        </View>
        <Text style={styles.tagline}>Saml vennerne om kampen</Text>

        <View style={styles.card}>
          <Text style={styles.h}>{mode === 'login' ? 'Log ind' : 'Opret konto'}</Text>

          {notice && !error && (
            <View style={styles.notice}>
              <Feather name="clock" size={15} color={colors.floodlight} />
              <Text style={styles.noticeTxt}>{notice}</Text>
            </View>
          )}

          {mode === 'register' && (
            <Field label="Navn" value={displayName} onChangeText={setDisplayName} placeholder="Dit navn" autoCapitalize="words" />
          )}
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="dig@mail.dk"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field label="Adgangskode" value={password} onChangeText={setPassword} placeholder="mindst 6 tegn" secureTextEntry />

          {error && <Text style={styles.err}>{error}</Text>}

          <Pressable onPress={submit} disabled={busy} style={busy ? { opacity: 0.7 } : undefined}>
            <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
              {busy ? (
                <ActivityIndicator color={colors.onAccent} />
              ) : (
                <Text style={styles.btnTxt}>{mode === 'login' ? 'Log ind' : 'Opret konto'}</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            style={styles.toggle}>
            <Text style={styles.toggleTxt}>
              {mode === 'login' ? 'Ny her? Opret en konto' : 'Har du allerede en konto? Log ind'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
  content: { paddingHorizontal: 22, alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  fut: { fontFamily: font.display, fontSize: 30, color: colors.green, letterSpacing: 0.5 },
  night: { fontFamily: font.display, fontSize: 30, color: colors.blue, letterSpacing: 0.5 },
  tagline: { color: colors.muted, fontFamily: font.med, fontSize: 13.5, marginTop: 6, marginBottom: 28 },

  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    gap: 14,
    maxWidth: 420,
    width: '100%',
  },
  h: { color: colors.text, fontFamily: font.display, fontSize: 22, marginBottom: 2 },
  field: { gap: 6 },
  label: { color: colors.muted, fontFamily: font.displayBold, fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: colors.text,
    fontFamily: font.med,
    fontSize: 15,
  },
  err: { color: colors.live, fontFamily: font.semi, fontSize: 12.5 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.floodlightSoft, borderWidth: 1, borderColor: colors.floodlightBorder, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12 },
  noticeTxt: { flex: 1, color: colors.floodlight, fontFamily: font.semi, fontSize: 12.5 },
  btn: { paddingVertical: 14, borderRadius: 13, alignItems: 'center', marginTop: 4 },
  btnTxt: { color: colors.onAccent, fontFamily: font.display, fontSize: 16, letterSpacing: 0.5, textTransform: 'uppercase' },
  toggle: { alignItems: 'center', paddingTop: 4 },
  toggleTxt: { color: colors.accent, fontFamily: font.semi, fontSize: 13 },
});
