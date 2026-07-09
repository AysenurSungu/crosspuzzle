# Mobile Standartları — Mimari ve Proje Yapısı

> Yeni dosya, feature veya ekran eklerken okunur.

---

## Proje Yapısı

```
src/
├── app/                          # Expo Router — SADECE orkestrasyon
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx             # max 70 satır
│   │   └── verify.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx              # keşif / bulmacalarım
│   │   ├── library.tsx           # kaynaklar
│   │   ├── history.tsx           # geçmiş denemeler
│   │   └── settings.tsx
│   ├── puzzle/
│   │   ├── [id]/edit.tsx         # düzenleme (kendi bulmacan)
│   │   └── [id]/solve.tsx        # çözme ekranı
│   ├── room/
│   │   ├── create.tsx
│   │   └── [code].tsx            # Faz 4
│   ├── _layout.tsx
│   └── +not-found.tsx
│
├── features/                     # Feature-bazlı organizasyon
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/              # Zod validation
│   │   └── index.ts              # Barrel export
│   ├── source/                   # Kaynak yükleme (PDF/görsel)
│   ├── puzzle/                   # Bulmaca oluşturma/listeleme
│   ├── solve/                    # Çözme akışı + grid
│   ├── room/                     # Çok oyunculu (Faz 4)
│   ├── profile/                  # Kullanıcı profili, xp/level
│   └── history/                  # Geçmiş denemeler
│
├── components/
│   ├── ui/                       # SADECE base component'lar
│   │   ├── app-text.tsx
│   │   ├── app-button.tsx
│   │   ├── app-input.tsx
│   │   ├── card.tsx
│   │   └── index.ts
│   └── common/
│       ├── error-boundary.tsx
│       └── index.ts
│
├── hooks/                        # SADECE global hook'lar
│   ├── use-theme.ts
│   ├── use-auth.ts
│   └── index.ts
│
├── lib/
│   ├── env.ts                    # Validated env (bkz. ENV.md)
│   ├── api/
│   │   ├── client.ts             # Axios instance (Edge Functions)
│   │   ├── supabase.ts           # Supabase client
│   │   ├── query-keys.ts
│   │   └── endpoints/
│   ├── auth/
│   │   ├── token-service.ts
│   │   └── constants.ts
│   ├── crossword/                # Engine — saf modül (bkz. CROSSWORD-ENGINE.md)
│   │   ├── normalize.ts
│   │   ├── grid-builder.ts
│   │   ├── numbering.ts
│   │   └── validate.ts
│   ├── telemetry/
│   │   └── logger.ts
│   └── utils/
│
├── stores/                       # Zustand (minimal)
│   └── auth-store.ts
│
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── puzzle.ts
│   └── index.ts
│
└── theme/
    ├── tokens/
    │   ├── colors.ts
    │   ├── spacing.ts
    │   ├── radius.ts
    │   └── typography.ts
    ├── theme.ts
    └── index.ts
```

---

## Katman Sorumlulukları

| Katman | Sorumluluk | Satır Limiti |
|---|---|---|
| Sayfa (`app/`) | Layout + component çağırma | 30-50 (max 70) |
| Feature Component (`features/*/components/`) | UI render | 100-150 |
| Feature Hook (`features/*/hooks/`) | İş mantığı, state, validation | Sınırsız |
| Base Component (`components/ui/`) | Reusable UI primitives | 50-100 |
| Engine (`lib/crossword/`) | Saf iş mantığı, React yok | — |

---

## Ne Zaman Nereye?

| Durum | Konum |
|---|---|
| Sadece 1 feature kullanıyor | `features/xxx/components/` |
| 2+ feature kullanıyor | `components/ui/` veya `components/common/` |
| Global state (auth, theme) | `hooks/` veya `stores/` |
| Feature-specific state | `features/xxx/hooks/` |
| API endpoint | `lib/api/endpoints/` |
| Validation schema | `features/xxx/schemas/` |
| Grid/normalizasyon mantığı | `lib/crossword/` |

---

## Naming Conventions

| Tip | Format | Örnek |
|---|---|---|
| Component dosyası | kebab-case | `puzzle-card.tsx` |
| Component adı | PascalCase | `PuzzleCard` |
| Hook | camelCase + use | `usePuzzle` |
| Utility | camelCase | `formatDate` |
| Type/Interface | PascalCase | `Puzzle`, `ApiResponse` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_GRID_SIZE` |
| Store | camelCase + Store | `useAuthStore` |
| Test dosyası | `.test` | `puzzle-card.test.tsx` |

---

## TypeScript Kuralları

### Zorunlu Ayarlar (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

| Kural | Açıklama |
|---|---|
| `any` yasak | `unknown` + type guard kullan |
| `!` non-null assertion yasak | Optional chaining (`?.`) veya `lib/env` |
| Explicit return type | Public fonksiyon/hook'larda zorunlu |
| `as` assertion yasak | Type narrowing kullan |

---

## Navigation (Expo Router)

- Route'lar `app/` altında tutulur, layout'lar `_layout.tsx`
- Protected routes: `(auth)` / `(tabs)` route groups
- Auth guard layout'ta yapılır, her ekranda tekrarlanmaz

```typescript
// types/navigation.ts
export type RootStackParamList = {
  "(tabs)": undefined;
  "(auth)/login": undefined;
  "(auth)/verify": { email: string };
  "puzzle/[id]/solve": { id: string };
  "puzzle/[id]/edit": { id: string };
  "room/[code]": { code: string };
};

// Kullanım
import { useLocalSearchParams } from "expo-router";

export default function SolveScreen(): JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```

---

## Sayfa Örneği (Temiz)

```tsx
// app/(tabs)/home.tsx — max 70 satır
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PuzzleFeed, CreateButton } from '@/features/puzzle';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

export default function HomeScreen(): JSX.Element {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing[6] }}>
        <PuzzleFeed />
        <CreateButton />
      </View>
    </SafeAreaView>
  );
}
```
