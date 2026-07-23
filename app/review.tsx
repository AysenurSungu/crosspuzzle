import { useState, type JSX } from 'react';
import { ScrollView, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText, ScreenHeader } from '@/src/components/ui';
import { ActionButton } from '@/src/features/generate';
import { ReviewWordCard, type ReviewWord } from '@/src/features/review';
import { samplePuzzle } from '@/src/features/puzzle';
import { useTheme } from '@/src/theme';

const REMOVED_COUNT = 2;

export default function ReviewScreen(): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const params = useLocalSearchParams<{ limit?: string }>();
  const limit = params.limit && params.limit.length > 0 ? params.limit : '0';

  const [words, setWords] = useState<ReviewWord[]>(() =>
    samplePuzzle.words.map((word) => ({ id: word.id, answer: word.answer, clue: word.clue })),
  );
  const [editingId, setEditingId] = useState<number | null>(null);

  const goBack = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const toggleEdit = (id: number): void => {
    setEditingId((current) => (current === id ? null : id));
  };

  const changeClue = (id: number, next: string): void => {
    setWords((prev) => prev.map((word) => (word.id === id ? { ...word, clue: next } : word)));
  };

  const deleteWord = (id: number): void => {
    setWords((prev) => prev.filter((word) => word.id !== id));
    setEditingId((current) => (current === id ? null : current));
  };

  const onCreate = (): void => {
    // Collapse the generate flow so closing the puzzle returns home, then
    // open the (canned) puzzle renderer.
    router.dismissAll();
    router.push({ pathname: '/puzzle', params: { limit } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Soruları gözden geçir" onBack={goBack} />

      <ScrollView
        contentContainerStyle={{ padding: spacing[5], gap: spacing[4], paddingBottom: spacing[9] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="body" color="secondary" style={{ flex: 1 }}>
            Her soruyu düzenleyebilir veya silebilirsin.
          </AppText>
          <AppText variant="label" color="secondary">{words.length} kelime</AppText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[2],
            backgroundColor: colors.surfaceMuted,
            borderRadius: radius.lg,
            padding: spacing[3],
          }}
        >
          <SymbolView
            name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
            tintColor={colors.textSecondary}
            size={16}
          />
          <AppText variant="caption" color="secondary" style={{ flex: 1 }}>
            {REMOVED_COUNT} kelime yeterli kesişim bulunamadığı için çıkarıldı.
          </AppText>
        </View>

        {words.map((word) => (
          <ReviewWordCard
            key={word.id}
            word={word}
            isEditing={editingId === word.id}
            onToggleEdit={() => toggleEdit(word.id)}
            onChangeClue={(next) => changeClue(word.id, next)}
            onDelete={() => deleteWord(word.id)}
          />
        ))}

        <ActionButton label="Bulmacayı oluştur" onPress={onCreate} />

        <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
          Bulmaca özel kaydedilir — istersen sonra yayınlarsın.
        </AppText>
      </ScrollView>
    </View>
  );
}
