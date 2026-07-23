import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppInput, AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface ReviewWord {
  id: number;
  answer: string;
  clue: string;
}

export interface ReviewWordCardProps {
  word: ReviewWord;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChangeClue: (next: string) => void;
  onDelete: () => void;
}

function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]['name'];
  label: string;
  onPress: () => void;
}): JSX.Element {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 34,
        height: 34,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <SymbolView name={icon} tintColor={colors.text} size={15} />
    </Pressable>
  );
}

export function ReviewWordCard({
  word,
  isEditing,
  onToggleEdit,
  onChangeClue,
  onDelete,
}: ReviewWordCardProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: isEditing ? colors.primary : colors.borderMuted,
        padding: spacing[4],
        gap: spacing[2],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="bodyStrong">{word.answer}</AppText>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <IconButton
            icon={
              isEditing
                ? { ios: 'checkmark', android: 'check', web: 'check' }
                : { ios: 'pencil', android: 'edit', web: 'edit' }
            }
            label={isEditing ? 'Bitir' : 'Düzenle'}
            onPress={onToggleEdit}
          />
          <IconButton
            icon={{ ios: 'trash', android: 'delete', web: 'delete' }}
            label="Sil"
            onPress={onDelete}
          />
        </View>
      </View>

      {isEditing ? (
        <AppInput
          value={word.clue}
          onChangeText={onChangeClue}
          multiline
          placeholder="İpucu metni"
        />
      ) : (
        <AppText variant="body" color="secondary">{word.clue}</AppText>
      )}
    </View>
  );
}
