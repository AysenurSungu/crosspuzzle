import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export type IllustrationKind = 'upload' | 'solve';

export interface OnboardingIllustrationProps {
  kind: IllustrationKind;
}

export function OnboardingIllustration({ kind }: OnboardingIllustrationProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={{
        width: 180,
        height: 180,
        borderRadius: radius.xl,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[6],
      }}
    >
      {kind === 'upload' ? <UploadArt /> : <SolveArt />}
    </View>
  );
}

function UploadArt(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing[2] }}>
      <View
        style={{
          width: 80,
          height: 100,
          borderRadius: radius.md,
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.primary,
          padding: spacing[2],
          justifyContent: 'flex-start',
          gap: 6,
        }}
      >
        <View style={{ height: 4, borderRadius: radius.sm, backgroundColor: colors.primary, width: '70%' }} />
        <View style={{ height: 4, borderRadius: radius.sm, backgroundColor: colors.border, width: '90%' }} />
        <View style={{ height: 4, borderRadius: radius.sm, backgroundColor: colors.border, width: '85%' }} />
        <View style={{ height: 4, borderRadius: radius.sm, backgroundColor: colors.border, width: '60%' }} />
      </View>
      <AppText variant="caption" color="accent">PDF · Not</AppText>
    </View>
  );
}

function SolveArt(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const cells: Array<{ filled: boolean; letter?: string }> = [
    { filled: true, letter: 'B' },
    { filled: true, letter: 'U' },
    { filled: true, letter: 'L' },
    { filled: true },
    { filled: false },
    { filled: true, letter: 'M' },
    { filled: true, letter: 'A' },
    { filled: true },
    { filled: true, letter: 'C' },
    { filled: true, letter: 'A' },
    { filled: false },
    { filled: true },
  ];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 4 * 24 + 3 * 4, gap: 4, justifyContent: 'center' }}>
      {cells.map((cell, i) => (
        <View
          key={`solve-cell-${i}`}
          style={{
            width: 24,
            height: 24,
            borderRadius: radius.sm,
            backgroundColor: cell.filled ? colors.card : colors.cellBlock,
            borderWidth: 1,
            borderColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {cell.letter !== undefined && (
            <AppText variant="caption" color="accent" style={{ fontWeight: '700' }}>
              {cell.letter}
            </AppText>
          )}
        </View>
      ))}
      <View style={{ marginTop: spacing[2], width: '100%', alignItems: 'center' }}>
        <View
          style={{
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
            borderRadius: radius.full,
            backgroundColor: colors.primary,
          }}
        >
          <AppText variant="caption" color="onPrimary">+50 XP</AppText>
        </View>
      </View>
    </View>
  );
}
