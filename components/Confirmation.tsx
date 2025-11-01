import React, { useEffect } from 'react';
import type { BookingDetails, Translations } from '../types';

interface ConfirmationProps {
  bookingDetails: BookingDetails;
  onReset: () => void;
  t: Translations;
  language: 'fa' | 'en';
}

const Confirmation: React.FC<ConfirmationProps> = ({ bookingDetails, onReset, t, language }) => {
  
  useEffect(() => {
    if (bookingDetails.barber) {
      const message = t.notificationSent.replace('{barberName}', bookingDetails.barber.name[language]);
      setTimeout(() => alert(message), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.bookingConfirmed}</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{t.thankYouMessage}</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{t.confirmationDetails}</p>
      
      <button 
        onClick={onReset}
        className="w-full max-w-xs bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300"
      >
        {t.newBooking}
      </button>
    </div>
  );
};

export default Confirmation;