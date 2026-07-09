import { type JSX } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/src/theme';

export interface PageIndicatorProps {
  total: number;
  currentIndex: number;
}

export function PageIndicator({ total, currentIndex }: PageIndicatorProps): JSX.Element {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: currentIndex + 1 }}
      style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'center' }}
    >
      {Array.from({ length: total }, (_, i) => i).map((i) => {
        const isActive = i === currentIndex;
        return (
          <View
            key={`page-dot-${i}`}
            style={{
              width: isActive ? 20 : 8,
              height: 8,
              borderRadius: radius.full,
              backgroundColor: isActive ? colors.primary : colors.border,
            }}
          />
        );
      })}
    </View>
  );
}
