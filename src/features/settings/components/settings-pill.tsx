import { type JSX } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { findAvatar } from '@/src/features/auth/avatars';

const AVATAR_SIZE = 44;

export interface SettingsPillProps {
  name: string;
  status: string;
  avatarId: string | null;
  onNotificationsPress: () => void;
}

export function SettingsPill({
  name,
  status,
  avatarId,
  onNotificationsPress,
}: SettingsPillProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const avatar = findAvatar(avatarId);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.card,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        padding: spacing[2],
      }}
    >
      <View
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: radius.full,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {avatar ? (
          <Image
            source={avatar.source}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            resizeMode="cover"
          />
        ) : (
          <AppText variant="h3" color="accent">
            {name.charAt(0).toUpperCase() || '?'}
          </AppText>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" numberOfLines={1}>Merhaba, {name}</AppText>
        <AppText variant="caption" color="secondary" numberOfLines={1}>{status}</AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Bildirimler"
        onPress={onNotificationsPress}
        hitSlop={8}
        style={({ pressed }) => ({
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <SymbolView
          name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
          tintColor={colors.text}
          size={18}
        />
      </Pressable>
    </View>
  );
}
