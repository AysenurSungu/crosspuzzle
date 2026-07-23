import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  /** Render the current value (e.g. "20" or "5 dk" / "Süresiz"). */
  formatValue?: (value: number) => string;
}

/** Generic −/＋ stepper used for word count and puzzle duration. */
export function Stepper({
  value,
  min = 0,
  max = 30,
  onChange,
  formatValue = (v) => String(v),
}: StepperProps): JSX.Element {
  const { colors, radius } = useTheme();

  const StepButton = ({
    icon,
    label,
    disabled,
    onPress,
  }: {
    icon: SymbolViewProps['name'];
    label: string;
    disabled: boolean;
    onPress: () => void;
  }): JSX.Element => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
      })}
    >
      <SymbolView name={icon} tintColor={colors.text} size={20} />
    </Pressable>
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <StepButton
        icon={{ ios: 'minus', android: 'remove', web: 'remove' }}
        label="Azalt"
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
      />
      <AppText variant="h2">{formatValue(value)}</AppText>
      <StepButton
        icon={{ ios: 'plus', android: 'add', web: 'add' }}
        label="Artır"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
      />
    </View>
  );
}
