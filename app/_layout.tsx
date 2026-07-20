import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type JSX } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { useOnboarding } from '@/src/features/onboarding';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav(): JSX.Element {
  const colorScheme = useColorScheme();
  const { status } = useOnboarding();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unseen') {
      router.replace('/(onboarding)/welcome');
    } else {
      router.replace('/(auth)/login');
    }
    // Keep the native splash up until routing is decided, so the home
    // (index) initial route never flashes before the redirect lands.
    const frame = requestAnimationFrame(() => {
      void SplashScreen.hideAsync();
    });
    return () => cancelAnimationFrame(frame);
  }, [status]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen
          name="puzzle"
          options={{ headerShown: false, presentation: 'modal', gestureDirection: 'vertical' }}
        />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
