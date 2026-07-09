import { type JSX } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/src/theme';
import type { TypographyVariant } from '@/src/theme';

export type AppTextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'onPrimary' | 'link' | 'placeholder';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: AppTextColor;
}

export function AppText({
  variant = 'body',
  color = 'primary',
  style,
  ...rest
}: AppTextProps): JSX.Element {
  const { colors, typography } = useTheme();

  const colorMap: Record<AppTextColor, string> = {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.primary,
    onPrimary: colors.primaryContrast,
    link: colors.textLink,
    placeholder: colors.textPlaceholder,
  };

  return (
    <Text
      style={[typography[variant], { color: colorMap[color] }, style]}
      {...rest}
    />
  );
}
