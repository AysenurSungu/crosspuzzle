# Mobile Standartları — Testing

> Test yazarken okunur.

---

## Test Beklentileri

| Senaryo | Gereksinim |
|---|---|
| Yeni feature | En az 1 happy path testi |
| Bug fix | Regression test zorunlu |
| Custom hook | Unit test zorunlu |
| Auth akışı | %80 coverage zorunlu |
| Crossword engine (normalize + yerleşim) | %80 coverage zorunlu |
| Cevap kontrolü akışı | Integration test zorunlu |

---

## Test Araçları

| Araç | Kullanım |
|---|---|
| Jest (jest-expo preset) | Unit ve component testleri |
| @testing-library/react-native | Component render ve etkileşim |
| Maestro (opsiyonel) | E2E — kritik akışlar |

---

## Test Yapısı

Test dosyaları test ettikleri dosyanın yanına konur:

```
features/solve/components/
├── grid-cell.tsx
└── grid-cell.test.tsx

lib/crossword/
├── normalize.ts
└── normalize.test.ts
```

### Engine Testi (Kritik)

```typescript
// lib/crossword/normalize.test.ts
import { normalizeWord } from "./normalize";

describe("normalizeWord", () => {
  it("Türkçe karakterleri normalize eder", () => {
    expect(normalizeWord("çiğköfte")).toBe("CIGKOFTE");
  });

  it("i ve ı ikisini de I yapar (kesişim tutarlılığı)", () => {
    expect(normalizeWord("ışık")).toBe("ISIK");
    expect(normalizeWord("ilik")).toBe("ILIK");
  });

  it("alfanümerik olmayanı atar", () => {
    expect(normalizeWord("a-b c!")).toBe("ABC");
  });
});
```

> ⚠️ Bu test DB `answer_normalized` mantığıyla senkron kalmalı. Map değişirse
> hem engine hem Edge Function hem bu test birlikte güncellenir.

### Component Testi

```typescript
// features/solve/components/grid-cell.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import { GridCell } from "./grid-cell";

describe("GridCell", () => {
  it("girilen harfi gösterir", () => {
    render(<GridCell value="A" row={0} col={0} onPress={jest.fn()} />);
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("onPress koordinatla çağrılır", () => {
    const onPress = jest.fn();
    render(<GridCell value="" row={2} col={3} onPress={onPress} />);
    fireEvent.press(screen.getByTestId("cell-2-3"));
    expect(onPress).toHaveBeenCalledWith(2, 3);
  });
});
```

---

## Mock Stratejisi

```typescript
// Supabase mock
jest.mock("@/lib/api/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

// expo-secure-store mock
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
```

---

## Kritik Test Edilmesi Gereken Akışlar

CrossPuzzle'a özel — bu akışlar %80 coverage altına düşemez:

1. **Auth akışı** — OTP gönderme, doğrulama, token saklama, logout
2. **Crossword engine** — normalizasyon, kelime yerleşimi, kesişim, numaralandırma
3. **Cevap kontrolü** — normalize kıyası, doğru/yanlış, Edge Function entegrasyonu (mock)
4. **Deneme akışı** — attempt başlatma (in_progress), devam etme (progress restore), tamamlama
5. **Bulmaca oluşturma** — kaynak → üretim isteği, hata/yetersiz kelime durumu
