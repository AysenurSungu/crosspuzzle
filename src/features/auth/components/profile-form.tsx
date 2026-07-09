import { type JSX } from 'react';
import { View } from 'react-native';
import { AppButton, AppInput, AppText, Card } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { useProfileSetup } from '../hooks/use-profile-setup';
import { AvatarCircle } from './avatar-circle';
import { LanguageSelector } from './language-selector';

export function ProfileForm(): JSX.Element {
  const { spacing } = useTheme();
  const {
    username,
    displayName,
    language,
    initials,
    usernameError,
    displayNameError,
    submitting,
    setUsername,
    setDisplayName,
    setLanguage,
    submit,
  } = useProfileSetup();

  return (
    <Card style={{ alignItems: 'center', gap: spacing[4] }}>
      <AppText variant="h2">Profilini oluştur</AppText>

      <AvatarCircle initials={initials} />

      <View style={{ width: '100%', gap: spacing[3] }}>
        <AppInput
          label="Kullanıcı adı"
          placeholder="ayse_tip"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          error={usernameError ?? undefined}
        />
        <AppInput
          label="Görünen isim"
          placeholder="Ayşe Yılmaz"
          value={displayName}
          onChangeText={setDisplayName}
          error={displayNameError ?? undefined}
        />
        <View style={{ gap: spacing[1] }}>
          <AppText variant="label" color="secondary">Dil</AppText>
          <LanguageSelector value={language} onChange={setLanguage} />
        </View>
      </View>

      <AppButton
        label="Başla"
        onPress={() => { void submit(); }}
        loading={submitting}
        style={{ width: '100%' }}
        accessibilityHint="Profili kaydeder ve uygulamayı başlatır"
      />
    </Card>
  );
}
