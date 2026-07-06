# Mobile Standartları — Crossword Engine

> Grid üretimi, normalizasyon veya çözme mantığına dokunurken okunur.

---

## İlke

Engine, UI'dan **tamamen bağımsız saf modül**dür (`lib/crossword/`). React import etmez, side-effect içermez, deterministiktir. Test edilebilir ve ileride Edge Function'da (Deno) yeniden kullanılabilir olmalı.

---

## ⚠️ Normalizasyon — Tek Kaynak Kuralı

Türkçe karakter normalizasyonu **tek bir yerde** tanımlanır ve DB'deki `puzzle_words.answer_normalized` mantığıyla **birebir aynı** olmalıdır. İki taraf ayrışırsa cevap kontrolü sessizce kayar.

```typescript
// lib/crossword/normalize.ts
const TR_MAP: Record<string, string> = {
  ç: "C", ğ: "G", ı: "I", i: "I", ö: "O", ş: "S", ü: "U",
};

export function normalizeChar(ch: string): string {
  const lo = ch.toLowerCase();
  return TR_MAP[lo] ?? ch.toUpperCase();
}

export function normalizeWord(w: string): string {
  return w
    .split("")
    .map(normalizeChar)
    .join("")
    .replace(/[^A-Z]/g, "");
}
```

Kurallar:
- `i` ve `ı` → ikisi de `I` (kesişimlerin çalışması için şart).
- Bu fonksiyonun Deno karşılığı Edge Function'da **aynı** map ile durur; değişiklik iki tarafta senkron yapılır.
- Cevap karşılaştırması **her zaman** normalize form üzerinden: `normalizeWord(guess) === word.answer_normalized`.

---

## Engine Sorumlulukları

| Modül | Sorumluluk |
|---|---|
| `normalize.ts` | Karakter/kelime normalizasyonu (tek kaynak) |
| `grid-builder.ts` | Kelime yerleşimi, kesişim bulma, grid matrisi |
| `numbering.ts` | Hücre numaralandırma (across/down soru no) |
| `layout.ts` | `grid_layout` jsonb üretimi (render için) |
| `validate.ts` | Yeterli kesişim var mı, izole kelime kontrolü |

Engine çıktısı DB şemasıyla uyumlu: `rows`, `cols`, `grid_layout`, ve her kelime için `row/col/direction/number/answer/answer_normalized`.

---

## Render Kuralları

- Grid ve hücre etkileşimleri **60 FPS** olmalı (RULES.md performans).
- Ağır animasyon (hücre highlight, doğru/yanlış feedback) **Reanimated** ile UI thread'de.
- Hücre listesi dinamik key: `key={`${r}-${c}`}`, asla `key={index}`.
- Grid state feature hook'ta (`features/solve/hooks/use-grid.ts`), component sadece render.

---

## Kurallar

| Kural | Açıklama |
|---|---|
| Engine saf modül | React/side-effect yok, deterministik |
| Normalizasyon tek kaynak | `lib/crossword/normalize.ts` = DB `answer_normalized` |
| `i`/`ı` → `I` | Kesişim tutarlılığı |
| Cevap kıyası normalize üzerinden | Ham string kıyası yasak |
| Engine testi zorunlu | Yerleşim + normalizasyon unit test |
| Grid render 60 FPS | Reanimated, memo, stable key |
