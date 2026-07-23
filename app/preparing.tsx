import { useEffect, useState, type JSX } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from '@/src/components/ui';
import { PrepareChecklist, type PrepareStep } from '@/src/features/generate';
import { useTheme } from '@/src/theme';

// Fake generation pacing. Replace with real backend progress later.
const STEP_MS = 700;

export default function PreparingScreen(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const params = useLocalSearchParams<{ count?: string; limit?: string }>();
  const count = params.count && params.count.length > 0 ? params.count : '20';
  const limit = params.limit && params.limit.length > 0 ? params.limit : '0';

  const steps: readonly PrepareStep[] = [
    { label: 'Kaynak tarandı' },
    { label: `${count} kelime yazıldı` },
    { label: 'İpuçları yazılıyor' },
    { label: 'Grid yerleştiriliyor' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((index) => Math.min(index + 1, steps.length));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [steps.length]);

  // When every step is done, move on to the review screen.
  useEffect(() => {
    if (currentIndex < steps.length) return;
    router.replace({ pathname: '/review', params: { count, limit } });
  }, [currentIndex, steps.length, count, limit]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing[6], justifyContent: 'center', gap: spacing[7] }}>
        <View style={{ alignItems: 'center', gap: spacing[4] }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radius.full,
              backgroundColor: colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SymbolView
              name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
              tintColor={colors.primary}
              size={32}
            />
          </View>
          <View style={{ alignItems: 'center', gap: spacing[1] }}>
            <AppText variant="h2">Bulmacan hazırlanıyor</AppText>
            <AppText variant="body" color="secondary">
              Genellikle 10 saniyeden kısa sürer
            </AppText>
          </View>
        </View>

        <PrepareChecklist steps={steps} currentIndex={currentIndex} />

        <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
          Bu ekrandan ayrılabilirsin — bitince haber veririz.
        </AppText>
      </View>
    </SafeAreaView>
  );
}
