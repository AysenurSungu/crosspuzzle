import { Fragment, useState, type JSX } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText, Card, ScreenHeader } from '@/src/components/ui';
import { SettingsPill, SettingsRow, type SettingsRowProps } from '@/src/features/settings';
import { useTheme } from '@/src/theme';

export default function SettingsScreen(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const params = useLocalSearchParams<{ name?: string; avatarId?: string }>();

  const name = params.name && params.name.length > 0 ? params.name : 'öğrenci';
  const avatarId = params.avatarId && params.avatarId.length > 0 ? params.avatarId : null;

  const [publicProfile, setPublicProfile] = useState(true);

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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hesabı sil"
          onPress={noop}
          style={({ pressed }) => ({
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.borderMuted,
            paddingVertical: spacing[4],
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <AppText variant="button" style={{ color: colors.cellWrong }}>
            Hesabı sil
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}
