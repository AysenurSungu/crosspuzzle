import { type JSX } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export type StepStatus = 'done' | 'active' | 'pending';

export interface PrepareStep {
  label: string;
}

export interface PrepareChecklistProps {
  steps: readonly PrepareStep[];
  /** Index of the currently running step; earlier steps are done, later pending. */
  currentIndex: number;
}

function statusFor(index: number, currentIndex: number): StepStatus {
  if (index < currentIndex) return 'done';
  if (index === currentIndex) return 'active';
  return 'pending';
}

export function PrepareChecklist({ steps, currentIndex }: PrepareChecklistProps): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[4] }}>
      {steps.map((step, index) => {
        const status = statusFor(index, currentIndex);
        return (
          <View
            key={step.label}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}
          >
            <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
              {status === 'done' ? (
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  tintColor={colors.primary}
                  size={22}
                />
              ) : status === 'active' ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <SymbolView
                  name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' }}
                  tintColor={colors.textMuted}
                  size={20}
                />
              )}
            </View>
            <AppText variant="body" color={status === 'pending' ? 'muted' : 'primary'}>
              {step.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
