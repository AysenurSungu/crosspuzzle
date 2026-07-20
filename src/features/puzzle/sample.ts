import rawSample from './data/sample-kardiyoloji.json';
import type { Puzzle } from './types';

// The JSON is the frozen backend contract; we assert it to the Puzzle type
// once, here, so the rest of the feature stays fully typed.
export const samplePuzzle: Puzzle = rawSample as Puzzle;
