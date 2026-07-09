import { type JSX } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { PageIndicator } from './page-indicator';
import { OnboardingIllustration, type IllustrationKind } from './onboarding-illustration';

export interface OnboardingPageProps {
  illustration: IllustrationKind;
  title: string;
  description: string;
  currentIndex: number;
  totalPages: number;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onSkip?: () => void;
}

export function OnboardingPage({
  illustration,
  title,
  description,
  currentIndex,
  totalPages,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onSkip,
}: OnboardingPageProps): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: spacing[6] }}>
        <View style={{ height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
          {onSkip !== undefined && (
            <AppButton
              label="Atla"
              onPress={onSkip}
              variant="ghost"
              style={{ paddingHorizontal: spacing[2], paddingVertical: spacing[1], minHeight: 0 }}
              accessibilityHint="Onboarding'i atla ve girişe git"
            />
          )}
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <OnboardingIllustration kind={illustration} />
          <AppText variant="h1" style={{ textAlign: 'center', marginBottom: spacing[3] }}>
            {title}
          </AppText>
          <AppText
            variant="body"
            color="secondary"
            style={{ textAlign: 'center', paddingHorizontal: spacing[4] }}
          >
            {description}
          </AppText>
        </View>

        <View style={{ paddingBottom: spacing[6], gap: spacing[4] }}>
          <PageIndicator total={totalPages} currentIndex={currentIndex} />
          <AppButton label={primaryLabel} onPress={onPrimary} />
          {secondaryLabel !== undefined && onSecondary !== undefined && (
            <AppButton label={secondaryLabel} onPress={onSecondary} variant="ghost" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
