import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface PuzzleActionsProps {
  canActOnCell: boolean;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onCheck: () => void;
}

interface ActionButtonProps {
  icon: SymbolViewProps['name'];
  label: string;
  disabled: boolean;
  onPress: () => void;
}

function ActionButton({ icon, label, disabled, onPress }: ActionButtonProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing[3],
        alignItems: 'center',
        gap: spacing[1],
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      })}
    >
      <SymbolView name={icon} tintColor={colors.primary} size={22} />
      <AppText variant="label">{label}</AppText>
    </Pressable>
  );
}

export function PuzzleActions({
  canActOnCell,
  onRevealLetter,
  onRevealWord,
  onCheck,
}: PuzzleActionsProps): JSX.Element {
  const { spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
      <ActionButton
        icon={{ ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }}
        label="Harf aç"
        disabled={!canActOnCell}
        onPress={onRevealLetter}
      />
      <ActionButton
        icon={{ ios: 'key.fill', android: 'vpn_key', web: 'vpn_key' }}
        label="Kelime aç"
        disabled={!canActOnCell}
        onPress={onRevealWord}
      />
      <ActionButton
        icon={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
        label="Kontrol et"
        disabled={false}
        onPress={onCheck}
      />
    </View>
  );
}
