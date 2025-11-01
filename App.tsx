import React, { useState, useEffect } from 'react';
import { useTranslations } from './hooks/useTranslations';
import type { BookingDetails, Barber, BarberSchedule, Service, ShopSettings } from './types';
import BarberSelector from './components/BarberSelector';
import ServiceSelector from './components/ServiceSelector';
import DateTimePicker from './components/DateTimePicker';
import UserInfoForm from './components/UserInfoForm';
import BookingSummary from './components/BookingSummary';
import Confirmation from './components/Confirmation';
import StepIndicator from './components/StepIndicator';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import AdminPanel from './components/AdminPanel';
import PasswordModal from './components/PasswordModal';
import Notification from './components/Notification';

// Initial data is now part of the component's state to be mutable
const INITIAL_SERVICES: Service[] = [
  { id: 1, name: { en: 'Haircut', fa: 'اصلاح مو' }, price: 250000, duration: 30 },
  { id: 2, name: { en: 'Beard Trim', fa: 'اصلاح ریش' }, price: 150000, duration: 20 },
  { id: 3, name: { en: 'Hair Color', fa: 'رنگ مو' }, price: 400000, duration: 60 },
  { id: 4, name: { en: 'Facial Mask', fa: 'ماسک صورت' }, price: 180000, duration: 25 },
  { id: 5, name: { en: 'Haircut & Beard', fa: 'اصلاح مو و ریش' }, price: 350000, duration: 50 },
  { id: 6, name: { en: 'VIP Package', fa: 'پکیج ویژه' }, price: 700000, duration: 90 },
];

const INITIAL_BARBERS: Barber[] = [
  { id: 1, name: { en: 'Amir', fa: 'امیر' }, imageUrl: 'https://i.pravatar.cc/150?u=amir' },
  { id: 2, name: { en: 'Reza', fa: 'رضا' }, imageUrl: 'https://i.pravatar.cc/150?u=reza' },
  { id: 3, name: { en: 'Sina', fa: 'سینا' }, imageUrl: 'https://i.pravatar.cc/150?u=sina' },
];

const INITIAL_SHOP_SETTINGS: ShopSettings = {
    name: { en: "Gentlemen's Cut", fa: "آرایشگاه آقایان" },
    manager: { en: 'Mr. Reza', fa: 'آقای رضا' },
}

const notificationAudio = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gUmVjb3JkZWQgYnkgQ29yZU5vVAJaLgAAA+8Dneu8AAlB+b4AYSRLpP+//+A/wAExBsBAMAIMoAYDEwM2sO+N40d/t/b/l/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8AE7f+DIr/eX/yf//wI/AP8A');


