import { type JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { AppText } from './app-text';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityHint,
}: AppButtonProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  const containerByVariant: Record<AppButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent' },
  };

  const textColorByVariant: Record<AppButtonVariant, 'onPrimary' | 'primary' | 'accent'> = {
    primary: 'onPrimary',
    secondary: 'primary',
    ghost: 'accent',
  };

  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        {
          borderRadius: radius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : isInactive ? 0.5 : 1,
          minHeight: 48,
        },
        containerByVariant[variant],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.primaryContrast : colors.primary} />
      ) : (
        <AppText variant="button" color={textColorByVariant[variant]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
