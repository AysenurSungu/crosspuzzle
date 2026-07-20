import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { GreetingPill } from './greeting-pill';

export interface HomeHeaderProps {
  name: string;
  status: string;
  avatarId: string | null;
  streakDays: number;
  isNewUser: boolean;
  onProfilePress: () => void;
  onSettingsPress: () => void;
  onScanPress: () => void;
  onPrimaryPress: () => void;
}

export function HomeHeader({
  name,
  status,
  avatarId,
  streakDays,
  isNewUser,
  onProfilePress,
  onSettingsPress,
  onScanPress,
  onPrimaryPress,
}: HomeHeaderProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const primaryLabel = isNewUser ? 'İlk kaynağını yükle' : 'Bulmaca üret';
  const streakCaption = isNewUser
    ? 'İlk bulmacanı çöz, serini başlat.'
    : 'Serini bugün de sürdür.';

  return (
    <View
      style={{
        backgroundColor: colors.brandHeader,
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
        paddingTop: insets.top + spacing[4],
        paddingBottom: spacing[6],
        paddingHorizontal: spacing[5],
        gap: spacing[5],
      }}
    >
      <GreetingPill
        name={name}
        status={status}
        avatarId={avatarId}
        onProfilePress={onProfilePress}
        onSettingsPress={onSettingsPress}
      />

      <View style={{ gap: spacing[1] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <SymbolView
            name={{ ios: 'flame.fill', android: 'whatshot', web: 'whatshot' }}
            tintColor={colors.brandBright}
            size={16}
          />
          <AppText variant="label" style={{ color: colors.onBrandMuted }}>
            Günlük seri
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing[2] }}>
          <AppText variant="h1" style={{ color: colors.onBrand, fontSize: 48, lineHeight: 52 }}>
            {streakDays}
          </AppText>
          <AppText variant="h3" style={{ color: colors.onBrandMuted }}>
            gün
          </AppText>
        </View>
        <AppText variant="body" style={{ color: colors.onBrandMuted }}>
          {streakCaption}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tara"
          onPress={onScanPress}
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: radius.md,
            backgroundColor: colors.brandHeaderControl,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <SymbolView
            name={{ ios: 'viewfinder', android: 'qr_code_scanner', web: 'qr_code_scanner' }}
            tintColor={colors.onBrand}
            size={24}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          onPress={onPrimaryPress}
          style={({ pressed }) => ({
            flex: 1,
            height: 52,
            borderRadius: radius.md,
            backgroundColor: colors.brandBright,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <SymbolView
            name={{ ios: 'square.and.arrow.up', android: 'file_upload', web: 'file_upload' }}
            tintColor={colors.brandBrightText}
            size={20}
          />
          <AppText variant="button" style={{ color: colors.brandBrightText }}>
            {primaryLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