const App: React.FC = () => {
  // App-wide state
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const t = useTranslations(language);

  // Core data state
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);
  const [allBookings, setAllBookings] = useState<BookingDetails[]>([]);
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  // Booking process state
  const [currentStep, setCurrentStep] = useState(1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    barber: null,
    services: [],
    date: null,
    time: null,
    userInfo: { name: '', phone: '', photo: '' },
  });

  // Dynamic schedules state
  const [barberSchedules, setBarberSchedules] = useState<Record<number, BarberSchedule>>(() => {
     const initialSchedules: Record<number, BarberSchedule> = {};
     INITIAL_BARBERS.forEach(barber => {
        initialSchedules[barber.id] = {
            defaultWorkingDays: [6, 0, 1, 2, 3, 4], // Sat-Thu
            defaultSlots: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
            overrides: {}
        };
     });
     return initialSchedules;
  });

  // Effects for language and theme
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setIsPasswordModalOpen(true);
    }
  };
  
  const handlePasswordSubmit = (password: string) => {
      if (password === adminPassword) {
          setIsAdminMode(true);
          setIsPasswordModalOpen(false);
          return true;
      }
      return false;
  }


  // Navigation handlers
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  // Booking state handlers
  const updateBookingDetails = (details: Partial<BookingDetails>) => {
    setBookingDetails((prev) => ({ ...prev, ...details }));
  };
  
  const handleConfirmBooking = () => {
    const newBooking: BookingDetails = {
        ...bookingDetails,
        bookingId: Date.now(), // Simple unique ID for this session
    };
    
    setAllBookings(prev => [...prev, newBooking].sort((a, b) => {
        if (!a.date || !b.date) return 0;
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (a.time) {
            const [h, m] = a.time.split(':');
            dateA.setHours(parseInt(h, 10), parseInt(m, 10));
        }
        if (b.time) {
            const [h, m] = b.time.split(':');
            dateB.setHours(parseInt(h, 10), parseInt(m, 10));
        }
        return dateA.getTime() - dateB.getTime();
    }));
    
    if (isAdminMode) {
        setNotification({
            title: t.newBookingNotificationTitle,
            message: t.newBookingNotificationBody.replace('{customerName}', newBooking.userInfo.name).replace('{time}', newBooking.time || ''),
        });
        notificationAudio.play().catch(e => console.error("Error playing sound:", e));
    }


    handleNextStep(); // Move to confirmation screen
  };

  const resetBooking = () => {
    setBookingDetails({
      barber: null,
      services: [],
      date: null,
      time: null,
      userInfo: { name: '', phone: '', photo: '' },
    });
    setCurrentStep(1);
  };

  // Admin panel data handlers
  const handleSchedulesChange = (newSchedules: Record<number, BarberSchedule>) => {
    setBarberSchedules(newSchedules);
    alert(t.settingsSaved);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BarberSelector
            barbers={barbers}
            selectedBarber={bookingDetails.barber}
            onBarberSelect={(barber) => updateBookingDetails({ barber })}
            onNext={handleNextStep}
            t={t}
          />
        );
      case 2:
        return (
          <ServiceSelector
            services={services}
            selectedServices={bookingDetails.services}
            onServiceSelect={(services) => updateBookingDetails({ services })}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            t={t}
          />
        );
      case 3:
        if (!bookingDetails.barber) return <div>Please select a barber first.</div>;
        return (
          <DateTimePicker
            onDateTimeSelect={(date, time) => updateBookingDetails({ date, time })}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            t={t}
            bookingDetails={bookingDetails}
            schedule={barberSchedules[bookingDetails.barber.id]}
            allBookings={allBookings}
          />
        );
      case 4:
        return (
          <UserInfoForm
            userInfo={bookingDetails.userInfo}
            onUserInfoChange={(userInfo) => updateBookingDetails({ userInfo })}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            t={t}
          />
        );
      case 5:
        return (
          <BookingSummary
            bookingDetails={bookingDetails}
            onConfirm={handleConfirmBooking}
            onBack={handlePrevStep}
            t={t}
          />
        );
      case 6:
        return <Confirmation bookingDetails={bookingDetails} onReset={resetBooking} t={t} language={language} />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-500/10 dark:shadow-black/30 overflow-hidden border border-slate-200 dark:border-slate-700">
          <header className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-wider">{shopSettings.name[language]}</h1>
              <p className="text-sm text-amber-500 dark:text-amber-400">{t.barbershopSlogan}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleAdminToggle} className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">{isAdminMode ? t.close : t.adminPanel}</button>
              <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
          </header>

          <main className="p-6 md:p-8">
            {isAdminMode ? (
               <AdminPanel
                  barbers={barbers}
                  setBarbers={setBarbers}
                  services={services}
                  setServices={setServices}
                  schedules={barberSchedules} 
                  onSchedulesChange={handleSchedulesChange} 
                  shopSettings={shopSettings}
                  setShopSettings={setShopSettings}
                  allBookings={allBookings}
                  setAllBookings={setAllBookings}
                  t={t}
                  adminPassword={adminPassword}
                  setAdminPassword={setAdminPassword}
               />
            ) : (
              <>
                {currentStep <= 5 && <StepIndicator currentStep={currentStep} t={t} />}
                <div className="mt-8">
                  {renderStep()}
                </div>
              </>
            )}
          </main>
        </div>
         <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
          <p>{t.footerText}</p>
        </footer>
      </div>
      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        t={t}
      />
       {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default App;