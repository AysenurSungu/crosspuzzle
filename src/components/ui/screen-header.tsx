import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useTheme } from '@/src/theme';
import { AppText } from './app-text';

const BUTTON_SIZE = 40;

export interface ScreenHeaderAction {
  icon: SymbolViewProps['name'];
  accessibilityLabel: string;
  onPress: () => void;
}

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: ScreenHeaderAction;
}

function CircleButton({
  icon,
  accessibilityLabel,
  onPress,
}: ScreenHeaderAction): JSX.Element {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <SymbolView name={icon} tintColor={colors.text} size={18} />
    </Pressable>
  );
}

export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: insets.top + spacing[2],
        paddingBottom: spacing[3],
        paddingHorizontal: spacing[5],
        backgroundColor: colors.background,
      }}
    >
      <CircleButton
        icon={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        accessibilityLabel="Geri"
        onPress={onBack}
      />
      <AppText variant="h3">{title}</AppText>
      {rightAction ? (
        <CircleButton {...rightAction} />
      ) : (
        <View style={{ width: BUTTON_SIZE }} />
      )}
    </View>
  );
}
