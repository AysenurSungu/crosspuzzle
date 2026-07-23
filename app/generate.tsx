import { useState, type JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppInput, AppText, ScreenHeader } from '@/src/components/ui';
import { ActionButton, SourceChip, Stepper } from '@/src/features/generate';
import { samplePuzzle } from '@/src/features/puzzle';
import { useTheme } from '@/src/theme';

export default function GenerateScreen(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const params = useLocalSearchParams<{ source?: string }>();

  const sourceName =
    params.source && params.source.length > 0 ? params.source : samplePuzzle.source;

  const [topic, setTopic] = useState('Kalp kapak hastalıkları');
  const [wordCount, setWordCount] = useState(20);
  // Duration in minutes; 0 means "Süresiz" (no time limit).
  const [minutes, setMinutes] = useState(5);

  const goBack = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const onGenerate = (): void => {
    router.push({
      pathname: '/preparing',
      params: { count: String(wordCount), limit: String(minutes) },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Bulmaca Üret" onBack={goBack} />

      <ScrollView
        contentContainerStyle={{ padding: spacing[5], gap: spacing[5], paddingBottom: spacing[9] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing[2] }}>
          <AppText variant="label" color="secondary">Kaynak</AppText>
          <SourceChip name={sourceName} />
        </View>

        <AppInput
          label="Konu / kapsam"
          value={topic}
          onChangeText={setTopic}
          placeholder="Örn. Kalp kapak hastalıkları"
        />

        <View style={{ gap: spacing[2] }}>
          <AppText variant="label" color="secondary">Kelime sayısı</AppText>
          <Stepper value={wordCount} min={5} max={30} onChange={setWordCount} />
        </View>

        <View style={{ gap: spacing[2] }}>
          <AppText variant="label" color="secondary">Süre</AppText>
          <Stepper
            value={minutes}
            min={0}
            max={20}
            onChange={setMinutes}
            formatValue={(v) => (v === 0 ? 'Süresiz' : `${v} dk`)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[2],
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing[3],
          }}
        >
          <AppText variant="caption" color="secondary" style={{ flex: 1 }}>
            Büyük kaynaklardan farklı konularda birden çok bulmaca üretebilirsin.
          </AppText>
        </View>

        <ActionButton
          label="Üret"
          icon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
          onPress={onGenerate}
        />
      </ScrollView>
    </View>
  );
}
