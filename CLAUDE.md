@AGENTS.md

# CrossPuzzle

Kaynaktan (PDF/görsel) otomatik çapraz bulmaca üreten Expo / React Native
mobil uygulaması. Kullanıcı akışı: **kaynak yükle → bulmaca üret → süreli çöz**.
Backend Supabase; bulmaca üretimi, cevap kontrolü ve skor/xp hesabı
**Edge Function'larda** yapılır — client "dumb renderer"dır, çözümü kendi
üretmez veya doğrulamaz.

## Tech Stack

- **Expo SDK 57** (`~57.0.2`), **React Native 0.86**, **React 19.2**
- **expo-router** ~57 — dosya tabanlı routing (`app/`)
- **TypeScript strict** (`expo/tsconfig.base` + `strict: true`)
- **Supabase** (`@supabase/supabase-js`) — email OTP auth, Postgres, Edge Functions
- **expo-secure-store** — auth token'ları (chunk'lanmış adapter)
- **@t3-oss/env-core + zod** — doğrulanmış ortam değişkenleri
- **react-native-reanimated 4** — animasyon (UI thread)

> ⚠️ Expo SDK 57 birçok API'yi değiştirdi. Kod yazmadan önce
> https://docs.expo.dev/versions/v57.0.0/ adresindeki **versiyonlu** dokümana bak
> (bkz. AGENTS.md).

## Komutlar

```bash
npm start          # expo start (Metro + dev menü)
npm run android    # Android emülatör/cihaz
npm run ios        # iOS simülatör
npm run web        # web (metro bundler)
npm run tunnel     # expo start --tunnel (uzak cihaz için)
```

Build/submit **EAS** ile (`eas.json`): `development` / `preview` / `production`
profilleri. `appVersionSource: remote`, production `autoIncrement`.

Test/lint script'i henüz tanımlı değil — eklenirse bu bölümü güncelle.

## Ortam Değişkenleri

- `.env.example` → `.env.dev` olarak kopyala, değerleri Supabase panelinden doldur.
- Sadece `EXPO_PUBLIC_*` değişkenleri kullanılır ve **client bundle'ına gömülür** —
  buraya asla secret (service role key, SMTP/Gmail şifresi, API key) koyma.
- Env'e **yalnızca `src/lib/env.ts` üzerinden** eriş. `process.env.X` doğrudan
  erişim yasak; `EXPO_PUBLIC_*` Babel'de build-time inline edilir, dinamik erişim
  (`process.env[key]`) çalışmaz — her değişken şemada açıkça yazılmalı.
- Değişkenler: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  `EXPO_PUBLIC_EAS_PROJECT_ID` (opsiyonel).

## Mimari

Feature-bazlı organizasyon. Katman sorumlulukları ve satır limitleri:

| Katman | Konum | Sorumluluk | Limit |
|---|---|---|---|
| Sayfa (route) | `app/` | Sadece orkestrasyon: layout + component çağırma | ≤70 satır |
| Feature component | `src/features/*/components/` | UI render | 100–150 satır |
| Feature hook | `src/features/*/hooks/` | İş mantığı, state, validation | — |
| Base component | `src/components/ui/` | Reusable UI primitive (2+ feature) | 50–100 satır |
| Lib | `src/lib/` | env, `api/supabase`, `auth/secure-store-adapter`, engine | — |
| Theme | `src/theme/` | Token sistemi (colors/spacing/radius/typography) | — |

Her feature bir barrel `index.ts` ile dışa açılır; ekranlar feature'ı bu barrel'dan
import eder (örn. `import { EmailForm } from '@/src/features/auth'`).

**Path alias:** `@/*` → **repo kökü** (`tsconfig.json`). Yani `@/src/features/...`,
`@/src/theme`, `@/components/...` (kök `components/`). `src/` alias'a dahil değil.

**Routing:** `app/_layout.tsx` root Stack + onboarding/auth yönlendirmesi yapar.
Route grupları: `app/(onboarding)/`, `app/(auth)/`. Diğer ekranlar düz route
(`index`, `generate`, `preparing`, `review`, `puzzle`, `profile`, `settings`).
Onboarding "görüldü" bilgisi AsyncStorage'da (`@crosspuzzle/hasSeenOnboarding`).

## Değiştirilemez Kurallar

