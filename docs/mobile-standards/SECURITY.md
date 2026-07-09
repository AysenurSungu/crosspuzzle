# Mobile Standartları — Güvenlik ve Loglama

> Auth veya güvenlik işi yaparken okunur.

---

## Token Güvenliği

| ❌ Yasak | ✅ Zorunlu |
|---|---|
| AsyncStorage | expo-secure-store |
| MMKV (token için) | expo-secure-store |
| console.log(token) | Logger — prod'da kapalı |

```typescript
// ✅ Doğru
import * as SecureStore from "expo-secure-store";
await SecureStore.setItemAsync("accessToken", token);

// ❌ Yasak
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.setItem("accessToken", token);
```

---

## Hassas Veri Kuralları

| Kural | Açıklama |
|---|---|
| `console.log` prod'da yasak | `__DEV__` kontrolü ile veya logger kullan |
| PII masking | Email/isim loglanmaz |
| Token loglama yasak | Hiçbir token/key loglanmaz |
| HTTPS zorunlu | HTTP bağlantı kabul edilmez |
| `process.env` doğrudan yasak | `lib/env` üzerinden (bkz. ENV.md) |
| **Bulmaca cevabı loglama yasak** | `answer` / `answer_normalized` loglanmaz |

---

## Logger

```typescript
// lib/telemetry/logger.ts
import * as Sentry from "@sentry/react-native";

export const logger = {
  debug(message: string, data?: Record<string, unknown>): void {
    if (__DEV__) console.log(`[DEBUG] ${message}`, data);
  },
  info(message: string, data?: Record<string, unknown>): void {
    if (__DEV__) console.info(`[INFO] ${message}`, data);
    Sentry.addBreadcrumb({ message, data, level: "info" });
  },
  warn(message: string, data?: Record<string, unknown>): void {
    if (__DEV__) console.warn(`[WARN] ${message}`, data);
    Sentry.addBreadcrumb({ message, data, level: "warning" });
  },
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    if (__DEV__) console.error(`[ERROR] ${message}`, error, data);
    Sentry.captureException(error ?? new Error(message), { extra: data });
  },
};
```

**Kullanım:**
```typescript
// ✅ Doğru
logger.error("Bulmaca oluşturulamadı", error, { sourceId });

// ❌ Yasak
console.log("Token:", accessToken);
console.log("Cevap:", word.answer);
```

---

## Error Boundary

```tsx
// components/common/error-boundary.tsx
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react-native";
import { View, StyleSheet } from "react-native";
import { AppText, AppButton } from "@/components/ui";
import { spacing } from "@/theme/tokens";

function FallbackComponent({ resetError }: { resetError: () => void }): JSX.Element {
  return (
    <View style={styles.container}>
      <AppText variant="h3">Bir şeyler yanlış gitti</AppText>
      <AppText variant="body" color="secondary" style={styles.description}>
        Uygulama beklenmeyen bir hata ile karşılaştı.
      </AppText>
      <AppButton variant="primary" onPress={resetError}>Tekrar Dene</AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing[4] },
  description: { marginTop: spacing[2], marginBottom: spacing[4] },
});

export function AppErrorBoundary({ children }: { children: React.ReactNode }): JSX.Element {
  return <SentryErrorBoundary fallback={FallbackComponent}>{children}</SentryErrorBoundary>;
}
```

---

## Environment Variables

Detay ve validated erişim: **ENV.md**. Özet:

- Client env sadece `lib/env` üzerinden okunur, `process.env.X!` yasak.
- `EXPO_PUBLIC_` prefix'i olan değerler client bundle'ında görünür — secret bu prefix'i almaz.
- Service role key / Claude API key sadece Edge Function ortamında; client'a girmez.
- `.env` commit edilmez; prod değerler EAS/CI üzerinden sağlanır.

---

## CrossPuzzle'a Özel Güvenlik Notları

- Supabase RLS tüm tablolarda aktif — client direkt DB'ye yazamaz (bkz. SUPABASE-RLS.md).
- **Bulmaca cevapları** (`puzzle_words.answer`) çözerken client'a hiç gitmez; clue servis + cevap kontrolü Edge Function'da.
- Skor/süre/xp/level yalnızca Edge Function tarafından yazılır — client insert-only.
- Claude API çağrısı yalnızca Edge Function proxy üzerinden; API key client'ta bulunmaz.
- Oda koduyla katılım Edge Function'da (kod tahmini/rate limit koruması).
