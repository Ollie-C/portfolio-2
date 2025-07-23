import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import LanguageSelector from './LanguageSelector';
import {
  Sun,
  Moon,
  Settings,
  Minus,
  CircleDot,
  Cloud,
  Orbit,
} from 'lucide-react';
import { useThemeStore, AnimationTheme } from '../store/themeStore';
import LanguageSelector from './LanguageSelector';

interface OptionsProps {
  onAnimationChange?: (animation: string) => void;
  currentAnimation?: string;
}

const Options = ({ onAnimationChange }: OptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { animationTheme, modeTheme, setAnimationTheme, setModeTheme } =
    useThemeStore();

  // Call the callback if provided when animation changes
  useEffect(() => {
    if (onAnimationChange) {
      onAnimationChange(animationTheme);
    }
  }, [animationTheme, onAnimationChange]);

  // Animation theme options
  const animationOptions: {
    value: AnimationTheme;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'none',
      label: 'None',
      icon: null,
    },
    {
      value: 'particles',
      label: 'Particles',
      icon: <CircleDot size={16} />,
    },
    {
      value: 'rain',
      label: 'Rain',
      icon: <Cloud size={16} />,
    },
    {
      value: 'galaxy',
      label: 'Galaxy',
      icon: <Orbit size={16} />,
    },
  ];

  const toggleLightDarkMode = () => {
    setModeTheme(modeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className='relative flex items-center gap-2 pointer-events-auto'>
      {/* Language selector / Disabled for now */}
      <LanguageSelector />
      {/* Settings button */}
      <button
        className='w-11 h-10 rounded bg-transparent flex items-center justify-center hover:bg-primary/10 transition-colors p-0'
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Theme options'>
        <Settings size={18} />
      </button>

      {/* Container for expanded options */}
      <div
        className='absolute bottom-full md:right-0 right-auto left-0 md:left-auto mb-2'
        onMouseLeave={() => setIsOpen(false)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className='bg-transparent backdrop-blur-sm p-4 rounded-md border border-border shadow-xl min-w-[240px]'>
              {/* Section: Appearance */}
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-sm font-medium text-foreground mb-3 pb-1'>
                  Light Mode
                </h3>

                {/* Light/Dark Mode Toggle */}
                <div className='flex items-center justify-between mb-3'>
                  <button
                    onClick={toggleLightDarkMode}
                    className={`flex items-center gap-2 px-3 py-1.5 bg-transparent border border-secondary rounded transition-colors `}
                    aria-label={`Switch to ${
                      modeTheme === 'dark' ? 'light' : 'dark'
                    } mode`}>
                    {modeTheme === 'dark' ? (
                      <Sun size={12} />
                    ) : (
                      <Moon size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Section: Background Animation */}
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-3 pb-1'>
                  Animation
                </h3>
                <div className='grid grid-cols-4 gap-2'>
                  {animationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAnimationTheme(option.value)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded bg-transparent ${
                        animationTheme === option.value
                          ? 'border border-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted/90 border border-border'
                      } transition-colors`}
                      title={option.label}>
                      <span>{option.icon}</span>
                      {/* <span>{option.label}</span> */}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Options;
