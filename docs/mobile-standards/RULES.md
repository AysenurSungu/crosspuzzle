# Mobile Standartları — Değiştirilemez Kurallar

> Bu dosya her görev başında okunur.
> Detaylı açıklamalar için diğer standart dosyalarına bakılır.

---

## Değiştirilemez Kurallar

Bu kuralların ihlali code review'da **reddedilme** sebebidir:

| Kural | Durum |
|---|---|
| TypeScript strict mode | ❌ Kapatılamaz |
| `any` type kullanımı | ❌ Yasak — `unknown` + type guard kullan |
| Default exports (Expo Router hariç) | ❌ Yasak |
| Token AsyncStorage'da | ❌ Yasak — expo-secure-store kullan |
| `console.log` (production) | ❌ Yasak — logger kullan |
| `!` non-null assertion | ❌ Yasak — optional chaining kullan |
| `// @ts-ignore` | ❌ Yasak — sorunu çöz |
| `process.env.X` doğrudan erişim | ❌ Yasak — sadece `lib/env` üzerinden (bkz. ENV.md) |
| `useEffect` + `fetch` + `setState` | ❌ Yasak — TanStack Query kullan |
| `key={index}` dinamik listede | ❌ Yasak — unique stable key kullan |
| Hardcoded renk/spacing/radius | ❌ Yasak — token sistemi kullan |
| HTTP (HTTPS yerine) | ❌ Yasak |
| PII loglama | ❌ Yasak |
| Auth test coverage < %80 | ❌ Yasak |
| Expo uyumsuz paket ekleme | ❌ Yasak |
| Sayfa (route) 70+ satır | ❌ Yasak — feature component'e taşı |
| İş mantığı sayfada | ❌ Yasak — feature hook'a taşı |
| **Client'ta bulmaca cevabı okuma/servis** | ❌ Yasak — Edge Function (bkz. SUPABASE-RLS.md) |
| **Client'ta skor/xp/level yazımı** | ❌ Yasak — Edge Function |
| **Grid normalizasyonu engine dışında** | ❌ Yasak — `answer_normalized` ile tek kaynak (bkz. CROSSWORD-ENGINE.md) |

---

## Manuel Review Gerektiren Alanlar

Bu alanlara dokunan her değişiklik kullanıcı onayı alınmadan uygulanamaz:

- Auth akışı (login, OTP, token yönetimi)
- API client / interceptor değişiklikleri
- Supabase client yapılandırması
- expo-secure-store kullanımı
- Env şeması değişiklikleri (`lib/env`)
- RLS'e dokunan client sorguları (özellikle `puzzle_words`, `attempts`)
- Cevap kontrolü / skor hesaplama akışı

---

## Anti-Pattern Tabloları

### State Management

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| `useEffect` + `fetch` + `useState` | TanStack Query | Cache, retry otomatik |
| Server state'i Zustand'da | TanStack Query | Zustand sadece client state |
| Her şey global state | Local state öncelikli | Gereksiz complexity |
| Async logic store içinde | TanStack Query mutations | Separation of concerns |
| Store'da türetilmiş veri | Selector ile hesapla | Tek kaynak |

### Component

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| `export default function` | `export function` | Named export tutarlılığı |
| 300+ satır component | Max 100-150 satır | Single responsibility |
| 50+ satır sayfa (route) | Max 30-50 satır (70 tolerans) | Sayfa sadece orkestrasyon |
| İş mantığı sayfada | Feature hook'ta | Separation of concerns |
| Hardcoded renk/spacing | Token sistemi | `#fff` → `colors.card` |
| Raw View/Text tekrar eden pattern | Base component | 2+ dosyada aynı → base component |
| Props'ta `any` | Explicit interface | Type safety |
| Component içinde component | Ayrı dosyaya çıkar | Re-render sorunu |

### Performance

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| `FlatList` 1000+ item | `FlashList` | Performans |
| `key={index}` dinamik liste | Unique stable key | Reconciliation bug |
| Inline object/array prop | `useMemo` veya dışarıda | Gereksiz re-render |
| JS thread'de ağır animasyon | Reanimated (UI thread) | Grid/hücre 60 FPS şart |
| `<Image>` (RN core) | `expo-image` | Caching, placeholder |
| Her render'da yeni callback | `useCallback` | Child re-render |

### Security

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| Token AsyncStorage'da | expo-secure-store | Şifreli storage |
| `console.log(token)` | Logger (prod kapalı) | Token sızıntısı |
| `console.log(user)` | PII maskeleme | KVKK/GDPR |
| HTTP kullanımı | HTTPS zorunlu | MitM koruması |
| `process.env` doğrudan | `lib/env` | Validated, tek kaynak |
| Client'ta cevap sorgusu | Edge Function | Cevap sızıntısı |

### Navigation

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| Untyped params | Typed route params | Type safety |
| Navigation logic component'te | Custom hook | Separation of concerns |
| Auth check her ekranda | Layout'ta guard | DRY |

### API

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| Component içinde raw fetch | Merkezi API client | Interceptor, error handling |
| Manuel loading state | TanStack Query | Boilerplate azalt |
| Her yerde try-catch | Global error handler | Tutarlılık |
| Response type `any` | Typed response + Zod | Runtime safety |

### TypeScript

| ❌ Yanlış | ✅ Doğru | Açıklama |
|---|---|---|
| `any` type | `unknown` + guard | Type safety |
| `as` assertion | Type narrowing | Runtime hata önleme |
| `!` non-null assertion | Optional chaining / `lib/env` | Null safety |
| `// @ts-ignore` | Sorunu çöz | Teknik borç |
| Implicit return type | Explicit return type | API kontratı |

---

## PR Kuralları

| Kural | Açıklama |
|---|---|
| PR başlığı | `feat/fix/chore(scope): açıklama` |
| Max diff | 400 LOC — gerekirse böl |
| UI değişikliği | Ekran görüntüsü veya video zorunlu |
| Logic değişikliği | Test zorunlu |
| Expo config değişikliği | Build/test notu zorunlu |
| Base = `dev`, compare = `feature/...` | bkz. `docs/git-workflow.md` |
