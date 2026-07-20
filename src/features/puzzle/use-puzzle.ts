import { useCallback, useMemo, useState } from 'react';
import { buildPuzzleModel } from './build-model';
import { isLetter, trUpper } from './letters';
import {
  cellKey,
  type Direction,
  type GridCell,
  type PuzzleLayout,
  type PuzzleModel,
  type RenderClue,
} from './types';

export interface CellPosition {
  row: number;
  col: number;
}

export interface UsePuzzleResult {
  model: PuzzleModel;
  letters: Readonly<Record<string, string>>;
  selected: CellPosition | null;
  direction: Direction;
  wrongKeys: ReadonlySet<string>;
  activeClue: RenderClue | null;
  activeKeys: ReadonlySet<string>;
  isSolved: boolean;
  selectCell: (row: number, col: number) => void;
  inputLetter: (char: string) => void;
  backspace: () => void;
  revealLetter: () => void;
  revealWord: () => void;
  check: () => void;
}

function findClue(
  clues: readonly RenderClue[],
  row: number,
  col: number,
  direction: Direction,
): RenderClue | null {
  return (
    clues.find(
      (clue) =>
        clue.direction === direction &&
        clue.cells.some((cell) => cell.row === row && cell.col === col),
    ) ?? null
  );
}

function cellAt(model: PuzzleModel, row: number, col: number): GridCell | null {
  return model.grid[row]?.[col] ?? null;
}

export function usePuzzle(layout: PuzzleLayout): UsePuzzleResult {
  const model = useMemo(() => buildPuzzleModel(layout), [layout]);

  const [letters, setLetters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [direction, setDirection] = useState<Direction>('across');
  const [wrongKeys, setWrongKeys] = useState<ReadonlySet<string>>(new Set());

  const activeClue = useMemo(() => {
    if (selected === null) return null;
    return findClue(model.clues, selected.row, selected.col, direction);
  }, [model, selected, direction]);

  const activeKeys = useMemo(() => {
    const keys = new Set<string>();
    if (activeClue) {
      for (const cell of activeClue.cells) keys.add(cellKey(cell.row, cell.col));
    }
    return keys;
  }, [activeClue]);

  const isSolved = useMemo(() => {
    for (const row of model.grid) {
      for (const cell of row) {
        if (cell === null) continue;
        if (letters[cellKey(cell.row, cell.col)] !== cell.solution) return false;
      }
    }
    return true;
  }, [model, letters]);

  const selectCell = useCallback(
    (row: number, col: number) => {
      const cell = cellAt(model, row, col);
      if (cell === null) return;
      const hasAcross = cell.acrossNumber !== null;
      const hasDown = cell.downNumber !== null;
      if (!hasAcross && !hasDown) return;

      setWrongKeys(new Set());
      setDirection((current) => {
        const sameCell = selected !== null && selected.row === row && selected.col === col;
        if (sameCell) {
          if (hasAcross && hasDown) return current === 'across' ? 'down' : 'across';
          return hasAcross ? 'across' : 'down';
        }
        if (current === 'across' && hasAcross) return 'across';
        if (current === 'down' && hasDown) return 'down';
        return hasAcross ? 'across' : 'down';
      });
      setSelected({ row, col });
    },
    [model, selected],
  );

  const inputLetter = useCallback(
    (char: string) => {
      if (selected === null || !isLetter(char)) return;
      const clue = findClue(model.clues, selected.row, selected.col, direction);
      if (clue === null) return;

      const key = cellKey(selected.row, selected.col);
      setLetters((prev) => ({ ...prev, [key]: trUpper(char) }));
      setWrongKeys(new Set());

      const index = clue.cells.findIndex((c) => c.row === selected.row && c.col === selected.col);
      const next = clue.cells[index + 1];
      if (next) setSelected({ row: next.row, col: next.col });
    },
    [model, selected, direction],
  );

  const backspace = useCallback(() => {
    if (selected === null) return;
    const clue = findClue(model.clues, selected.row, selected.col, direction);
    if (clue === null) return;
    setWrongKeys(new Set());

    const key = cellKey(selected.row, selected.col);
    if (letters[key]) {
      setLetters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    const index = clue.cells.findIndex((c) => c.row === selected.row && c.col === selected.col);
    const prevCell = clue.cells[index - 1];
    if (prevCell) {
      const prevKey = cellKey(prevCell.row, prevCell.col);
      setLetters((prev) => {
        const next = { ...prev };
        delete next[prevKey];
        return next;
      });
      setSelected({ row: prevCell.row, col: prevCell.col });
    }
  }, [model, selected, direction, letters]);

  const revealLetter = useCallback(() => {
    if (selected === null) return;
    const cell = cellAt(model, selected.row, selected.col);
    if (cell === null) return;
    const clue = findClue(model.clues, selected.row, selected.col, direction);
    setWrongKeys(new Set());
    setLetters((prev) => ({ ...prev, [cellKey(cell.row, cell.col)]: cell.solution }));

    if (clue) {
      const index = clue.cells.findIndex((c) => c.row === selected.row && c.col === selected.col);
      const next = clue.cells[index + 1];
      if (next) setSelected({ row: next.row, col: next.col });
    }
  }, [model, selected, direction]);

  const revealWord = useCallback(() => {
    if (selected === null) return;
    const clue = findClue(model.clues, selected.row, selected.col, direction);
    if (clue === null) return;
    setWrongKeys(new Set());
    setLetters((prev) => {
      const next = { ...prev };
      for (const pos of clue.cells) {
        const cell = cellAt(model, pos.row, pos.col);
        if (cell) next[cellKey(pos.row, pos.col)] = cell.solution;
      }
      return next;
    });
  }, [model, selected, direction]);

  const check = useCallback(() => {
    const wrong = new Set<string>();
    for (const row of model.grid) {
      for (const cell of row) {
        if (cell === null) continue;
        const key = cellKey(cell.row, cell.col);
        const entered = letters[key];
        if (entered && entered !== cell.solution) wrong.add(key);
      }
    }
    setWrongKeys(wrong);
  }, [model, letters]);

  return {
    model,
    letters,
    selected,
    direction,
    wrongKeys,
    activeClue,
    activeKeys,
    isSolved,
    selectCell,
    inputLetter,
    backspace,
    revealLetter,
    revealWord,
    check,
  };
}
