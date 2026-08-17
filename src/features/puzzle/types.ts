// Types mirror the generator/backend contract (crosspuzzle_mock JSON).
// The client is a "dumb renderer": it draws whatever `sampleLayout`
// (later: the solved layout from the Spring Boot generator) describes.

export type Direction = 'across' | 'down';

export interface PuzzleWord {
  id: number;
  answer: string;
  length: number;
  clue: string;
  /** Multi-word answers: letters per word (e.g. "VENA CAVA" -> [4, 4]). */
  enumeration?: number[];
}

export interface PlacedWord {
  number: number;
  /** Grid form: no spaces, one contiguous run even for multi-word terms. */
  answer: string;
  clue: string;
  /** Multi-word answers: letters per word (e.g. "VENA CAVA" -> [4, 4]). */
  enumeration?: number[];
  row: number;
  col: number;
  direction: Direction;
}

export interface PuzzleIntersection {
  at: [number, number];
  letter: string;
  words: string[];
}

export interface PuzzleLayout {
  note?: string;
  rows: number;
  cols: number;
  placed: PlacedWord[];
  intersections?: PuzzleIntersection[];
}

export interface Puzzle {
  puzzleId: string;
  source: string;
  topic: string;
  language: string;
  difficulty: string;
  note?: string;
  words: PuzzleWord[];
  sampleLayout: PuzzleLayout;
}

// ---- Derived, render-ready model (built from a PuzzleLayout) ----

export interface GridCell {
  row: number;
  col: number;
  /** Correct letter, kept exactly as given (Turkish uppercase, no case folding). */
  solution: string;
  /** Visible label shown when a word starts here, else null. */
  number: number | null;
  /** Number of the across word covering this cell, else null. */
  acrossNumber: number | null;
  /** Number of the down word covering this cell, else null. */
  downNumber: number | null;
}

export interface RenderClue {
  number: number;
  direction: Direction;
  clue: string;
  length: number;
  /** Multi-word answers: letters per word (e.g. [4, 4] -> shown as "(4, 4)"). */
  enumeration?: number[];
  row: number;
  col: number;
  cells: ReadonlyArray<{ row: number; col: number }>;
}

export interface PuzzleModel {
  rows: number;
  cols: number;
  /** rows x cols; null marks a block (no cell). */
  grid: ReadonlyArray<ReadonlyArray<GridCell | null>>;
  clues: readonly RenderClue[];
}

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function clueKey(number: number, direction: Direction): string {
  return `${number}-${direction}`;
}
