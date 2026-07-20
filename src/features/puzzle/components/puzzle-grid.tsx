import { type JSX } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '@/src/components/ui';
import { useTheme } from '@/src/theme';
import { cellKey, type GridCell, type PuzzleModel } from '../types';

export interface PuzzleGridProps {
  model: PuzzleModel;
  letters: Readonly<Record<string, string>>;
  selected: { row: number; col: number } | null;
  activeKeys: ReadonlySet<string>;
  wrongKeys: ReadonlySet<string>;
  cellSize: number;
  gap: number;
  onCellPress: (row: number, col: number) => void;
}

interface CellProps {
  cell: GridCell;
  size: number;
  letter: string | undefined;
  isSelected: boolean;
  isActive: boolean;
  isWrong: boolean;
  onPress: () => void;
}

function PuzzleCell({
  cell,
  size,
  letter,
  isSelected,
  isActive,
  isWrong,
  onPress,
}: CellProps): JSX.Element {
  const { colors, radius } = useTheme();

  const backgroundColor = isSelected || isActive ? colors.cellActive : colors.cellEmpty;
  const borderColor = isSelected ? colors.primary : colors.border;
  const letterColor = isWrong ? colors.cellWrong : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Satır ${cell.row + 1}, sütun ${cell.col + 1}`}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: radius.sm,
        borderWidth: isSelected ? 2 : 1,
        borderColor,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {cell.number !== null ? (
        <AppText
          style={{ position: 'absolute', top: 2, left: 3, fontSize: 9, lineHeight: 11 }}
          color="muted"
        >
          {cell.number}
        </AppText>
      ) : null}
      <AppText variant="cellLetter" style={{ color: letterColor }}>
        {letter ?? ''}
      </AppText>
    </Pressable>
  );
}

export function PuzzleGrid({
  model,
  letters,
  selected,
  activeKeys,
  wrongKeys,
  cellSize,
  gap,
  onCellPress,
}: PuzzleGridProps): JSX.Element {
  return (
    <View style={{ gap, alignSelf: 'center' }}>
      {model.grid.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', gap }}>
          {row.map((cell, colIndex) => {
            if (cell === null) {
              return <View key={colIndex} style={{ width: cellSize, height: cellSize }} />;
            }
            const key = cellKey(cell.row, cell.col);
            return (
              <PuzzleCell
                key={colIndex}
                cell={cell}
                size={cellSize}
                letter={letters[key]}
                isSelected={selected?.row === cell.row && selected?.col === cell.col}
                isActive={activeKeys.has(key)}
                isWrong={wrongKeys.has(key)}
                onPress={() => onCellPress(cell.row, cell.col)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
