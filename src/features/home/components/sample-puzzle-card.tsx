import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface SamplePuzzleCardProps {
  onPress: () => void;
}

export function SamplePuzzleCard({ onPress }: SamplePuzzleCardProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Örnek bulmacayı dene"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[4],
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.full,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SymbolView
          name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
          tintColor={colors.primary}
          size={22}
        />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">Örnek bulmacayı dene</AppText>
        <AppText variant="caption" color="secondary">
          Yükleme yapmadan hemen oyna
        </AppText>
      </View>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        tintColor={colors.textMuted}
        size={18}
      />
    </Pressable>
  );
}
