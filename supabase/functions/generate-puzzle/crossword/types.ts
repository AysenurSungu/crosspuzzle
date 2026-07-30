// Engine tipleri — client'taki src/features/puzzle/types.ts ile UYUMLU.
// Edge Function bu şekli döndürür; client onu build-model.ts ile render eder.

export type Direction = "across" | "down";

/** Claude'un ürettiği ham çift: tek kelime cevap + ipucu. */
export interface GeneratedWord {
  answer: string;
  clue: string;
}

/** Izgaraya yerleştirilmiş, numaralandırılmış kelime. */
export interface PlacedWord {
  number: number;
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface PuzzleLayout {
  note?: string;
  rows: number;
  cols: number;
  placed: PlacedWord[];
}

export interface BuildResult {
  layout: PuzzleLayout;
  /** Yeterli kesişim bulunamadığı için ızgaraya alınamayan kelimeler. */
  dropped: GeneratedWord[];
}
