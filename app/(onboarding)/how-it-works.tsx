import { type JSX } from 'react';
import { router } from 'expo-router';
import { OnboardingPage, useOnboarding } from '@/src/features/onboarding';

export default function HowItWorksScreen(): JSX.Element {
  const { markSeen } = useOnboarding();

  const goToLogin = async (): Promise<void> => {
    await markSeen();
    router.replace('/(auth)/login');
  };

  return (
    <OnboardingPage
      illustration="solve"
      title="Çözerek öğren, skoru yükselt"
      description="Bulmacayı çözdükçe konuya hakim olursun, XP kazanır, seviyeni yükseltirsin."
      currentIndex={1}
      totalPages={2}
      primaryLabel="Başla"
      onPrimary={() => { void goToLogin(); }}
      onSkip={() => { void goToLogin(); }}
    />
  );
}
