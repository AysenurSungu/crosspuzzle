// Görünen (display) harf yardımcıları — client'taki
// src/features/puzzle/letters.ts ile AYNI mantık.
//
// Neden önemli: client build-model.ts, kesişen hücrede iki kelimenin
// harfini BİREBİR eşit (===) kontrol ediyor. Türkçe'de İ ≠ I, Ö ≠ O, Ç, Ş, Ğ
// ayrı harfler. Bu yüzden grid yerleşimini ASCII normalize form (i/ı → I)
// üzerinden değil, GÖRÜNEN harf üzerinden yaparız. (ASCII normalize form
// yalnızca cevap kontrolünde kullanılır — bkz. normalize.ts, Faz 3.)

const TURKISH_LETTER_RE = /^[A-Za-zÇĞİıÖŞÜçğöşü]$/;

/** Ham kelimeyi tek biçimli görünen forma çevirir: trim + Türkçe BÜYÜK + NFC. */
export function toDisplayWord(raw: string): string {
  return raw.trim().toLocaleUpperCase("tr-TR").normalize("NFC");
}

/** Görünen formu tek tek harflere (code point) böler. */
export function displayLetters(raw: string): string[] {
  return Array.from(toDisplayWord(raw));
}

/** Izgaraya girebilecek bir harf mi? (rakam/boşluk/sembol değil) */
export function isLetter(char: string): boolean {
  return TURKISH_LETTER_RE.test(char);
}
