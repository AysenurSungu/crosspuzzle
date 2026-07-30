// Hücre numaralandırma — standart çapraz bulmaca kuralı.
//
// Bir kelimenin BAŞLADIĞI hücreye numara verilir. Numaralar okuma sırasına göre
// atanır: üstten alta, soldan sağa. Aynı hücrede başlayan bir "across" ve bir
// "down" kelime AYNI numarayı paylaşır (bu yüzden numara benzersiz bir kimlik
// değildir; kimlik için ayrı bir id kullanılır).

import type { Direction, PlacedWord } from "./types.ts";

interface Unnumbered {
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
}

export function assignNumbers(words: Unnumbered[]): PlacedWord[] {
  // Benzersiz başlangıç hücreleri.
  const startKeys = new Set<string>();
  for (const w of words) startKeys.add(`${w.row},${w.col}`);

  const starts = Array.from(startKeys).map((key) => {
    const comma = key.indexOf(",");
    return { key, row: Number(key.slice(0, comma)), col: Number(key.slice(comma + 1)) };
  });

  // Okuma sırası: satır, sonra sütun.
  starts.sort((a, b) => a.row - b.row || a.col - b.col);

  const numberByKey = new Map<string, number>();
  starts.forEach((s, i) => numberByKey.set(s.key, i + 1));

  return words.map((w) => {
    const number = numberByKey.get(`${w.row},${w.col}`);
    if (number === undefined) {
      throw new Error(`Numaralandırma hatası: (${w.row},${w.col}) için numara yok.`);
    }
    return {
      number,
      answer: w.answer,
      clue: w.clue,
      row: w.row,
      col: w.col,
      direction: w.direction,
    };
  });
}
