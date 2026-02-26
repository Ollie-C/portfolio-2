import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import LanguageSelector from './LanguageSelector';

interface OptionsProps {
  onAnimationChange?: (animation: string) => void;
  currentAnimation?: string;
}

const Options = (_props: OptionsProps) => {
  const { modeTheme, setModeTheme } = useThemeStore();

  const toggleLightDarkMode = () => {
    setModeTheme(modeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className='relative flex items-center gap-2 pointer-events-auto'>
      <button
        type='button'
        onClick={toggleLightDarkMode}
        className='w-11 h-10 rounded-lg flex items-center justify-center hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors p-0'
        aria-label={
          modeTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        }>
        {modeTheme === 'dark' ? (
          <Sun size={18} aria-hidden />
        ) : (
          <Moon size={18} aria-hidden />
        )}
      </button>
      <LanguageSelector />
    </div>
  );
};

export default Options;
