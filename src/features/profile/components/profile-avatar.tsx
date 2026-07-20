import { type JSX } from 'react';
import { Image, View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { findAvatar } from '@/src/features/auth/avatars';

const SIZE = 112;

export interface ProfileAvatarProps {
  avatarId: string | null;
  fallback: string;
}

export function ProfileAvatar({ avatarId, fallback }: ProfileAvatarProps): JSX.Element {
  const { colors, radius } = useTheme();
  const avatar = findAvatar(avatarId);

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: radius.full,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {avatar ? (
        <Image source={avatar.source} style={{ width: SIZE, height: SIZE }} resizeMode="cover" />
      ) : (
        <AppText variant="h1" color="accent" style={{ fontSize: 44, lineHeight: 48 }}>
          {fallback.charAt(0).toUpperCase() || '?'}
        </AppText>
      )}
    </View>
  );
}
