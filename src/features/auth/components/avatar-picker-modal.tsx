import { useEffect, useState, type JSX } from 'react';
import { FlatList, Image, Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { AVATARS, type AvatarOption } from '../avatars';

const COLUMNS = 3;

type GridItem = AvatarOption | { id: string; placeholder: true };

function isPlaceholder(item: GridItem): item is { id: string; placeholder: true } {
  return 'placeholder' in item;
}

// Pad the list so the last row is always full; the trailing empty cells
// keep the real avatars at a fixed size instead of stretching them.
function withPlaceholders(avatars: readonly AvatarOption[]): GridItem[] {
  const remainder = avatars.length % COLUMNS;
  if (remainder === 0) return [...avatars];
  const fillCount = COLUMNS - remainder;
  const fillers: GridItem[] = Array.from({ length: fillCount }, (_, i) => ({
    id: `placeholder-${i}`,
    placeholder: true,
  }));
  return [...avatars, ...fillers];
}

const GRID_DATA = withPlaceholders(AVATARS);

export interface AvatarPickerModalProps {
  visible: boolean;
  selectedId: string | null;
  onApply: (id: string | null) => void;
  onClose: () => void;
}

export function AvatarPickerModal({
  visible,
  selectedId,
  onApply,
  onClose,
}: AvatarPickerModalProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();
  const [draftId, setDraftId] = useState<string | null>(selectedId);

  // Sync the local draft with the confirmed selection each time the
  // modal opens, so re-opening starts from the applied avatar.
  useEffect(() => {
    if (visible) setDraftId(selectedId);
  }, [visible, selectedId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="İptal"
            onPress={onClose}
            hitSlop={8}
          >
            <AppText variant="button" color="accent">İptal</AppText>
          </Pressable>
          <AppText variant="h3">Avatar seç</AppText>
          <View style={{ width: 48 }} />
        </View>

        <FlatList
          data={GRID_DATA}
          keyExtractor={(item) => item.id}
          numColumns={COLUMNS}
          contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}
          columnWrapperStyle={{ gap: spacing[4] }}
          renderItem={({ item }) => {
            if (isPlaceholder(item)) {
              return <View style={{ flex: 1 }} />;
            }
            const isSelected = item.id === draftId;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setDraftId(item.id)}
                style={{ flex: 1, alignItems: 'center' }}
              >
                <View
                  style={{
                    aspectRatio: 1,
                    width: '100%',
                    borderRadius: radius.full,
                    borderWidth: isSelected ? 3 : 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: colors.primarySoft,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={item.source}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            );
          }}
        />

        <View style={{ padding: spacing[5] }}>
          <AppButton
            label="Uygula"
            onPress={() => onApply(draftId)}
            accessibilityHint="Seçili avatarı uygular ve profil ekranına döner"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
