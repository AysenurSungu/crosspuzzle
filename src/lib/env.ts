import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',
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
