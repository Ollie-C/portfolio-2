import { create } from 'zustand';

export type AnimationTheme = 'none' | 'particles' | 'rain' | 'galaxy';
export type ModeTheme = 'dark' | 'light';

interface ThemeState {
  animationTheme: AnimationTheme;
  modeTheme: ModeTheme;
  setAnimationTheme: (theme: AnimationTheme) => void;
  setModeTheme: (theme: ModeTheme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  animationTheme: 'galaxy',
  modeTheme: 'light',

  setAnimationTheme: (theme) => set({ animationTheme: theme }),
  setModeTheme: (theme) => set({ modeTheme: theme }),
}));

export const applyThemeEffects = () => {
  const { animationTheme, modeTheme } = useThemeStore.getState();

  document.documentElement.setAttribute('data-animation', animationTheme);

  // Apply the theme class to the HTML element
  if (modeTheme === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};

// Apply theme changes whenever store changes
useThemeStore.subscribe(applyThemeEffects);

// Apply the initial theme
applyThemeEffects();
