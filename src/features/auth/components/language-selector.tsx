import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import type { AppLanguage } from '../hooks/use-profile-setup';

export interface LanguageSelectorProps {
  value: AppLanguage;
  onChange: (value: AppLanguage) => void;
}

const OPTIONS: ReadonlyArray<{ id: AppLanguage; label: string }> = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: spacing[2] }}>
      {OPTIONS.map((option) => {
        const isSelected = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.id)}
            style={{
              paddingVertical: spacing[2],
              paddingHorizontal: spacing[4],
              borderRadius: radius.full,
              backgroundColor: isSelected ? colors.primarySoft : 'transparent',
              borderWidth: 1,
              borderColor: isSelected ? colors.primary : colors.border,
            }}
          >
            <AppText
              variant="label"
              color={isSelected ? 'accent' : 'secondary'}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
