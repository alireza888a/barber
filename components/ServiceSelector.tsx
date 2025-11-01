import React, { useMemo } from 'react';
import type { Service, Translations } from '../types';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Service[];
  onServiceSelect: (services: Service[]) => void;
  onNext: () => void;
  onBack: () => void;
  t: Translations;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, selectedServices, onServiceSelect, onNext, onBack, t }) => {
  const language = document.documentElement.lang as 'fa' | 'en';

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      onServiceSelect(selectedServices.filter(s => s.id !== service.id));
    } else {
      onServiceSelect([...selectedServices, service]);
    }
  };

  const { totalPrice, totalDuration } = useMemo(() => {
    return selectedServices.reduce(
      (acc, service) => {
        acc.totalPrice += service.price;
        acc.totalDuration += service.duration;
        return acc;
      },
      { totalPrice: 0, totalDuration: 0 }
    );
  }, [selectedServices]);
  
  const formatPrice = (price: number) => {
      return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(price);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-6">{t.selectServices}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
        {services.map(service => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                isSelected ? 'bg-amber-400/20 border-amber-400' : 'bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:border-amber-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">{service.name[language]}</h3>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-amber-400 border-amber-400' : 'border-slate-400 dark:border-slate-500'}`}>
                  {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex justify-between">
                <span>{formatPrice(service.price)} {t.toman}</span>
                <span>{service.duration} {t.minutes}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center text-slate-900 dark:text-white">
          <span className="font-bold">{t.totalPrice}:</span>
          <span className="font-bold text-amber-500 dark:text-amber-400">{formatPrice(totalPrice)} {t.toman}</span>
        </div>
        <div className="flex justify-between items-center text-slate-900 dark:text-white mt-2">
          <span className="font-bold">{t.totalDuration}:</span>
          <span className="font-bold">{totalDuration} {t.minutes}</span>
        </div>
        <div className="mt-4 flex gap-4">
             <button onClick={onBack} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-300">
                {t.back}
            </button>
            <button
                onClick={onNext}
                disabled={selectedServices.length === 0}
                className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {t.next}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;