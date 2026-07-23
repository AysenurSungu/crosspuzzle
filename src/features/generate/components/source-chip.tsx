import { type JSX } from 'react';
import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface SourceChipProps {
  name: string;
}

export function SourceChip({ name }: SourceChipProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[3],
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SymbolView
          name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
          tintColor={colors.primary}
          size={20}
        />
      </View>
      <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
        {name}
      </AppText>
    </View>
  );
}
