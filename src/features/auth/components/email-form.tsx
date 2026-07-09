import { type JSX } from 'react';
import { View } from 'react-native';
import { AppButton, AppInput, AppText, Card } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { useEmailLogin } from '../hooks/use-email-login';
import { BrandLogo } from './brand-logo';

export function EmailForm(): JSX.Element {
  const { spacing } = useTheme();
  const { email, setEmail, error, submitting, submit } = useEmailLogin();

  return (
    <Card style={{ alignItems: 'center', gap: spacing[3] }}>
      <BrandLogo />
      <AppText variant="h3">CrossPuzzle</AppText>
      <AppText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
        Notlarından bulmaca, bulmacadan öğrenme
      </AppText>

      <View style={{ width: '100%', marginTop: spacing[4] }}>
        <AppInput
          label="E-posta"
          placeholder="ad@universite.edu.tr"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={error ?? undefined}
          returnKeyType="send"
          onSubmitEditing={() => { void submit(); }}
        />
      </View>

      <AppButton
        label="Kod gönder"
        onPress={() => { void submit(); }}
        loading={submitting}
        style={{ width: '100%', marginTop: spacing[2] }}
        accessibilityHint="E-posta adresine tek kullanımlık giriş kodu gönderir"
      />

      <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
        Şifre yok — e-postana tek kullanımlık giriş kodu göndeririz.
      </AppText>
    </Card>
  );
}
