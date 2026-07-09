import { forwardRef, type JSX } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/src/theme';
import { AppText } from './app-text';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  { label, error, style, placeholderTextColor, ...rest },
  ref,
): JSX.Element {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View style={{ width: '100%' }}>
      {label !== undefined && (
        <AppText variant="label" color="secondary" style={{ marginBottom: spacing[1] }}>
          {label}
        </AppText>
      )}
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor ?? colors.textPlaceholder}
        style={[
          typography.body,
          {
            width: '100%',
            borderWidth: 1,
            borderColor: error !== undefined ? colors.cellWrong : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            color: colors.text,
            backgroundColor: colors.card,
            minHeight: 48,
          },
          style,
        ]}
        {...rest}
      />
      {error !== undefined && (
        <AppText variant="caption" style={{ color: colors.cellWrong, marginTop: spacing[1] }}>
          {error}
        </AppText>
      )}
    </View>
  );
});
