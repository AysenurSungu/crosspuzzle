import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type Colors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';

export interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  isDark: false,
};

const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  isDark: true,
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
