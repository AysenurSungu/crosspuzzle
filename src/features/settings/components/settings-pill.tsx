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
  onAvatarPress?: () => void;
}

export function SettingsPill({
  name,
  status,
  avatarId,
  onNotificationsPress,
  onAvatarPress,
}: SettingsPillProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const avatar = findAvatar(avatarId);

  const avatarInner = (
    <>
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
      {onAvatarPress ? (
        <View
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: 20,
            height: 20,
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
            size={10}
          />
        </View>
      ) : null}
    </>
  );

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
      {onAvatarPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Avatarı değiştir"
          accessibilityHint="Avatar seçme ekranını açar"
          onPress={onAvatarPress}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          {avatarInner}
        </Pressable>
      ) : (
        <View>{avatarInner}</View>
      )}

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
