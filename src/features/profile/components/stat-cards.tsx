import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface StatItem {
  label: string;
  value: string;
}

export interface StatCardsProps {
  stats: readonly StatItem[];
}

export function StatCards({ stats }: StatCardsProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
      {stats.map((stat) => (
        <View
          key={stat.label}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.borderMuted,
            paddingVertical: spacing[4],
            alignItems: 'center',
            gap: spacing[1],
          }}
        >
          <AppText variant="h2">{stat.value}</AppText>
          <AppText variant="caption" color="secondary">{stat.label}</AppText>
        </View>
      ))}
    </View>
  );
}
