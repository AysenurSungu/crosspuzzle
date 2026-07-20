import { useEffect, useRef, useState, type JSX } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ClueBar,
  PuzzleActions,
  PuzzleGrid,
  PuzzleTopbar,
  samplePuzzle,
  usePuzzle,
} from '@/src/features/puzzle';
import { useTheme } from '@/src/theme';

const MAX_CELL = 44;

export default function PuzzleScreen(): JSX.Element {
  const { colors, spacing, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const inputRef = useRef<TextInput>(null);
  const keyboardVisible = useRef(false);

  const puzzle = usePuzzle(samplePuzzle.sampleLayout);
  const {
    model,
    letters,
    selected,
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
  } = puzzle;

  const [elapsed, setElapsed] = useState(0);

  // Track real keyboard visibility: after it is dismissed the hidden input
  // still reports focused, so a plain focus() would be a no-op.
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      keyboardVisible.current = true;
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisible.current = false;
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Count up until the puzzle is solved.
  useEffect(() => {
    if (isSolved) return;
    const id = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [isSolved]);

  const closePuzzle = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  // On completion, briefly rest on the finished grid, then return home.
  useEffect(() => {
    if (!isSolved) return;
    const id = setTimeout(closePuzzle, 1200);
    return () => clearTimeout(id);
  }, [isSolved]);

  const gap = spacing[1];
  const cellSize = Math.min(
    MAX_CELL,
    Math.floor((width - spacing[5] * 2 - gap * (model.cols - 1)) / model.cols),
  );

  // Re-open the keyboard on every cell tap. If it was dismissed while the
  // input still holds focus, blur first so the next focus() actually raises it.
  const focusKeyboard = (): void => {
    const input = inputRef.current;
    if (input === null) return;
    if (!keyboardVisible.current && input.isFocused()) {
      input.blur();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      input.focus();
    }
  };

  const handleCellPress = (row: number, col: number): void => {
    selectCell(row, col);
    focusKeyboard();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ paddingTop: spacing[2] }}>
          <PuzzleTopbar label="Solo · Pratik" elapsedSeconds={elapsed} onClose={closePuzzle} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing[5], flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <PuzzleGrid
            model={model}
            letters={letters}
            selected={selected}
            activeKeys={activeKeys}
            wrongKeys={wrongKeys}
            cellSize={cellSize}
            gap={gap}
            onCellPress={handleCellPress}
          />
        </ScrollView>

        <View style={{ padding: spacing[5], gap: spacing[4] }}>
          <ClueBar clue={activeClue} />
          <PuzzleActions
            canActOnCell={selected !== null}
            onRevealLetter={revealLetter}
            onRevealWord={revealWord}
            onCheck={check}
          />
        </View>

        {/* Hidden field: captures Turkish keystrokes for the selected cell. */}
        <TextInput
          ref={inputRef}
          value=""
          onChangeText={(text) => {
            const char = text.slice(-1);
            if (char) inputLetter(char);
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') backspace();
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          spellCheck={false}
          caretHidden
          contextMenuHidden
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
