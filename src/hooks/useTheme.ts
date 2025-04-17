import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const { modeTheme: theme, setModeTheme: setTheme } = useThemeStore();
  return { theme, setTheme };
}
