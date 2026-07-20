// Turkish-aware letter helpers. Grid matching relies on letter equality,
// and in Turkish İ/I, Ö/O, Ü/U, Ç, Ş, Ğ are distinct letters. We never
// use locale-insensitive toUpperCase() (it would break İ↔I). Solutions are
// compared as-is; user keystrokes are folded with the tr-TR locale so a
// typed "i" becomes "İ" and "ı" becomes "I".

const TURKISH_LETTER_RE = /^[A-Za-zÇĞİıÖŞÜçğöşü]$/;

/** Split a word into its individual letters (code points). */
export function toLetters(word: string): string[] {
  return Array.from(word.normalize('NFC'));
}

/** Uppercase a single character using Turkish rules. */
export function trUpper(char: string): string {
  return char.toLocaleUpperCase('tr-TR');
}

/** True when the character is a letter we accept as grid input. */
export function isLetter(char: string): boolean {
  return TURKISH_LETTER_RE.test(char);
}
