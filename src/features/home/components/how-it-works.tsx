import { type JSX } from 'react';
import { View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

const STEPS: readonly string[] = [
  'Ders notunu yükle',
  'Konuyu seç, bulmaca üret',
  'Oyna, öğren, seri yap',
];

export function HowItWorks(): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <AppText variant="h3">Nasıl çalışır</AppText>

      <View style={{ gap: spacing[4] }}>
        {STEPS.map((step, index) => (
          <View
            key={step}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: radius.full,
                backgroundColor: colors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText variant="label" color="accent">{index + 1}</AppText>
            </View>
            <AppText variant="body">{step}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
