import { type JSX } from 'react';
import { router } from 'expo-router';
import { OnboardingPage, useOnboarding } from '@/src/features/onboarding';

export default function WelcomeScreen(): JSX.Element {
  const { markSeen } = useOnboarding();

  const handleSkip = async (): Promise<void> => {
    await markSeen();
    router.replace('/(auth)/login');
  };

  return (
    <OnboardingPage
      illustration="upload"
      title="Notlarını yükle, bulmacan hazır"
      description="PDF veya görsel olarak yüklediğin notlardan CrossPuzzle senin için otomatik bulmaca üretir."
      currentIndex={0}
      totalPages={2}
      primaryLabel="İleri"
      onPrimary={() => router.push('/(onboarding)/how-it-works')}
      onSkip={() => { void handleSkip(); }}
    />
  );
}
