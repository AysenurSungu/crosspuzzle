import { useState, type JSX } from 'react';
import { View } from 'react-native';
import { AppButton, AppInput, AppText, Card } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { useProfileSetup } from '../hooks/use-profile-setup';
import { AvatarCircle } from './avatar-circle';
import { AvatarPickerModal } from './avatar-picker-modal';

export function ProfileForm(): JSX.Element {
  const { spacing } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);
  const {
    username,
    avatarId,
    usernameError,
    submitting,
    setUsername,
    setAvatarId,
    submit,
  } = useProfileSetup();

  return (
    <Card style={{ alignItems: 'center', gap: spacing[4] }}>
      <AppText variant="h2">Profilini oluştur</AppText>

      <AvatarCircle avatarId={avatarId} onEditPress={() => setPickerVisible(true)} />

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
      </View>

      <AppButton
        label="Başla"
        onPress={() => { void submit(); }}
        loading={submitting}
        style={{ width: '100%' }}
        accessibilityHint="Profili kaydeder ve uygulamayı başlatır"
      />

      <AvatarPickerModal
        visible={pickerVisible}
        selectedId={avatarId}
        onApply={(id) => {
          setAvatarId(id);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </Card>
  );
}
