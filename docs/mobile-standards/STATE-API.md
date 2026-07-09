# Mobile Standartları — State, API ve Form

> State veya API işi yaparken, auth akışı veya form yazarken okunur.

---

## State Karar Checklist

```
State backend'den mi geliyor?
└─► EVET → TanStack Query
└─► HAYIR ↓

Birden fazla ilgisiz ekran kullanıyor mu?
└─► EVET → Zustand (minimal)
└─► HAYIR ↓

Sadece tek ekran/modal içinde mi?
└─► EVET → useState / useReducer
```

---

## TanStack Query

### Query Keys

```typescript
// lib/api/query-keys.ts
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  puzzles: {
    all: ["puzzles"] as const,
    feed: ["puzzles", "feed"] as const,       // public keşif
    mine: ["puzzles", "mine"] as const,
    detail: (id: string) => ["puzzles", "detail", id] as const,
  },
  sources: {
    list: ["sources"] as const,
    detail: (id: string) => ["sources", id] as const,
  },
  attempts: {
    history: ["attempts", "history"] as const,
    leaderboard: (puzzleId: string) => ["attempts", "leaderboard", puzzleId] as const,
  },
  room: {
    detail: (code: string) => ["room", code] as const,
  },
};
```

### Kullanım

```typescript
// features/puzzle/hooks/use-puzzles.ts
export function usePuzzleFeed(): UseQueryResult<Puzzle[]> {
  return useQuery({
    queryKey: queryKeys.puzzles.feed,
    queryFn: puzzleApi.feed,
  });
}

export function useCreatePuzzle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: puzzleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.puzzles.mine });
    },
  });
}
```

### QueryClient Config

```typescript
// app/_layout.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 dakika
      gcTime: 1000 * 60 * 30,    // 30 dakika
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});
```

---

## Zustand

Sadece auth/session ve theme için kullanılır. Async logic store'a gömülmez.

```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## API Layer

### Supabase Client

```typescript
// lib/api/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";   // ← process.env.X! değil, validated env

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);
```

### Axios Client (Edge Functions için)

```typescript
// lib/api/client.ts
import axios from "axios";
import { env } from "@/lib/env";
import { supabase } from "./supabase";

export const apiClient = axios.create({
  baseURL: `${env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

> Cevap kontrolü, skor yazımı, bulmaca üretimi bu axios client üzerinden
> Edge Function'a gider. Doğrudan `supabase.from(...)` ile skor/cevap yazma
> YASAK (bkz. SUPABASE-RLS.md).

---

## Authentication Stratejisi

```
Platform: Supabase Auth
Yöntem:   E-posta + OTP (passwordless)
Storage:  expo-secure-store (token, refresh token)
```

### Token Akışı

```
1. KAYIT / GİRİŞ
   supabase.auth.signInWithOtp({ email })
   supabase.auth.verifyOtp({ email, token, type: 'email' })
   ← Supabase session (access_token + refresh_token)

2. API İSTEĞİ
   Header: Authorization: Bearer {access_token}

3. TOKEN REFRESH
   Supabase client otomatik yönetir
   401 gelirse → supabase.auth.refreshSession()

4. LOGOUT
   supabase.auth.signOut()
   SecureStore temizle
```

### Token Service

```typescript
// lib/auth/token-service.ts
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEYS } from "./constants";

export const tokenService = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
  },
  async setTokens(access: string, refresh: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, access);
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, refresh);
  },
  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
  },
};
```

---

## HTTP Error Handling

| Status | Durum | Mobil Davranış |
|---|---|---|
| 400 | Validation Error | Form alanlarına hata mesajı |
| 401 | Unauthorized | Token refresh, başarısızsa login |
| 403 | Forbidden | Alert: "Yetkiniz yok" |
| 404 | Not Found | Boş state göster |
| 409 | Conflict | Alert: iş kuralı mesajı |
| 429 | Rate Limited | Toast + backoff |
| 500 | Server Error | Toast + retry seçeneği |

```typescript
// lib/api/error-handler.ts
import { AxiosError } from "axios";
import { Alert } from "react-native";

export function handleApiError(error: AxiosError): void {
  const status = error.response?.status;

  switch (status) {
    case 403:
      Alert.alert("Yetkisiz İşlem", "Bu işlem için yetkiniz yok.");
      break;
    case 429:
      Alert.alert("Çok Fazla İstek", "Biraz sonra tekrar deneyin.");
      break;
    case 500:
    case 503:
      Alert.alert("Sunucu Hatası", "Lütfen daha sonra tekrar deneyin.");
      break;
    default:
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu.");
  }
}
```

---

## Form Handling

Her form için React Hook Form + Zod zorunludur.

```typescript
// features/puzzle/schemas/puzzle.schemas.ts
import { z } from "zod";

export const createPuzzleSchema = z.object({
  title: z.string().min(1, "Başlık boş olamaz").max(80),
  topic: z.string().max(60).optional(),
  rows: z.number().int().min(3).max(30),
  cols: z.number().int().min(3).max(30),
});

export type CreatePuzzleForm = z.infer<typeof createPuzzleSchema>;
```

```typescript
// features/puzzle/hooks/use-create-puzzle-form.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPuzzleSchema, CreatePuzzleForm } from "../schemas/puzzle.schemas";

export function useCreatePuzzleForm() {
  const { control, handleSubmit, formState: { errors }, reset } =
    useForm<CreatePuzzleForm>({
      resolver: zodResolver(createPuzzleSchema),
      defaultValues: { title: "", rows: 10, cols: 10 },
    });

  return { control, errors, handleSubmit, reset };
}
```

### Kurallar

- Her form için Zod schema zorunlu
- RHF + Zod resolver standart
- Backend validation hataları forma map edilir
- Form mantığı hook'ta, component sadece UI
- Zod schema, DB kısıtlarıyla hizalı (rows/cols 3-30, title uzunluğu vb.)
