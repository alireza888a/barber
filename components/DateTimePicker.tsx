import React, { useState, useMemo } from 'react';
import type { BookingDetails, Translations, BarberSchedule } from '../types';

interface DateTimePickerProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  onNext: () => void;
  onBack: () => void;
  t: Translations;
  bookingDetails: BookingDetails;
  schedule: BarberSchedule;
  allBookings: BookingDetails[];
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onDateTimeSelect, onNext, onBack, t, bookingDetails, schedule, allBookings }) => {
  const language = document.documentElement.lang as 'fa' | 'en';
  const [selectedDate, setSelectedDate] = useState<Date | null>(bookingDetails.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(bookingDetails.time);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const days: (Date | null)[] = [];
    const firstDayIndex = date.getDay();
    // Adjust for Persian calendar where Saturday is the first day of the week
    const adjustedFirstDayIndex = language === 'fa' ? (firstDayIndex + 1) % 7 : firstDayIndex;

    for (let i = 0; i < adjustedFirstDayIndex; i++) {
        days.push(null);
    }
    while (date.getMonth() === currentMonth.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth, language]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const toDateString = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !schedule || !bookingDetails.barber) return [];
    
    const dateString = toDateString(selectedDate);
    const dayOfWeek = selectedDate.getDay();

    let potentialSlots: string[] = [];
    const override = schedule.overrides[dateString];
    
    if (override) {
        potentialSlots = override.isWorking ? override.slots : [];
    } else if (schedule.defaultWorkingDays.includes(dayOfWeek)) {
        potentialSlots = schedule.defaultSlots;
    } else {
        return [];
    }

    // Filter out booked slots
    const bookedSlotsForDay = allBookings
        .filter(booking => 
            booking.barber?.id === bookingDetails.barber?.id &&
            booking.date &&
            booking.date.toDateString() === selectedDate.toDateString()
        )
        .map(booking => booking.time);

    return potentialSlots.filter(slot => !bookedSlotsForDay.includes(slot));

  }, [selectedDate, schedule, allBookings, bookingDetails.barber]);


  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
      if (selectedDate) {
        onDateTimeSelect(selectedDate, time);
      }
  }

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const isNextDisabled = !selectedDate || !selectedTime;
  const isPastMonth = currentMonth.getFullYear() < today.getFullYear() || 
                      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth());

  const dayNames = language === 'fa'
    ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-6">{t.selectDateTime}</h2>
      
      <div className="bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => !isPastMonth && changeMonth(-1)} disabled={isPastMonth} className="px-3 py-1 rounded-md bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {currentMonth.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded-md bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 dark:text-slate-400 mb-2">
          {dayNames.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, i) => {
            if (!day) return <div key={i}></div>;

            const dateString = toDateString(day);
            const dayOfWeek = day.getDay();
            const override = schedule.overrides[dateString];
            const isWorking = override ? override.isWorking : schedule.defaultWorkingDays.includes(dayOfWeek);
            const isDisabled = day < today || !isWorking;
            
            return (
              <div key={i} className="flex justify-center items-center h-10">
                <button
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`w-10 h-10 rounded-full transition-colors duration-200 ${
                    isDisabled ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed line-through' :
                    selectedDate?.toDateString() === day.toDateString() ? 'bg-amber-400 text-slate-900 font-bold' :
                    'text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {day.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', { day: 'numeric' })}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="font-semibold text-center text-slate-900 dark:text-white mb-4">{t.availableSlots}</h3>
          {availableTimeSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableTimeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg transition-colors duration-200 text-center font-semibold ${
                    selectedTime === time ? 'bg-amber-400 text-slate-900' : 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">{t.noSlotsAvailable}</p>
          )}
        </div>
      )}
      
      <div className="mt-8 flex gap-4">
        <button onClick={onBack} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-300">
          {t.back}
        </button>
        <button onClick={onNext} disabled={isNextDisabled} className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-500 dark:disabled:text-slate-400">
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DateTimePicker;