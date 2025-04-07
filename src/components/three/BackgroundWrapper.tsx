import React, { useState, useEffect } from 'react';
import BackgroundAnimation from './BackgroundAnimation';
import RainAnimation from './RainAnimation';
import GalaxyAnimation from './GalaxyAnimation';

export default function BackgroundWrapper() {
  // Set 'galaxy' as the default animation
  const [animation, setAnimation] = useState('galaxy');
  // Set 'dark' as the default theme
  const [theme, setTheme] = useState('dark');

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-color', 'oklch(17.76% 0 0)');
      root.style.setProperty('--border-color', 'oklch(25% 0 0)');
      root.style.setProperty('--text-primary', 'oklch(93% 0 0)');
      root.style.setProperty('--text-secondary', 'oklch(75% 0 0)');
    } else {
      root.style.setProperty('--bg-color', 'oklch(98% 0 0)');
      root.style.setProperty('--border-color', 'oklch(85% 0 0)');
      root.style.setProperty('--text-primary', 'oklch(25% 0 0)');
      root.style.setProperty('--text-secondary', 'oklch(40% 0 0)');
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Always render the toggle
  return (
    <>
      <div className='z-0 overflow-hidden'>
        {animation === 'particles' ? (
          <BackgroundAnimation />
        ) : animation === 'rain' ? (
          <RainAnimation />
        ) : animation === 'galaxy' ? (
          <GalaxyAnimation />
        ) : // No animation when 'off' is selected
        null}
      </div>

      <div className='flex justify-end gap-2'>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`rounded-lg backdrop-blur-md p-2 shadow-md transition-all duration-300 border text-gray-400 hover:text-teal-400 ${
            theme === 'dark'
              ? 'bg-[oklch(22%_0_0)]/60 border-gray-800 hover:bg-[oklch(25%_0_0)]/80 hover:border-[oklch(30%_0_0)]/80'
              : 'bg-[oklch(95%_0_0)]/60 border-gray-300 hover:bg-[oklch(90%_0_0)]/80 hover:border-[oklch(85%_0_0)]/80'
          }`}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }>
          {theme === 'dark' ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <circle cx='12' cy='12' r='5'></circle>
              <line x1='12' y1='1' x2='12' y2='3'></line>
              <line x1='12' y1='21' x2='12' y2='23'></line>
              <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
              <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
              <line x1='1' y1='12' x2='3' y2='12'></line>
              <line x1='21' y1='12' x2='23' y2='12'></line>
              <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
              <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
            </svg>
          )}
        </button>

        {/* Animation toggles */}
        <div
          className={`rounded-lg backdrop-blur-md p-1 shadow-md transition-all duration-300 border ${
            theme === 'dark'
              ? 'bg-[oklch(22%_0_0)]/60 border-gray-800 hover:bg-[oklch(25%_0_0)]/80 hover:border-[oklch(30%_0_0)]/80'
              : 'bg-[oklch(95%_0_0)]/60 border-gray-300 hover:bg-[oklch(90%_0_0)]/80 hover:border-[oklch(85%_0_0)]/80'
          }`}>
          <div className='flex items-center'>
            <button
              onClick={() => setAnimation('particles')}
              className={`relative px-2.5 py-1.5 text-xs font-medium transition-all duration-300 rounded-l-md flex items-center justify-center ${
                animation === 'particles'
                  ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-400'
                  : `text-gray-400 hover:text-teal-400 ${
                      theme === 'dark'
                        ? 'hover:bg-[oklch(25%_0_0)]/40'
                        : 'hover:bg-[oklch(90%_0_0)]/40'
                    }`
              }`}
              aria-label='Show particles animation'>
              <span>Particles</span>
            </button>
            <button
              onClick={() => setAnimation('rain')}
              className={`relative px-2.5 py-1.5 text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                animation === 'rain'
                  ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-400'
                  : `text-gray-400 hover:text-teal-400 ${
                      theme === 'dark'
                        ? 'hover:bg-[oklch(25%_0_0)]/40'
                        : 'hover:bg-[oklch(90%_0_0)]/40'
                    }`
              }`}
              aria-label='Show rain animation'>
              <span>Rain</span>
            </button>
            <button
              onClick={() => setAnimation('galaxy')}
              className={`relative px-2.5 py-1.5 text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                animation === 'galaxy'
                  ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-400'
                  : `text-gray-400 hover:text-teal-400 ${
                      theme === 'dark'
                        ? 'hover:bg-[oklch(25%_0_0)]/40'
                        : 'hover:bg-[oklch(90%_0_0)]/40'
                    }`
              }`}
              aria-label='Show galaxy animation'>
              <span>Galaxy</span>
            </button>
            <button
              onClick={() => setAnimation('off')}
              className={`relative px-2.5 py-1.5 text-xs font-medium rounded-r-md transition-all duration-300 flex items-center justify-center ${
                animation === 'off'
                  ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-400'
                  : `text-gray-400 hover:text-teal-400 ${
                      theme === 'dark'
                        ? 'hover:bg-[oklch(25%_0_0)]/40'
                        : 'hover:bg-[oklch(90%_0_0)]/40'
                    }`
              }`}
              aria-label='Turn off animations'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='inline-block'>
                <path d='M18.36 6.64a9 9 0 1 1-12.73 0'></path>
                <line x1='12' y1='2' x2='12' y2='12'></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
