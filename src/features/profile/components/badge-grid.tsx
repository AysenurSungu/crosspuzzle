import { type JSX } from 'react';
import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

const COLUMNS = 3;
const ROWS = 2;

function BadgeTile(): JSX.Element {
  const { colors, radius } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        aspectRatio: 1,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borderMuted,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SymbolView
        name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
        tintColor={colors.textMuted}
        size={22}
      />
    </View>
  );
}

export function BadgeGrid(): JSX.Element {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <AppText variant="h3">Rozetler</AppText>
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: ROWS }, (_, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', gap: spacing[3] }}>
            {Array.from({ length: COLUMNS }, (_, colIndex) => (
              <BadgeTile key={colIndex} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
