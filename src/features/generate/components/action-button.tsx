import { type JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: SymbolViewProps['name'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Primary button with an optional leading icon (shared by generate + review). */
export function ActionButton({
  label,
  onPress,
  icon,
  disabled = false,
  style,
}: ActionButtonProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          minHeight: 52,
          borderRadius: radius.md,
          paddingHorizontal: spacing[6],
          backgroundColor: colors.primary,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon ? <SymbolView name={icon} tintColor={colors.primaryContrast} size={20} /> : null}
      <AppText variant="button" color="onPrimary">{label}</AppText>
    </Pressable>
  );
}
