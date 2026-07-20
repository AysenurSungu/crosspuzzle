import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText, Card } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface LevelCardProps {
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export function LevelCard({ level, xp, xpForNextLevel }: LevelCardProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const ratio = xpForNextLevel > 0 ? Math.min(1, Math.max(0, xp / xpForNextLevel)) : 0;

  return (
    <Card style={{ padding: spacing[4], gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <AppText variant="bodyStrong">Seviye {level}</AppText>
        <AppText variant="caption" color="secondary">
          {xp} / {xpForNextLevel} XP
        </AppText>
      </View>
      <View
        style={{
          height: 8,
          borderRadius: radius.full,
          backgroundColor: colors.surfaceMuted,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            borderRadius: radius.full,
            backgroundColor: colors.primary,
          }}
        />
      </View>
    </Card>
  );
}
