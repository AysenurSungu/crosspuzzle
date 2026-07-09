import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import type { JSX, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.borderMuted,
          padding: spacing[6],
          width: '100%',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
