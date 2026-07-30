// Türkçe ASCII normalizasyon — TEK KAYNAK (docs/mobile-standards/CROSSWORD-ENGINE.md).
//
// ⚠️ Bu modül grid YERLEŞİMİNDE kullanılmaz (yerleşim görünen harfle çalışır,
// bkz. letters.ts). Burada Faz 3 için hazır: CEVAP KONTROLÜ Edge Function'da
// yapılınca, kullanıcının yazdığı harf normalize edilerek saklı cevapla
// kıyaslanacak. i ve ı → ikisi de I (kesişimlerin/çözümün tutması için).
//
// DB'ye puzzle_words.answer_normalized eklendiğinde (Faz 3) o kolonun mantığı
// bu fonksiyonla BİREBİR aynı olmalı; aksi halde cevap kontrolü sessizce kayar.

const TR_MAP: Record<string, string> = {
  Ç: "C", ç: "C",
  Ğ: "G", ğ: "G",
  I: "I", ı: "I", İ: "I", i: "I",
  Ö: "O", ö: "O",
  Ş: "S", ş: "S",
  Ü: "U", ü: "U",
};

export function normalizeChar(ch: string): string {
  return TR_MAP[ch] ?? ch.toUpperCase();
}

export function normalizeWord(word: string): string {
  return Array.from(word)
    .map(normalizeChar)
    .join("")
    .replace(/[^A-Z]/g, "");
}
