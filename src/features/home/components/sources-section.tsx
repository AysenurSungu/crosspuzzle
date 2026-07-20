import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';

export interface SourcesSectionProps {
  onUploadPress: () => void;
}

export function SourcesSection({ onUploadPress }: SourcesSectionProps): JSX.Element {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <AppText variant="h3">Kaynaklarım</AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kaynak yükle"
        accessibilityHint="PDF, DOCX veya notunu yükler"
        onPress={onUploadPress}
        style={({ pressed }) => ({
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.border,
          backgroundColor: colors.surface,
          paddingVertical: spacing[8],
          paddingHorizontal: spacing[5],
          alignItems: 'center',
          gap: spacing[3],
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SymbolView
            name={{ ios: 'doc.badge.plus', android: 'note_add', web: 'note_add' }}
            tintColor={colors.primary}
            size={26}
          />
        </View>
        <View style={{ alignItems: 'center', gap: spacing[1] }}>
          <AppText variant="bodyStrong">Henüz kaynak yok</AppText>
          <AppText variant="caption" color="secondary">
            PDF, DOCX veya notunu yükle
          </AppText>
        </View>
      </Pressable>
    </View>
  );
}
