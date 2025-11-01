import React, { useState } from 'react';
import type { BookingDetails, Translations } from '../types';

interface BookingSummaryProps {
  bookingDetails: BookingDetails;
  onConfirm: () => void;
  onBack: () => void;
  t: Translations;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingDetails, onConfirm, onBack, t }) => {
  const language = document.documentElement.lang as 'fa' | 'en';
  const { barber, services, date, time, userInfo } = bookingDetails;
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = services.reduce((acc, s) => acc + s.price, 0);
  
  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onConfirm();
    }, 1500);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(price);
  }
  
  const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-6">{t.bookingSummary}</h2>
      
      <div className="space-y-6 bg-slate-200/50 dark:bg-slate-700/50 p-6 rounded-lg text-slate-900 dark:text-white">
        <div>
          <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-2">{t.selectedBarber}</h3>
          <p className="font-semibold text-lg">{barber?.name[language]}</p>
        </div>

        <div>
          <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-2">{t.selectedServices}</h3>
          <ul className="list-disc list-inside space-y-1 marker:text-amber-500">
            {services.map(s => <li key={s.id}>{s.name[language]}</li>)}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600 flex justify-between">
            <span className="font-semibold">{t.totalPrice}:</span>
            <span className="font-bold">{formatPrice(totalPrice)} {t.toman}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-2">{t.dateTime}</h3>
          <p>{formatDate(date)}</p>
          <p>{t.selectTime}: {time}</p>
        </div>

        <div>
          <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-2">{t.personalInfo}</h3>
          <p>{t.fullName}: {userInfo.name}</p>
          <p>{t.phoneNumber}: {userInfo.phone}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button onClick={onBack} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-300">
          {t.back}
        </button>
        <button onClick={handleConfirm} disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-wait flex items-center justify-center">
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            t.confirmBooking
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;