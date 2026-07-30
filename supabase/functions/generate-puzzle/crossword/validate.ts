// Layout doğrulaması — client build-model.ts'in yaptığı kontrolleri sunucuda
// önceden yapar. Böylece hatalı bir layout client'a hiç ulaşmaz (build-model
// kesişim çakışmasında / grid taşmasında exception fırlatıyor).

import { displayLetters } from "./letters.ts";
import type { PuzzleLayout } from "./types.ts";

/** Sorun listesini döndürür; boşsa layout render edilebilir. */
export function validateLayout(layout: PuzzleLayout): string[] {
  const errors: string[] = [];
  const { rows, cols, placed } = layout;
  const grid = new Map<string, string>();

  for (const word of placed) {
    const letters = displayLetters(word.answer);
    letters.forEach((letter, i) => {
      const row = word.direction === "down" ? word.row + i : word.row;
      const col = word.direction === "across" ? word.col + i : word.col;

      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        errors.push(`"${word.answer}" (#${word.number}) ${rows}x${cols} dışına taşıyor (${row},${col}).`);
        return;
      }

      const key = `${row},${col}`;
      const existing = grid.get(key);
      if (existing === undefined) grid.set(key, letter);
      else if (existing !== letter) {
        errors.push(`Kesişim çakışması (${row},${col}): "${existing}" ≠ "${letter}" ("${word.answer}").`);
      }
    });
  }

  return errors;
}
