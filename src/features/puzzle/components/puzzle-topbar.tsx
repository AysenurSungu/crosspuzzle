import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface PuzzleTopbarProps {
  label: string;
  elapsedSeconds: number;
  onClose: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function PuzzleTopbar({ label, elapsedSeconds, onClose }: PuzzleTopbarProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[5],
        paddingBottom: spacing[3],
        gap: spacing[3],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Bulmacayı kapat"
        onPress={onClose}
        hitSlop={8}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <SymbolView
          name={{ ios: 'xmark', android: 'close', web: 'close' }}
          tintColor={colors.text}
          size={16}
        />
      </Pressable>

      <View
        style={{
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[4],
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <AppText variant="label" color="secondary">{label}</AppText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
        <SymbolView
          name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          tintColor={colors.textMuted}
          size={16}
        />
        <AppText variant="timestamp" color="secondary">{formatTime(elapsedSeconds)}</AppText>
      </View>
    </View>
  );
}
