# Mobile Standartları — Environment

> Env değişkeni ekler/okurken okunur. `process.env` doğrudan erişimi YASAK.

---

## İlke

Tüm env erişimi tek kaynaktan (`lib/env`) ve **validated** geçer. `@t3-oss/env-core` + Zod kullanılır. Bu:

- `!` non-null assertion ihtiyacını ortadan kaldırır (RULES.md'ye uyar).
- Eksik/hatalı env'de uygulama açılışında **fail-fast** patlar.
- Client/server ayrımını dayatır — `EXPO_PUBLIC_` prefix'i olmayan değer client'ta okunamaz.

---

## Kurulum

```bash
npx expo install @t3-oss/env-core zod
```

---

## lib/env.ts

```typescript
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    EXPO_PUBLIC_EAS_PROJECT_ID: z.string().min(1).optional(),
  },
  /**
   * ⚠️ EXPO KRİTİK: EXPO_PUBLIC_* değişkenleri Babel tarafından build-time'da
   * statik inline edilir. Dinamik erişim (process.env[key]) ÇALIŞMAZ.
   * Her değişken burada AÇIKÇA yazılmalı.
   */
  runtimeEnv: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_EAS_PROJECT_ID: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
  },
  emptyStringAsUndefined: true,
});
```

---

## Kullanım

```typescript
// ✅ Doğru
import { env } from "@/lib/env";
const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);

// ❌ Yasak — doğrudan erişim + non-null assertion
const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
```

---

## Server Secret'lar (Edge Function)

Service role key, Claude API key gibi secret'lar **client bundle'ına asla girmez**. Bunlar Supabase Edge Function ortamında tutulur ve orada ayrıca doğrulanır (Deno):

```typescript
// supabase/functions/_shared/env.ts
function required(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Eksik env: ${name}`);
  return v;
}

export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
  ANTHROPIC_API_KEY: required("ANTHROPIC_API_KEY"),
};
```

---

## Kurallar

| Kural | Açıklama |
|---|---|
| Env erişimi sadece `lib/env` | Component/hook doğrudan `process.env` okumaz |
| `EXPO_PUBLIC_` = client'ta görünür | Secret bu prefix'i ASLA almaz |
| Service/AI key'leri | Sadece Edge Function ortamı — client'a girmez |
| `.env` commit edilmez | `.gitignore`'da; prod değerler EAS/CI'dan |
| Yeni env eklerken | Hem `client` şeması hem `runtimeEnv`'e ekle (ikisi de zorunlu) |
