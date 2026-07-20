import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import type { RenderClue } from '../types';

export interface ClueBarProps {
  clue: RenderClue | null;
}

export function ClueBar({ clue }: ClueBarProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[4],
        gap: spacing[1],
        minHeight: 84,
        justifyContent: 'center',
      }}
    >
      {clue ? (
        <>
          <AppText variant="label" color="accent">
            {clue.number} {clue.direction === 'across' ? 'Yatay' : 'Aşağı'} · {clue.length} harf
          </AppText>
          <AppText variant="bodyStrong">{clue.clue}</AppText>
        </>
      ) : (
        <AppText variant="body" color="secondary">
          Başlamak için bir kareye dokun.
        </AppText>
      )}
    </View>
  );
}
