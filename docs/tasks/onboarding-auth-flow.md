# Görev: Onboarding + Auth Ekranları

Tarih: 2026-07-09

## Amaç

CrossPuzzle uygulamasının ilk açılış akışı için 2 onboarding ekranı + 3 auth ekranı
(login → verify → profile-setup) mobile standartlarına (`docs/mobile-standards/`) uygun
şekilde uçtan uca kuruldu.

Baştaki `app/login.tsx` örnek amaçlıydı; token sistemi kurulmadığı, sayfada iş mantığı
tuttuğu ve tek dosyada topladığı için `RULES.md` ihlal ediyordu — refactor edilerek
kaldırıldı.

## Yapılan Değişikliklerin Özeti

| Katman | Dosya | Sorumluluk |
|---|---|---|
| Theme tokens | `src/theme/tokens/colors.ts` | Semantik renk paleti (light + dark) |
| Theme tokens | `src/theme/tokens/spacing.ts` | 0–10 arası spacing skalası |
| Theme tokens | `src/theme/tokens/radius.ts` | none/sm/md/lg/xl/full |
| Theme tokens | `src/theme/tokens/typography.ts` | h1/h2/h3/body/button/label/otpDigit... varyantları |
| Theme tokens | `src/theme/tokens/index.ts` | Token barrel |
| Theme | `src/theme/theme.ts` | `useTheme()` — sistem color scheme'e göre light/dark |
| Theme | `src/theme/index.ts` | Public theme barrel |
| Base UI | `src/components/ui/app-text.tsx` | `AppText` — varyant + color mapping |
| Base UI | `src/components/ui/app-button.tsx` | `AppButton` — primary/secondary/ghost + a11y |
| Base UI | `src/components/ui/app-input.tsx` | `AppInput` — label + error + placeholder |
| Base UI | `src/components/ui/card.tsx` | `Card` — surface container |
| Base UI | `src/components/ui/index.ts` | UI barrel |
| Onboarding | `src/features/onboarding/hooks/use-onboarding.ts` | `hasSeenOnboarding` AsyncStorage flag |
| Onboarding | `src/features/onboarding/components/page-indicator.tsx` | Dot indicator |
| Onboarding | `src/features/onboarding/components/onboarding-illustration.tsx` | Upload/Solve illüstrasyonları (View-tabanlı) |
| Onboarding | `src/features/onboarding/components/onboarding-page.tsx` | Ekran şablonu (skip, illustration, title, body, indicator, buttons) |
| Onboarding | `src/features/onboarding/index.ts` | Feature barrel |
| Auth | `src/features/auth/validation.ts` | E-posta / OTP / kullanıcı adı / display name / initials |
| Auth | `src/features/auth/hooks/use-email-login.ts` | E-posta validate + fake OTP gönder + `router.push('/(auth)/verify')` |
| Auth | `src/features/auth/hooks/use-otp-verify.ts` | 6 haneli kod state, 42s geri sayım, doğrulama + `router.replace('/(auth)/profile-setup')` |
| Auth | `src/features/auth/hooks/use-profile-setup.ts` | Username/display-name/dil, `router.replace('/(tabs)')` |
| Auth | `src/features/auth/components/brand-logo.tsx` | 64x64 mint çerçeveli logo |
| Auth | `src/features/auth/components/email-form.tsx` | Login form kartı |
| Auth | `src/features/auth/components/otp-input.tsx` | 6 hücreli otomatik focus'lu input |
| Auth | `src/features/auth/components/otp-form.tsx` | Verify form kartı + resend timer |
| Auth | `src/features/auth/components/avatar-circle.tsx` | Baş harfli 72x72 mint avatar |
| Auth | `src/features/auth/components/language-selector.tsx` | Türkçe / English chip |
| Auth | `src/features/auth/components/profile-form.tsx` | Profil form kartı |
| Auth | `src/features/auth/index.ts` | Feature barrel |
| Route | `app/(onboarding)/_layout.tsx` | Stack layout |
| Route | `app/(onboarding)/welcome.tsx` | 1. onboarding ekranı |
| Route | `app/(onboarding)/how-it-works.tsx` | 2. onboarding ekranı |
| Route | `app/(auth)/_layout.tsx` | Stack layout |
| Route | `app/(auth)/login.tsx` | Login sayfası (EmailForm çağırır) |
| Route | `app/(auth)/verify.tsx` | Verify sayfası (OtpForm çağırır) |
| Route | `app/(auth)/profile-setup.tsx` | Profil kurulum sayfası (ProfileForm çağırır) |
| Root | `app/_layout.tsx` | Onboarding durumuna göre initial route yönlendirir |
| Silindi | `app/login.tsx` | Örnek dosya, refactor edildi |
| Config | `app.json` | `experiments.typedRoutes` false (yeni rotalar için tip lag'i vardı) |
| Deps | `package.json` (mevcuttu) | `@react-native-async-storage/async-storage`, `expo-secure-store` `npm install` ile çözüldü |

## Ekran-Ekran Event Akışı

### 1. Boot → İlk yönlendirme

`app/_layout.tsx:44` `RootLayoutNav` mount olduğunda `useOnboarding()`'i çağırır.
`src/features/onboarding/hooks/use-onboarding.ts:19` `useEffect` ile
`AsyncStorage.getItem('@crosspuzzle/hasSeenOnboarding')`'ı okur.

- `status === 'unseen'` → `app/_layout.tsx:49` `router.replace('/(onboarding)/welcome')`
- `status === 'seen'` → `app/_layout.tsx:51` `router.replace('/(auth)/login')`
- `status === 'loading'` → yönlendirme atlanır, useEffect status güncellendiğinde tekrar tetiklenir

### 2. Onboarding 1 — Welcome (`app/(onboarding)/welcome.tsx`)

- Ekran `OnboardingPage` komponentini render eder (`illustration="upload"`, indicator ● ○).
- **İleri** butonu → `app/(onboarding)/welcome.tsx:20` `router.push('/(onboarding)/how-it-works')`
- **Atla** butonu (sağ üst) → `app/(onboarding)/welcome.tsx:11` `handleSkip()` →
  `useOnboarding().markSeen()` (`AsyncStorage.setItem('@crosspuzzle/hasSeenOnboarding', '1')`) →
  `router.replace('/(auth)/login')`

### 3. Onboarding 2 — How It Works (`app/(onboarding)/how-it-works.tsx`)

- `OnboardingPage` (`illustration="solve"`, indicator ○ ●).
- **Başla** ve **Atla** aynı davranır → `app/(onboarding)/how-it-works.tsx:11`
  `goToLogin()` → `markSeen()` → `router.replace('/(auth)/login')`

### 4. Login (`app/(auth)/login.tsx`)

- Sayfa `EmailForm` çağırır.
- `EmailForm` (`src/features/auth/components/email-form.tsx`) `useEmailLogin()` hook'undan
  state alır.
- Kullanıcı e-posta yazar → `setEmail` state günceller, mevcut hata varsa temizler.
- **Kod gönder** butonu → `EmailForm:38` `submit()` →
  `src/features/auth/hooks/use-email-login.ts:26`:
  1. `validateEmail(email)` → hata varsa `setError` çağırır ve durur
  2. `sendOtpRequest(email)` (şimdilik 600ms fake gecikme — TODO: Supabase
     `supabase.auth.signInWithOtp({ email })`)
  3. `router.push({ pathname: '/(auth)/verify', params: { email } })`

### 5. Verify (`app/(auth)/verify.tsx`)

- `useLocalSearchParams<{ email: string }>()` ile e-postayı alır ve `OtpForm`'a verir.
- `OtpForm` (`src/features/auth/components/otp-form.tsx`) `useOtpVerify(email)`'dan state alır.
- Mount'ta `use-otp-verify.ts:53` `startCountdown()` çalışır, 42 saniyeden geri sayar.
- Kullanıcı 6 hücreye rakam girer → `OtpInput` her kutu için `onChangeText` →
  `use-otp-verify.ts:66` `setDigit(index, value)` state'i günceller ve
  otomatik olarak sonraki kutuya focus geçer.
- **Doğrula** butonu → `use-otp-verify.ts:88` `submit()`:
  1. `validateOtp(digits)` → hata → `setError` ve durur
  2. `verifyOtpRequest(email, code)` (fake — TODO: `supabase.auth.verifyOtp(...)`)
  3. `router.replace('/(auth)/profile-setup')`
- **Tekrar gönder** butonu → sadece `secondsLeft === 0` iken aktif →
  `use-otp-verify.ts:102` `resend()` → digit'leri temizler + geri sayımı yeniden başlatır.

### 6. Profile Setup (`app/(auth)/profile-setup.tsx`)

- Sayfa `ProfileForm` çağırır.
- `ProfileForm` (`src/features/auth/components/profile-form.tsx`) `useProfileSetup()`'tan alır:
  - `displayName` değiştikçe `AvatarCircle` içine yansıyan initials `initialsFromName()` ile
    hesaplanır (memoized).
  - `LanguageSelector` `tr` / `en` chip'i.
- **Başla** butonu → `use-profile-setup.ts:57` `submit()`:
  1. `validateUsername` + `validateDisplayName` — hatalar state'e set edilir
  2. Hata yoksa `saveProfileRequest(...)` (fake — TODO: `profiles` tablosuna insert)
  3. `router.replace('/(tabs)')`

## Standartlarla Uyum

- **Token disiplini**: Tüm renk / spacing / radius / typography `useTheme()` veya
  `src/theme/tokens`'tan gelir. Hardcoded hex yok (RULES.md).
- **Sayfa satır limiti**: Tüm sayfalar 25 satırın altında; orkestrasyon dışı iş
  yapmıyorlar.
- **İş mantığı feature hook'ta**: Login / verify / profile setup mantığı ilgili
  `hooks/` altında; sayfalar bilmiyor.
- **Base component'ler**: `AppText`, `AppButton`, `AppInput`, `Card` tek noktadan geliyor.
- **A11y**: Tüm interaktif elemanlarda `accessibilityRole` / `accessibilityLabel` /
  `accessibilityState` / `accessibilityHint` set edildi. Page indicator `progressbar`
  role'üyle işaretli.
- **TypeScript strict**: `any`, `!`, `@ts-ignore`, `as` yok. `tsc --noEmit` temiz.

## Bilerek Atlanan / TODO

Bunlar RULES.md'de standart olsa da bu iş kapsamında çözülmedi; ayrı ticket:

- **TanStack Query**: Paket henüz eklenmedi. Auth hook'larındaki fake fetch'ler
  `use-*.ts` içinde `TODO` yorumla işaretli. Supabase entegrasyonu geldiğinde
  `useMutation` sarmalayıcısına geçilecek.
- **Zod + React Hook Form**: Paketler eklenmediği için `src/features/auth/validation.ts`
  içinde saf regex helper'lar kullanıldı. Paketler girdiğinde şemalar buradan üretilir.
- **expo-secure-store**: Onboarding flag'i token değil, PII değil — bilinçli olarak
  AsyncStorage kullanıldı. Auth token'ları Supabase entegrasyonunda `expo-secure-store`
  üzerinden yönetilecek (`STATE-API.md`).
- **`experiments.typedRoutes`**: Yeni rotalar için tip generation lag'i vardı, `false`
  çekildi. Expo dev server rotaları tekrar tararsa geri açılabilir; hedef ileride
  `true` bırakmak.
- **Marka renkleri**: `colors.ts` mevcut mockup paletiyle dolduruldu (`#2f9e78`,
  `#d7f0e6`, `#f5f5f5`). Marka kararı gelince yalnızca `colors.ts` güncellenecek,
  UI dokunulmayacak.

## Doğrulama

- `npx tsc --noEmit` → exit 0.
- Runtime akış (self-check): `expo start` sonrası ilk açılışta welcome ekranı,
  ileri → how-it-works, başla → login, e-posta + kod gönder → verify, kod +
  doğrula → profile-setup, başla → ana tabs.
