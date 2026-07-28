import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';

import { env } from '@/src/lib/env';
import { secureStoreAdapter } from '@/src/lib/auth/secure-store-adapter';

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: secureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      // React Native'de URL tabanlı session yok; magic-link/deep-link parse'ı kapalı.
      detectSessionInUrl: false,
    },
  },
);

// Uygulama ön plandayken token'ı otomatik yenile, arka plana geçince durdur.
// (supabase-js React Native kurulum önerisi.)
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    void supabase.auth.startAutoRefresh();
  } else {
    void supabase.auth.stopAutoRefresh();
  }
});
