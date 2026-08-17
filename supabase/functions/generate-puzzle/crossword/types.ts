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
  /** Izgaraya giren biçim: BOŞLUKSUZ, harf harf. Çok kelimeli terimlerde de tek run. */
  answer: string;
  clue: string;
  /**
   * Çok kelimeli cevaplarda her kelimenin harf sayısı (ör. "VENA CAVA" → [4, 4]).
   * Tek kelimede [n]. Client ipucunda "(4, 4)" gösterir, çözümde boşluklu yazar.
   */
  enumeration?: number[];
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
