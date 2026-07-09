import { type JSX } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileForm } from '@/src/features/auth';
import { useTheme } from '@/src/theme';

export default function ProfileSetupScreen(): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          padding: spacing[5],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '100%', maxWidth: 360 }}>
          <ProfileForm />
        </View>
      </View>
    </SafeAreaView>
  );
}
