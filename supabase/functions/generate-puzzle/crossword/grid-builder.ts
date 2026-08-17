// Grid kurucu — kelime listesinden kesişimli bir çapraz bulmaca ızgarası üretir.
//
// Yaklaşım (MVP): açgözlü (greedy) yerleştirme.
//   1. Uzun kelimeler önce (daha çok kesişim yüzeyi).
//   2. İlk kelime yatay yerleştirilir.
//   3. Her yeni kelime, mevcut bir harfle kesişecek geçerli bir konuma oturtulur;
//      en çok kesişim yapan konum seçilir. Oturamayan kelime elenir (dropped).
// Kesişim eşleşmesi GÖRÜNEN harf üzerinden yapılır (bkz. letters.ts) — client
// build-model.ts birebir harf eşitliği aradığı için şart.

import { isLetter, toDisplayWord } from "./letters.ts";
import { assignNumbers } from "./numbering.ts";
import { validateLayout } from "./validate.ts";
import type { BuildResult, Direction, GeneratedWord } from "./types.ts";

/** Grid kurulamayınca fırlatılır; index.ts bunu 422 olarak döndürür. */
export class LayoutError extends Error {}

const STEP: Record<Direction, { dr: number; dc: number }> = {
  across: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
};

const MIN_PLACED = 3;
const MAX_WORDS = 3; // Çok kelimeli terimlerde üst sınır (Latince/tıp: en çok 3 sözcük).
const MAX_LETTERS = 16; // Toplam harf üst sınırı — çok uzun cevap ızgarayı zorlar.

interface Candidate {
  /** Izgara biçimi: BOŞLUKSUZ birleşik harfler. */
  answer: string;
  clue: string;
  letters: string[];
  /** Her sözcüğün harf sayısı (ör. "VENA CAVA" → [4, 4]). */
  enumeration: number[];
}

/**
 * Ham cevabı ızgara biçimine ayrıştırır: boşluk/tire ile böl, her parçayı görünen
 * BÜYÜK harfe çevir, harf-dışı içeren parçaları ele. Döner: birleşik `answer`,
 * harf dizisi ve sözcük uzunlukları (`enumeration`). Uygun değilse null.
 */
function parseAnswer(raw: string): { answer: string; letters: string[]; enumeration: number[] } | null {
  const parts = raw
    .split(/[\s\-–—]+/)
    .map((p) => toDisplayWord(p))
    .filter((p) => p.length > 0);
  if (parts.length === 0 || parts.length > MAX_WORDS) return null;

  const enumeration: number[] = [];
  const letters: string[] = [];
  for (const part of parts) {
    const ls = Array.from(part);
    if (!ls.every(isLetter)) return null; // rakam/sembol içeren parça → at
    enumeration.push(ls.length);
    letters.push(...ls);
  }
  if (letters.length < 2 || letters.length > MAX_LETTERS) return null;
  return { answer: letters.join(""), letters, enumeration };
}

interface RawPlacement extends Candidate {
  row: number;
  col: number;
  direction: Direction;
}

function keyOf(row: number, col: number): string {
  return `${row},${col}`;
}

function prepareCandidates(words: GeneratedWord[]): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const w of words) {
    if (!w || typeof w.answer !== "string" || typeof w.clue !== "string") continue;
    const parsed = parseAnswer(w.answer);
    if (parsed === null) continue; // ızgaraya uygun değil (boş/çok uzun/harf-dışı)
    if (seen.has(parsed.answer)) continue; // aynı cevabı iki kez alma
    seen.add(parsed.answer);
    out.push({
      answer: parsed.answer,
      clue: w.clue.trim(),
      letters: parsed.letters,
      enumeration: parsed.enumeration,
    });
  }
  out.sort((a, b) => b.letters.length - a.letters.length);
  return out;
}

