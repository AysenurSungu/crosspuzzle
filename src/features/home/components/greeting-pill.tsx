import { type JSX } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { findAvatar } from '@/src/features/auth/avatars';

export interface GreetingPillProps {
  name: string;
  status: string;
  avatarId: string | null;
  onProfilePress: () => void;
  onSettingsPress: () => void;
}

const AVATAR_SIZE = 44;

export function GreetingPill({
  name,
  status,
  avatarId,
  onProfilePress,
  onSettingsPress,
}: GreetingPillProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const avatar = findAvatar(avatarId);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.brandHeaderPill,
        borderRadius: radius.full,
        padding: spacing[2],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profilini aç"
        onPress={onProfilePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          flex: 1,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: radius.full,
            backgroundColor: colors.brandHeaderControl,
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
            <AppText variant="h3" style={{ color: colors.onBrand }}>
              {name.charAt(0).toUpperCase() || '?'}
            </AppText>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" style={{ color: colors.onBrand }} numberOfLines={1}>
            Merhaba, {name}
          </AppText>
          <AppText variant="caption" style={{ color: colors.onBrandMuted }} numberOfLines={1}>
            {status}
          </AppText>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ayarları aç"
        onPress={onSettingsPress}
        hitSlop={8}
        style={({ pressed }) => ({
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: radius.full,
          backgroundColor: colors.brandHeaderControl,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <SymbolView
          name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
          tintColor={colors.onBrand}
          size={20}
        />
      </Pressable>
    </View>
  );
}
