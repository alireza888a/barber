import React from 'react';
import type { Translations } from '../types';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  t: Translations;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme, t }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      title={t.themeToggle as string}
      className="p-2 text-sm font-medium text-amber-600 dark:text-amber-300 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-300/70 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors duration-200"
    >
      {theme === 'dark' ? (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM4.54 5.46A1 1 0 015.95 4.05l.707.707A1 1 0 115.243 6.17l-.707-.707a1 1 0 01-.707-1.414zM10 16a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;