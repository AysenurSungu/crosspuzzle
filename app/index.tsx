import { type JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import {
  HomeHeader,
  HowItWorks,
  SamplePuzzleCard,
  SourcesSection,
} from '@/src/features/home';
import { pickSource } from '@/src/features/generate';
import { useTheme } from '@/src/theme';

export default function HomeScreen(): JSX.Element {
  const { colors, spacing } = useTheme();
  const params = useLocalSearchParams<{ name?: string; avatarId?: string }>();

  const name = params.name && params.name.length > 0 ? params.name : 'öğrenci';
  const avatarId = params.avatarId && params.avatarId.length > 0 ? params.avatarId : null;

  // Zero-state values for a brand-new user. These will come from the
  // profile / progress store once it is wired to Supabase.
  const streakDays = 0;
  const isNewUser = true;

  const profileParams = { name, avatarId: avatarId ?? '' };
  const openProfile = (): void => {
    router.push({ pathname: '/profile', params: profileParams });
  };
  const openSettings = (): void => {
    router.push({ pathname: '/settings', params: profileParams });
  };

  const openSamplePuzzle = (): void => {
    router.push('/puzzle');
  };

  // Open the system file picker; on selection continue to the generate flow.
  // The file itself is not read yet — generation uses the sample data.
  const uploadSource = async (): Promise<void> => {
    const picked = await pickSource();
    if (picked === null) return;
    router.push({ pathname: '/generate', params: { source: picked.name } });
  };
  const onUpload = (): void => {
    void uploadSource();
  };

  // TODO: wire the QR scan action once it exists.
  const noop = (): void => {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing[9] }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name={name}
          status="Yeni öğrenci"
          avatarId={avatarId}
          streakDays={streakDays}
          isNewUser={isNewUser}
          onProfilePress={openProfile}
          onSettingsPress={openSettings}
          onScanPress={noop}
          onPrimaryPress={onUpload}
        />

        <View style={{ padding: spacing[5], gap: spacing[6] }}>
          <SourcesSection onUploadPress={onUpload} />
          <SamplePuzzleCard onPress={openSamplePuzzle} />
          <HowItWorks />
        </View>
      </ScrollView>
    </View>
  );
}
