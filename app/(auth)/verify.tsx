import { type JSX } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { OtpForm } from '@/src/features/auth';
import { useTheme } from '@/src/theme';

export default function VerifyScreen(): JSX.Element {
  const { colors, spacing } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();

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
          <OtpForm email={email ?? ''} />
        </View>
      </View>
    </SafeAreaView>
  );
}
