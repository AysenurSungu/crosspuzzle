import { type JSX } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/src/theme';
import { findAvatar } from '../avatars';

const SIZE = 96;
const BADGE = 32;

export interface AvatarCircleProps {
  avatarId: string | null;
  onEditPress: () => void;
}

export function AvatarCircle({ avatarId, onEditPress }: AvatarCircleProps): JSX.Element {
  const { colors, radius } = useTheme();
  const avatar = findAvatar(avatarId);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={avatar ? 'Avatarı değiştir' : 'Avatar seç'}
      accessibilityHint="Avatar seçme ekranını açar"
      onPress={onEditPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: radius.full,
          backgroundColor: colors.primarySoft,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {avatar ? (
          <Image
            source={avatar.source}
            style={{ width: SIZE, height: SIZE }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View
        style={{
          position: 'absolute',
          right: -2,
          bottom: -2,
          width: BADGE,
          height: BADGE,
          borderRadius: radius.full,
          backgroundColor: colors.primary,
          borderWidth: 2,
          borderColor: colors.card,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SymbolView
          name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
          tintColor={colors.primaryContrast}
          size={16}
        />
      </View>
    </Pressable>
  );
}
