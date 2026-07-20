import { type JSX, type ReactNode } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

interface BaseRow {
  label: string;
}

export interface NavigationRow extends BaseRow {
  kind: 'navigation';
  value?: string;
  onPress: () => void;
}

export interface ToggleRow extends BaseRow {
  kind: 'toggle';
  value: boolean;
  onValueChange: (next: boolean) => void;
}

export type SettingsRowProps = NavigationRow | ToggleRow;

export function SettingsRow(props: SettingsRowProps): JSX.Element {
  const { colors, spacing } = useTheme();

  const content: ReactNode = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing[4],
        gap: spacing[3],
      }}
    >
      <AppText variant="body">{props.label}</AppText>

      {props.kind === 'toggle' ? (
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          trackColor={{ true: colors.primary, false: colors.surfaceMuted }}
          thumbColor={colors.card}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          {props.value ? (
            <AppText variant="body" color="secondary">{props.value}</AppText>
          ) : null}
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={colors.textMuted}
            size={16}
          />
        </View>
      )}
    </View>
  );

  if (props.kind === 'toggle') {
    return content as JSX.Element;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      onPress={props.onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      {content}
    </Pressable>
  );
}
