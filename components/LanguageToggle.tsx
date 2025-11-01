import React from 'react';

interface LanguageToggleProps {
  language: 'fa' | 'en';
  setLanguage: (lang: 'fa' | 'en') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-300 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-300/70 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors duration-200"
    >
      {language === 'en' ? 'فارسی' : 'English'}
    </button>
  );
};

export default LanguageToggle;