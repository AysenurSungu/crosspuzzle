import { type JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText, ScreenHeader } from '@/src/components/ui';
import { BadgeGrid, LevelCard, ProfileAvatar, StatCards, type StatItem } from '@/src/features/profile';
import { useTheme } from '@/src/theme';

export default function ProfileScreen(): JSX.Element {
  const { colors, spacing } = useTheme();
  const params = useLocalSearchParams<{ name?: string; avatarId?: string }>();

  const username = params.name && params.name.length > 0 ? params.name : 'ogrenci';
  const avatarId = params.avatarId && params.avatarId.length > 0 ? params.avatarId : null;

  // Zero-state progress for a brand-new user. Replace with the progress
  // store once it is wired to Supabase.
  const stats: readonly StatItem[] = [
    { label: 'Oyun', value: '0' },
    { label: 'Doğruluk', value: '—' },
    { label: 'Seri', value: '0' },
  ];

  const goBack = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Profil"
        onBack={goBack}
        rightAction={{
          icon: { ios: 'pencil', android: 'edit', web: 'edit' },
          accessibilityLabel: 'Profili düzenle',
          // TODO: open profile edit (avatar + username) once available.
          onPress: () => {},
        }}
      />

      <ScrollView
        contentContainerStyle={{ padding: spacing[5], gap: spacing[6], paddingBottom: spacing[9] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', gap: spacing[3] }}>
          <ProfileAvatar avatarId={avatarId} fallback={username} />
          <View style={{ alignItems: 'center', gap: spacing[1] }}>
            <AppText variant="h2">{username}</AppText>
            <AppText variant="body" color="secondary">@{username}</AppText>
          </View>
        </View>

        <LevelCard level={1} xp={0} xpForNextLevel={400} />
        <StatCards stats={stats} />
        <BadgeGrid />
      </ScrollView>
    </View>
  );
}
