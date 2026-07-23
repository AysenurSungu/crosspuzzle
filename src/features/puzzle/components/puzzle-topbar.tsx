import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface PuzzleTopbarProps {
  label: string;
  /** Elapsed seconds (count-up) or remaining seconds (countdown). */
  seconds: number;
  countdown: boolean;
  timeUp: boolean;
  extraLabel: string;
  onAddTime: () => void;
  onClose: () => void;
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function PuzzleTopbar({
  label,
  seconds,
  countdown,
  timeUp,
  extraLabel,
  onAddTime,
  onClose,
}: PuzzleTopbarProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const urgent = countdown && seconds <= 30;

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

      {timeUp ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ek süre ekle"
          onPress={onAddTime}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[1],
            paddingVertical: spacing[2],
            paddingHorizontal: spacing[3],
            borderRadius: radius.full,
            backgroundColor: colors.primarySoft,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            tintColor={colors.primary}
            size={14}
          />
          <AppText variant="label" color="accent">{extraLabel}</AppText>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <SymbolView
            name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
            tintColor={urgent ? colors.cellWrong : colors.textMuted}
            size={16}
          />
          <AppText
            variant="timestamp"
            style={{ color: urgent ? colors.cellWrong : colors.textSecondary }}
          >
            {formatTime(seconds)}
          </AppText>
        </View>
      )}
    </View>
  );
}
