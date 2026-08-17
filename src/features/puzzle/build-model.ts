import { toLetters } from './letters';
import type { GridCell, PuzzleLayout, PuzzleModel, RenderClue } from './types';

/**
 * Turn a solved layout (hand-made sample now, generator output later) into a
 * render-ready model: a rows×cols grid of cells (null = block) plus the list
 * of clues with their ordered cell paths.
 */
export function buildPuzzleModel(layout: PuzzleLayout): PuzzleModel {
  const { rows, cols, placed } = layout;

  const grid: (GridCell | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );
  const clues: RenderClue[] = [];

  for (const word of placed) {
    const letters = toLetters(word.answer);
    const path: Array<{ row: number; col: number }> = [];

    letters.forEach((letter, index) => {
      const row = word.direction === 'down' ? word.row + index : word.row;
      const col = word.direction === 'across' ? word.col + index : word.col;

      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        throw new Error(
          `Word "${word.answer}" (#${word.number}) runs outside the ${rows}x${cols} grid at (${row}, ${col}).`,
        );
      }

      let cell = grid[row]?.[col] ?? null;
      if (cell === null) {
        cell = {
          row,
          col,
          solution: letter,
          number: null,
          acrossNumber: null,
          downNumber: null,
        };
        grid[row]![col] = cell;
      } else if (cell.solution !== letter) {
        throw new Error(
          `Intersection mismatch at (${row}, ${col}): "${cell.solution}" vs "${letter}" from "${word.answer}".`,
        );
      }

      if (word.direction === 'across') cell.acrossNumber = word.number;
      else cell.downNumber = word.number;
      if (index === 0 && cell.number === null) cell.number = word.number;

      path.push({ row, col });
    });

    clues.push({
      number: word.number,
      direction: word.direction,
      clue: word.clue,
      length: letters.length,
      enumeration: word.enumeration,
      row: word.row,
      col: word.col,
      cells: path,
    });
  }

  return { rows, cols, grid, clues };
}
