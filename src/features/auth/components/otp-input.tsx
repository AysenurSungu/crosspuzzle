import { createRef, useEffect, useMemo, type JSX } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '@/src/theme';

export interface OtpInputProps {
  digits: readonly string[];
  onChangeDigit: (index: number, value: string) => void;
  onBackspace: (index: number) => void;
}

export function OtpInput({ digits, onChangeDigit, onBackspace }: OtpInputProps): JSX.Element {
  const { colors, radius, spacing, typography } = useTheme();

  const refs = useMemo(
    () => digits.map(() => createRef<TextInput>()),
    [digits.length],
  );

  useEffect(() => {
    const firstEmpty = digits.findIndex((d) => d === '');
    const target = firstEmpty === -1 ? digits.length - 1 : firstEmpty;
    refs[target]?.current?.focus();
    // Only refocus when the number of filled cells changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits.join('')]);

  return (
    <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'center' }}>
      {digits.map((digit, index) => {
        const isFocusTarget = digits.findIndex((d) => d === '') === index;
        return (
          <TextInput
            key={`otp-cell-${index}`}
            ref={refs[index]}
            value={digit}
            onChangeText={(value) => {
              onChangeDigit(index, value);
              if (value !== '' && index < digits.length - 1) {
                refs[index + 1]?.current?.focus();
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && digit === '' && index > 0) {
                onBackspace(index);
                refs[index - 1]?.current?.focus();
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
            accessibilityLabel={`Kod hanesi ${index + 1}`}
            style={[
              typography.otpDigit,
              {
                width: 44,
                height: 52,
                borderWidth: 1,
                borderColor: isFocusTarget ? colors.primary : colors.border,
                borderRadius: radius.md,
                textAlign: 'center',
                color: colors.text,
                backgroundColor: colors.card,
              },
            ]}
          />
        );
      })}
    </View>
  );
}
