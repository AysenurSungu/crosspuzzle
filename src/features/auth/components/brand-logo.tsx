import { type JSX } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/src/theme';

export function BrandLogo(): JSX.Element {
  const { colors, radius } = useTheme();
  return (
    <View
      accessibilityLabel="CrossPuzzle logo"
      style={{
        width: 64,
        height: 64,
        borderRadius: radius.lg,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: radius.sm,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}
