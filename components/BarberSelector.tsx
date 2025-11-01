import React from 'react';
import type { Barber, Translations } from '../types';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarber: Barber | null;
  onBarberSelect: (barber: Barber) => void;
  onNext: () => void;
  t: Translations;
}

const BarberSelector: React.FC<BarberSelectorProps> = ({ barbers, selectedBarber, onBarberSelect, onNext, t }) => {
  const language = document.documentElement.lang as 'fa' | 'en';

  const handleSelect = (barber: Barber) => {
    onBarberSelect(barber);
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-6">{t.selectBarber}</h2>
      <div className="grid grid-cols-3 gap-4">
        {barbers.map(barber => {
          const isSelected = selectedBarber?.id === barber.id;
          return (
            <div
              key={barber.id}
              onClick={() => handleSelect(barber)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 flex flex-col items-center gap-3 ${
                isSelected 
                  ? 'bg-amber-400/20 border-amber-500 scale-105' 
                  : 'bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-400'
              }`}
            >
              {barber.imageUrl ? (
                 <img src={barber.imageUrl} alt={barber.name[language]} className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-400 dark:ring-slate-500"/>
              ) : (
                <div className="w-16 h-16 bg-slate-400 dark:bg-slate-600 rounded-full flex items-center justify-center text-2xl font-bold text-white ring-2 ring-slate-500">
                  {getInitials(barber.name[language])}
                </div>
              )}
              <h3 className="font-semibold text-slate-800 dark:text-white text-center">{barber.name[language]}</h3>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!selectedBarber}
          className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:text-slate-600 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default BarberSelector;