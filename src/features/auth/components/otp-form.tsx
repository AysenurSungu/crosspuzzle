import { type JSX } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { AppButton, AppText, Card } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { formatCountdown, useOtpVerify } from '../hooks/use-otp-verify';
import { OtpInput } from './otp-input';

function changeEmail(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/(auth)/login');
}

export interface OtpFormProps {
  email: string;
}

export function OtpForm({ email }: OtpFormProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const {
    digits,
    setDigit,
    handleBackspace,
    error,
    submitting,
    submit,
    secondsLeft,
    canResend,
    resend,
  } = useOtpVerify(email);

  return (
    <Card style={{ alignItems: 'center', gap: spacing[3] }}>
      <AppText variant="h2">Kodu gir</AppText>
      <AppText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
        {email} adresine 6 haneli kod gönderdik.
      </AppText>
      <AppButton
        label="E-postayı değiştir"
        onPress={changeEmail}
        variant="ghost"
        style={{ paddingHorizontal: spacing[1], paddingVertical: 0, minHeight: 0 }}
        accessibilityHint="Giriş ekranına dönüp e-posta adresini düzeltir"
      />

      <View style={{ marginTop: spacing[4] }}>
        <OtpInput digits={digits} onChangeDigit={setDigit} onBackspace={handleBackspace} />
      </View>

      {error !== null && (
        <AppText variant="caption" style={{ color: colors.cellWrong }}>
          {error}
        </AppText>
      )}

      <AppButton
        label="Doğrula"
        onPress={() => { void submit(); }}
        loading={submitting}
        style={{ width: '100%', marginTop: spacing[2] }}
        accessibilityHint="Girilen kodu doğrular"
      />

      <View style={{ flexDirection: 'row', gap: spacing[1], alignItems: 'center' }}>
        <AppText variant="caption" color="secondary">Kod gelmedi mi?</AppText>
        <AppButton
          label={canResend ? 'Tekrar gönder' : `Tekrar gönder (${formatCountdown(secondsLeft)})`}
          onPress={() => { void resend(); }}
          variant="ghost"
          disabled={!canResend}
          style={{ paddingHorizontal: spacing[1], paddingVertical: 0, minHeight: 0 }}
          accessibilityHint="Yeni bir doğrulama kodu gönderir"
        />
      </View>
    </Card>
  );
}
