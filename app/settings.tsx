import { Fragment, useState, type JSX } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton, AppText, Card, ScreenHeader } from '@/src/components/ui';
import { SettingsPill, SettingsRow, useAccountActions, useAvatarUpdate, type SettingsRowProps } from '@/src/features/settings';
import { AvatarPickerModal } from '@/src/features/auth';
import { useProfileStore } from '@/src/stores/profile-store';
import { useTheme } from '@/src/theme';

export default function SettingsScreen(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const params = useLocalSearchParams<{ name?: string; avatarId?: string }>();
  const storedName = useProfileStore((state) => state.username);
  const { avatarId, changeAvatar } = useAvatarUpdate();
  const { busy, logout, deleteAccount } = useAccountActions();

  const name =
    storedName ?? (params.name && params.name.length > 0 ? params.name : 'öğrenci');

  const [publicProfile, setPublicProfile] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  const goBack = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  // TODO: wire these to their own screens / actions once they exist.
  const noop = (): void => {};

  const rows: readonly SettingsRowProps[] = [
    { kind: 'navigation', label: 'Dil', value: 'Türkçe', onPress: noop },
    { kind: 'toggle', label: 'Profil herkese açık', value: publicProfile, onValueChange: setPublicProfile },
    { kind: 'navigation', label: 'Veri ve gizlilik', onPress: noop },
    { kind: 'navigation', label: 'Yardım', onPress: noop },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Ayarlar" onBack={goBack} />

      <ScrollView
        contentContainerStyle={{ padding: spacing[5], gap: spacing[5], paddingBottom: spacing[9] }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsPill
          name={name}
          status="Aktif öğrenci"
          avatarId={avatarId}
          onNotificationsPress={noop}
          onAvatarPress={() => setPickerVisible(true)}
        />

        <Card style={{ paddingVertical: spacing[1], paddingHorizontal: spacing[5] }}>
          {rows.map((row, index) => (
            <Fragment key={row.label}>
              {index > 0 ? (
                <View style={{ height: 1, backgroundColor: colors.borderMuted }} />
              ) : null}
              <SettingsRow {...row} />
            </Fragment>
          ))}
        </Card>

        <View style={{ gap: spacing[3] }}>
          <AppButton
            label="Çıkış yap"
            variant="secondary"
            onPress={logout}
            loading={busy === 'logout'}
            disabled={busy !== null}
            accessibilityHint="Oturumu kapatır ve giriş ekranına döner"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hesabı sil"
            accessibilityState={{ disabled: busy !== null, busy: busy === 'delete' }}
            accessibilityHint="Hesabı ve tüm verileri kalıcı olarak siler"
            onPress={deleteAccount}
            disabled={busy !== null}
            style={({ pressed }) => ({
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.borderMuted,
              paddingVertical: spacing[4],
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: busy !== null ? 0.5 : pressed ? 0.7 : 1,
            })}
          >
            {busy === 'delete' ? (
              <ActivityIndicator color={colors.cellWrong} />
            ) : (
              <AppText variant="button" style={{ color: colors.cellWrong }}>
                Hesabı sil
              </AppText>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <AvatarPickerModal
        visible={pickerVisible}
        selectedId={avatarId}
        onApply={(id) => {
          void changeAvatar(id);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}