/** Yerleşim geçerli mi + kaç kesişim yapıyor? Geçersizse -1. */
function scorePlacement(
  grid: Map<string, string>,
  letters: string[],
  row: number,
  col: number,
  dir: Direction,
): number {
  const { dr, dc } = STEP[dir];

  // Kelimenin hemen öncesi ve sonrası boş olmalı (başka kelimeye yapışıp
  // tek kelimeymiş gibi okunmasın).
  if (grid.has(keyOf(row - dr, col - dc))) return -1;
  const endR = row + dr * (letters.length - 1);
  const endC = col + dc * (letters.length - 1);
  if (grid.has(keyOf(endR + dr, endC + dc))) return -1;

  let crossings = 0;
  for (let i = 0; i < letters.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid.get(keyOf(r, c));
    if (existing !== undefined) {
      if (existing !== letters[i]) return -1; // harf çakışması
      crossings++; // geçerli kesişim
    } else {
      // Boş hücre: dik komşuları da boş olmalı; değilse paralel bir kelimeye
      // yapışıyor demektir (izinsiz bitişiklik).
      if (dir === "across") {
        if (grid.has(keyOf(r - 1, c)) || grid.has(keyOf(r + 1, c))) return -1;
      } else {
        if (grid.has(keyOf(r, c - 1)) || grid.has(keyOf(r, c + 1))) return -1;
      }
    }
  }
  return crossings;
}

function findBestPlacement(
  grid: Map<string, string>,
  cand: Candidate,
): { row: number; col: number; direction: Direction; crossings: number } | null {
  let best: { row: number; col: number; direction: Direction; crossings: number } | null = null;

  // Mevcut her dolu hücreyi, adayın aynı harfiyle hizalayıp dene.
  for (const [cellKey, letter] of grid) {
    const comma = cellKey.indexOf(",");
    const cr = Number(cellKey.slice(0, comma));
    const cc = Number(cellKey.slice(comma + 1));

    for (let i = 0; i < cand.letters.length; i++) {
      if (cand.letters[i] !== letter) continue;
      for (const direction of ["across", "down"] as Direction[]) {
        const { dr, dc } = STEP[direction];
        const row = cr - dr * i;
        const col = cc - dc * i;
        const crossings = scorePlacement(grid, cand.letters, row, col, direction);
        if (crossings >= 1 && (best === null || crossings > best.crossings)) {
          best = { row, col, direction, crossings };
        }
      }
    }
  }
  return best;
}

export function buildLayout(words: GeneratedWord[], targetCount: number): BuildResult {
  const candidates = prepareCandidates(words);
  const first = candidates[0];
  if (first === undefined) {
    throw new LayoutError("Kaynaktan uygun kelime çıkarılamadı.");
  }

  const grid = new Map<string, string>();
  const placements: RawPlacement[] = [];
  const dropped: GeneratedWord[] = [];

  const place = (cand: Candidate, row: number, col: number, direction: Direction): void => {
    const { dr, dc } = STEP[direction];
    cand.letters.forEach((letter, i) => grid.set(keyOf(row + dr * i, col + dc * i), letter));
    placements.push({ ...cand, row, col, direction });
  };

  // İlk kelime yatay; gerisi kesişerek eklenir.
  place(first, 0, 0, "across");

  for (let idx = 1; idx < candidates.length && placements.length < targetCount; idx++) {
    const cand = candidates[idx];
    if (cand === undefined) continue;
    const best = findBestPlacement(grid, cand);
    if (best) place(cand, best.row, best.col, best.direction);
    else dropped.push({ answer: cand.answer, clue: cand.clue });
  }

  if (placements.length < MIN_PLACED) {
    throw new LayoutError("Yeterli kesişen kelime üretilemedi. Farklı bir kaynak veya konu dene.");
  }

  // Negatif olabilecek koordinatları 0-indeksli ızgaraya kaydır.
  let minR = Infinity;
  let minC = Infinity;
  let maxR = -Infinity;
  let maxC = -Infinity;
  for (const p of placements) {
    const { dr, dc } = STEP[p.direction];
    for (let i = 0; i < p.letters.length; i++) {
      const r = p.row + dr * i;
      const c = p.col + dc * i;
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }
  }

  const numbered = assignNumbers(
    placements.map((p) => ({
      answer: p.answer,
      clue: p.clue,
      enumeration: p.enumeration,
      row: p.row - minR,
      col: p.col - minC,
      direction: p.direction,
    })),
  );

  const layout = { rows: maxR - minR + 1, cols: maxC - minC + 1, placed: numbered };

  const errors = validateLayout(layout);
  if (errors.length > 0) {
    throw new LayoutError(`Grid doğrulaması başarısız: ${errors[0]}`);
  }

  return { layout, dropped };
}
