# Mobile Standartları — UI ve Component

> UI bileşeni, tema veya stil yazarken okunur.
> Token disiplini Fısıltı standardından taşındı; renk/tipografi değerleri
> CrossPuzzle'a özel yeniden tanımlanacak (marka kararı bekliyor).

---

## Token Sistemi (ZORUNLU)

Tüm görsel değerler token dosyalarından gelir. Hardcoded değer yasaktır.

```
src/theme/
├── colors.ts            # Renk paleti + semantik renkler
├── theme.ts             # useTheme() hook + tip tanımları
└── tokens/
    └── index.ts         # spacing, radius, typography token'ları
```

### Renk Kullanımı

```typescript
// ✅ Doğru — useTheme hook ile dinamik renk
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background }} />
<Text style={{ color: colors.text }}>Merhaba</Text>

// ✅ Doğru — token ile statik değer
import { spacing, radius } from "@/theme/tokens";
<View style={{ padding: spacing[4], borderRadius: radius.lg }} />

// ❌ Yasak — hardcoded hex
<View style={{ backgroundColor: '#0F2D4D', padding: 16 }} />
```

### Renk Token'ları (TBD — marka kararı)

Semantik isimler sabit kalır, değerler marka aşamasında doldurulur:

| Token | Kullanım |
|---|---|
| `colors.background` | Ana zemin |
| `colors.card` | Kart zemini |
| `colors.surface` | Yüzeyler |
| `colors.primary` | Ana vurgu — butonlar |
| `colors.text` | Ana metin |
| `colors.textSecondary` | İkincil metin |
| `colors.textMuted` | Zaman damgası, ipucu |
| `colors.border` | Sınırlar |
| `colors.cellEmpty` | Boş grid hücresi |
| `colors.cellActive` | Seçili hücre |
| `colors.cellCorrect` | Doğru harf feedback |
| `colors.cellWrong` | Yanlış harf feedback |
| `colors.cellBlock` | Bloklu (kullanılmayan) hücre |

---

## Tipografi

Font ailesi marka aşamasında netleşir. Öncelik açık kaynak (ör. Inter + bir başlık fontu). Lisanslı font (Gilroy vb.) kullanılacaksa lisans şart.

### Varyantlar (iskele)

| Variant | Kullanım |
|---|---|
| `h1` | Büyük başlıklar |
| `h2` | Ekran başlıkları |
| `h3` | Alt başlıklar |
| `body` | Gövde metni |
| `caption` | Küçük metin |
| `button` | Buton metni |
| `clue` | Bulmaca ipucu metni |
| `cellLetter` | Grid hücresindeki harf |
| `timestamp` | Zaman/istatistik metni |

```typescript
// ✅ Doğru — AppText variant kullan
<AppText variant="clue">3 harfli, başkent...</AppText>

// ❌ Yasak — inline font style
<Text style={{ fontSize: 26, fontFamily: 'Inter' }}>...</Text>
```

---

## Base Component'lar

| Component | Sorumluluk |
|---|---|
| `AppText` | Tipografi — tüm varyantlar |
| `Card` | Surface container |
| `AppButton` | Buton — primary/secondary/ghost + a11y |
| `AppInput` | Form input |
| `GridCell` | Tek bulmaca hücresi — boş/aktif/doğru/yanlış/blok |
| `CrosswordGrid` | Hücre matrisi render — 60 FPS, memo |
| `ClueList` | Across/down ipucu listesi |

### AppText

```typescript
interface AppTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption"
           | "button" | "clue" | "cellLetter" | "timestamp";
  color?: "primary" | "secondary" | "muted" | "accent";
}

export function AppText({ variant = "body", color = "primary", style, ...props }: AppTextProps): JSX.Element {
  const { colors, typography } = useTheme();
  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.primary,
  };
  return <Text style={[typography[variant], { color: colorMap[color] }, style]} {...props} />;
}
```

### AppButton

```typescript
export function AppButton({ variant = "primary", onPress, children, disabled, style }: AppButtonProps): JSX.Element {
  const { colors, typography } = useTheme();
  const variantStyles = {
    primary:   { container: { backgroundColor: colors.primary }, text: { color: colors.background } },
    secondary: { container: { backgroundColor: colors.surface }, text: { color: colors.text } },
    ghost:     { container: { backgroundColor: "transparent" }, text: { color: colors.primary } },
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: radius.full,
          paddingVertical: 14,
          paddingHorizontal: 32,
          alignItems: "center" as const,
          opacity: pressed ? 0.85 : disabled ? 0.4 : 1,
        },
        variantStyles[variant].container,
        style,
      ]}
    >
      <Text style={[typography.button, variantStyles[variant].text]}>{children}</Text>
    </Pressable>
  );
}
```

---

## Erişilebilirlik (a11y)

| Kural | Açıklama |
|---|---|
| `accessibilityRole` | Tüm base component'lerde zorunlu |
| `accessibilityLabel` | İkon/metin içermeyen butonlarda zorunlu |
| `accessibilityState` | disabled, selected belirtilmeli |
| Grid hücresi | Koordinat + durum a11y label (ör. "satır 2, sütun 3, boş") |
| Kontrast | Metin/zemin kontrastı WCAG AA |

---

## Performance (Grid Kritik)

```tsx
// Hücre memo + stable key
const MemoizedCell = memo(GridCell);
const handleCellPress = useCallback((r: number, c: number) => { ... }, []);
// key={`${r}-${c}`} — asla key={index}

// Uzun listeler (bulmaca feed, geçmiş) FlashList
<FlashList data={puzzles} renderItem={...} estimatedItemSize={96} keyExtractor={(p) => p.id} />
```

- Grid highlight / doğru-yanlış feedback animasyonları **Reanimated** (UI thread).
- Hücre etkileşimi 60 FPS altına düşmemeli (bkz. CROSSWORD-ENGINE.md).
