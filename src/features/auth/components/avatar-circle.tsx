import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface AvatarCircleProps {
  initials: string;
}

export function AvatarCircle({ initials }: AvatarCircleProps): JSX.Element {
  const { colors, radius } = useTheme();
  return (
    <View
      accessibilityLabel={`Avatar: ${initials}`}
      style={{
        width: 72,
        height: 72,
        borderRadius: radius.full,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AppText variant="h3" color="accent">{initials}</AppText>
    </View>
  );
}