`docs/mobile-standards/RULES.md` ihlali code review'da red sebebidir. Öne çıkanlar:

- TypeScript **strict** kapatılamaz; `any` yasak (`unknown` + type guard kullan).
- **Named export** zorunlu — `export function`. Default export sadece Expo Router
  route/layout dosyalarında (framework gereği).
- Auth token **yalnızca expo-secure-store**'da; AsyncStorage'a token yazma yasak.
- `console.log` (prod), `!` non-null assertion, `// @ts-ignore` yasak.
- **Hardcoded renk/spacing/radius yasak** — her zaman `useTheme()` token'ları.
- **Cevap/skor/xp client'ta yok** — bulmaca cevabı okuma/servis, skor yazımı,
  grid normalizasyonu Edge Function / engine içinde (bkz. SUPABASE-RLS,
  CROSSWORD-ENGINE). Client çözümü doğrulamaz.
- Explicit return type (public fonksiyon/hook), `key={index}` yasak, HTTPS zorunlu,
  PII loglama yasak, Expo-uyumsuz paket ekleme yasak.
- Sayfa ≤70 satır; iş mantığı sayfada değil feature hook'ta.

**Manuel onay gerektiren alanlar** (kullanıcı onayı olmadan değiştirme): auth akışı,
API client/interceptor, Supabase client config, expo-secure-store, `lib/env` şeması,
RLS'e dokunan sorgular, cevap kontrolü/skor akışı.

## Konvansiyonlar

| Tip | Format | Örnek |
|---|---|---|
| Dosya (component/hook/util) | kebab-case | `email-form.tsx`, `use-email-login.ts` |
| Component adı | PascalCase | `EmailForm` |
| Hook | `use` + camelCase | `useEmailLogin` |
| Type / Interface | PascalCase | `Puzzle`, `PuzzleModel` |
| Constant | SCREAMING_SNAKE_CASE | `CHUNK_SIZE`, `STEP_MS` |

- Kod ve yorumlar **Türkçe** (UI metinleri de Türkçe).
- Bileşen dönüş tipi açıkça `JSX.Element` yazılır.
- Hook'lar `{ state, error, submitting, submit }` gibi açık bir sonuç arayüzü döner.

## Standart Dokümanları

`docs/mobile-standards/` altında ayrıntılı standartlar var — **RULES.md her görev
başında** okunur:

- `RULES.md` — değiştirilemez kurallar, anti-pattern tabloları, PR kuralları
- `ARCHITECTURE.md` — hedef proje yapısı, katmanlar, naming
- `ENV.md` — ortam değişkeni yönetimi
- `SECURITY.md` — token/PII, secure-store
- `SUPABASE-RLS.md` — RLS politikaları, Edge Function sınırı
- `CROSSWORD-ENGINE.md` — grid/normalizasyon engine kontratı
- `STATE-API.md`, `REALTIME.md`, `UI.md`, `TESTING.md`

Görev planları: `docs/tasks/`.

## Git / PR

- Base branch **`dev`**; feature branch `feature/...` (örn. `feature/02-backendservices`).
- Commit ve PR başlığı **conventional**: `feat/fix/chore(scope): açıklama`.
- Max diff ~400 LOC (gerekirse böl). UI değişikliğinde ekran görüntüsü/video,
  logic değişikliğinde test beklenir.

## Mevcut Durum (henüz hedeften sapan noktalar)

Kod erken fazda; `docs/mobile-standards/ARCHITECTURE.md` kısmen **hedef** yapıyı
anlatır. Bugünkü gerçek:

- `app/` **repo kökünde** (dokümandaki `src/app/` değil).
- **TanStack Query ve Zustand henüz kurulu değil** — RULES bunları şart koşsa da
  server-state/store katmanı ileride eklenecek. Şimdilik state feature hook'larında.
- Bulmaca üretimi ve `preparing` akışı **sahte/örnek veri** ile çalışıyor
  (`src/features/puzzle/sample.ts`); backend generator ve Edge Function'lar bağlanacak.
- Bazı Expo-template kalıntıları duruyor (`components/Themed.tsx`,
  `components/EditScreenInfo.tsx`, `constants/Colors.ts`, `app/modal.tsx`) — yeni
  kod `src/` altına yazılır; bunlar zamanla temizlenecek.
- Test altyapısı henüz yok (RULES %80 auth coverage şart koşuyor).
