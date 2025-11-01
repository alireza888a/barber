import React, { useState, useEffect, useMemo } from 'react';
import type { Barber, BarberSchedule, Service, ShopSettings, Translations, DailyScheduleOverride, BookingDetails } from '../types';

interface AdminPanelProps {
  barbers: Barber[];
  setBarbers: React.Dispatch<React.SetStateAction<Barber[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  schedules: Record<number, BarberSchedule>;
  onSchedulesChange: (newSchedules: Record<number, BarberSchedule>) => void;
  shopSettings: ShopSettings;
  setShopSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  allBookings: BookingDetails[];
  setAllBookings: React.Dispatch<React.SetStateAction<BookingDetails[]>>;
  t: Translations;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
}

type AdminTab = 'bookings' | 'schedules' | 'services' | 'barbers' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const { barbers, setBarbers, services, setServices, schedules, onSchedulesChange, shopSettings, setShopSettings, allBookings, setAllBookings, t, adminPassword, setAdminPassword } = props;

  return (
    <div>
      <div className="border-b border-slate-300 dark:border-slate-700 mb-6">
        <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
          {(t.adminTabs as string[]).map((tabName, index) => {
            const tabId = ['bookings', 'schedules', 'services', 'barbers', 'settings'][index] as AdminTab;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`${
                  activeTab === tabId
                    ? 'border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tabName}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {activeTab === 'bookings' && <BookingViewer bookings={allBookings} setBookings={setAllBookings} t={t} />}
        {activeTab === 'schedules' && <ScheduleEditor barbers={barbers} schedules={schedules} onSchedulesChange={onSchedulesChange} t={t} />}
        {activeTab === 'services' && <ServiceEditor services={services} setServices={setServices} t={t} />}
        {activeTab === 'barbers' && <BarberEditor barbers={barbers} setBarbers={setBarbers} t={t} />}
        {activeTab === 'settings' && <SettingsEditor shopSettings={shopSettings} setShopSettings={setShopSettings} t={t} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />}
      </div>
    </div>
  );
};


// Bookings Viewer Component
const BookingViewer: React.FC<{bookings: BookingDetails[], setBookings: React.Dispatch<React.SetStateAction<BookingDetails[]>>, t: Translations}> = ({ bookings, setBookings, t }) => {
    const language = document.documentElement.lang as 'fa' | 'en';

    const handleDelete = (bookingId?: number) => {
        if (!bookingId) return;
        if (window.confirm(t.confirmDelete as string)) {
            setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
        }
    };

    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      });
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t.allBookings}</h2>
            {bookings.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">{t.noBookings}</p>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {bookings.map(booking => (
                        <div key={booking.bookingId} className="bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                     {booking.userInfo.photo ? (
                                        <img src={booking.userInfo.photo} alt={booking.userInfo.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600"/>
                                     ) : (
                                        <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-500 text-2xl font-bold">?</div>
                                     )}
                                    <div>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">{booking.userInfo.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{booking.userInfo.phone}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(booking.bookingId)} className="text-red-500 hover:text-red-400 text-sm font-semibold flex-shrink-0">{t.delete}</button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600 space-y-2 text-sm">
                                <p><span className="font-semibold">{t.selectedBarber}:</span> {booking.barber?.name[language]}</p>
                                <p><span className="font-semibold">{t.dateTime}:</span> {formatDate(booking.date)} - {booking.time}</p>
                                <div>
                                    <p className="font-semibold">{t.selectedServices}:</p>
                                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600 dark:text-slate-300">
                                        {booking.services.map(s => <li key={s.id}>{s.name[language]}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// Schedule Editor Component
const ScheduleEditor: React.FC<Pick<AdminPanelProps, 'barbers' | 'schedules' | 'onSchedulesChange' | 't'>> = ({ barbers, schedules, onSchedulesChange, t }) => {
  const language = document.documentElement.lang as 'fa' | 'en';
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(barbers[0]?.id || null);
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingDate, setEditingDate] = useState<Date | null>(null);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  const handleDayClick = (day: Date) => {
    setEditingDate(day);
  };
  
  const handleScheduleOverride = (date: Date, override: DailyScheduleOverride) => {
      if (!selectedBarberId) return;
      const dateString = toDateString(date);
      setLocalSchedules(prev => {
          const newSchedules = JSON.parse(JSON.stringify(prev));
          newSchedules[selectedBarberId].overrides[dateString] = override;
          return newSchedules;
      });
  }

  const daysInMonth = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const days: (Date | null)[] = [];
    const firstDayIndex = date.getDay();
    const adjustedFirstDayIndex = language === 'fa' ? (firstDayIndex + 1) % 7 : firstDayIndex;
    for (let i = 0; i < adjustedFirstDayIndex; i++) { days.push(null); }
    while (date.getMonth() === currentMonth.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth, language]);

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const toDateString = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const calendarDayNames = language === 'fa' ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div>
        <div className="mb-6">
            <label htmlFor="barber-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t.selectBarberToManage}</label>
            <select
            id="barber-select"
            value={selectedBarberId || ''}
            onChange={(e) => {
                setSelectedBarberId(Number(e.target.value));
                setEditingDate(null);
            }}
            className="w-full p-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
            >
            {barbers.map(barber => <option key={barber.id} value={barber.id}>{barber.name[language]}</option>)}
            </select>
        </div>

        {selectedBarberId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-3">{t.selectDate}</h3>
                    <div className="bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeMonth(-1)} className="px-3 py-1 rounded-md bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500">&lt;</button>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{currentMonth.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', { month: 'long', year: 'numeric' })}</h4>
                            <button onClick={() => changeMonth(1)} className="px-3 py-1 rounded-md bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {calendarDayNames.map((d, i) => <div key={i}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {daysInMonth.map((day, i) => {
                                if (!day) return <div key={i}></div>;
                                const isSelected = editingDate?.toDateString() === day.toDateString();
                                return(
                                <div key={i} className="flex justify-center items-center h-10">
                                    <button
                                        onClick={() => handleDayClick(day)}
                                        className={`w-10 h-10 rounded-full transition-colors duration-200 ${isSelected ? 'bg-amber-500 text-white font-bold' : 'text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {day.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US', { day: 'numeric' })}
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                {editingDate && (
                    <DayScheduleEditor 
                        date={editingDate}
                        schedule={localSchedules[selectedBarberId]}
                        onScheduleChange={(override) => handleScheduleOverride(editingDate, override)}
                        t={t}
                    />
                )}
            </div>
        )}
        <button onClick={() => onSchedulesChange(localSchedules)} className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300">
            {t.saveChanges}
        </button>
    </div>
  );
}

const DayScheduleEditor: React.FC<{date: Date, schedule: BarberSchedule, onScheduleChange: (override: DailyScheduleOverride) => void, t: Translations}> = ({date, schedule, onScheduleChange, t}) => {
    const language = document.documentElement.lang as 'fa' | 'en';
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayOfWeek = date.getDay();

    const currentSchedule = schedule.overrides[dateString] || {
        isWorking: schedule.defaultWorkingDays.includes(dayOfWeek),
        slots: schedule.defaultSlots,
    };
    
    const [isWorking, setIsWorking] = useState(currentSchedule.isWorking);
    const [slots, setSlots] = useState<string[]>(currentSchedule.slots);
    const [newSlot, setNewSlot] = useState('');

    useEffect(() => {
        const override = schedule.overrides[dateString] || {
            isWorking: schedule.defaultWorkingDays.includes(dayOfWeek),
            slots: schedule.defaultSlots,
        };
        setIsWorking(override.isWorking);
        setSlots(override.slots);
    }, [date, schedule, dateString, dayOfWeek]);


    useEffect(() => {
        onScheduleChange({ isWorking, slots });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWorking, slots]);
    
    const addSlot = () => {
        if (newSlot.match(/^\d{2}:\d{2}$/) && !slots.includes(newSlot)) {
            setSlots(prev => [...prev, newSlot].sort());
            setNewSlot('');
        }
    }
    const removeSlot = (slotToRemove: string) => {
        setSlots(prev => prev.filter(s => s !== slotToRemove));
    }
    
    return (
        <div>
            <h3 className="font-bold text-amber-500 dark:text-amber-400 mb-3">{t.editDaySchedule} {date.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</h3>
            <div className='bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg space-y-4'>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">{isWorking ? t.workingDay : t.dayOff}</span>
                    <label htmlFor="is-working-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isWorking} onChange={(e) => setIsWorking(e.target.checked)} id="is-working-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-400 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                    </label>
                </div>
                {isWorking && (
                    <div>
                        <h4 className="font-semibold mb-2">{t.timeSlotsForDay}</h4>
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                           {slots.map(slot => (
                               <div key={slot} className="flex justify-between items-center bg-slate-300 dark:bg-slate-600 p-2 rounded">
                                   <span>{slot}</span>
                                   <button onClick={() => removeSlot(slot)} className="text-red-500 hover:text-red-700">×</button>
                               </div>
                           ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                            <input type="text" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} placeholder={t.newSlotPlaceholder as string} className="w-full p-2 bg-slate-300 dark:bg-slate-600 border border-slate-400 dark:border-slate-500 rounded text-slate-900 dark:text-white" />
                            <button onClick={addSlot} className="px-4 py-2 bg-amber-500 text-white rounded">{t.addSlot}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// Service Editor Component
const ServiceEditor: React.FC<Pick<AdminPanelProps, 'services' | 'setServices' | 't'>> = ({ services, setServices, t }) => {
    const language = document.documentElement.lang as 'fa' | 'en';
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleSave = (serviceToSave: Service) => {
        if (serviceToSave.id) { // Update existing
            setServices(prev => prev.map(s => s.id === serviceToSave.id ? serviceToSave : s));
        } else { // Add new
            const newId = Math.max(...services.map(s => s.id), 0) + 1;
            setServices(prev => [...prev, { ...serviceToSave, id: newId }]);
        }
        setEditingService(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t.confirmDelete as string)) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    if (editingService) {
        return <ServiceForm service={editingService} onSave={handleSave} onCancel={() => setEditingService(null)} t={t} />;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t.manageServices}</h2>
            <div className="space-y-3">
                {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="font-bold">{service.name[language]}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{service.price} {t.toman} - {service.duration} {t.minutes}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setEditingService(service)} className="text-blue-500 hover:underline">{t.edit}</button>
                            <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:underline">{t.delete}</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setEditingService({id: 0, name: {en: '', fa: ''}, price: 0, duration: 0})} className="mt-6 w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400">
                {t.addService}
            </button>
        </div>
    );
};

const ServiceForm: React.FC<{service: Service, onSave: (service: Service) => void, onCancel: () => void, t: Translations}> = ({service, onSave, onCancel, t}) => {
    const [formState, setFormState] = useState(service);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, dataset } = e.target;
        if (name === 'name') {
            setFormState(prev => ({...prev, name: {...prev.name, [dataset.lang as string]: value}}));
        } else {
            setFormState(prev => ({...prev, [name]: Number(value)}));
        }
    };
    
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">{service.id ? t.editService : t.addService}</h3>
            <div className="space-y-4">
                <input name="name" data-lang="fa" value={formState.name.fa} onChange={handleChange} placeholder={t.serviceName + " (فارسی)"} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
                <input name="name" data-lang="en" value={formState.name.en} onChange={handleChange} placeholder={t.serviceName + " (English)"} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
                <input name="price" type="number" value={formState.price} onChange={handleChange} placeholder={t.price as string} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
                <input name="duration" type="number" value={formState.duration} onChange={handleChange} placeholder={t.duration as string} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={onCancel} className="w-full bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-400">{t.cancel}</button>
                <button onClick={() => onSave(formState)} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500">{t.save}</button>
            </div>
        </div>
    );
}

// Barber Editor Component
const BarberEditor: React.FC<Pick<AdminPanelProps, 'barbers' | 'setBarbers' | 't'>> = ({ barbers, setBarbers, t }) => {
    const language = document.documentElement.lang as 'fa' | 'en';
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

    const handleSave = (barberToSave: Barber) => {
        if (barberToSave.id) { // Update existing
            setBarbers(prev => prev.map(b => b.id === barberToSave.id ? barberToSave : b));
        } else { // Add new
            const newId = Math.max(...barbers.map(b => b.id), 0) + 1;
            setBarbers(prev => [...prev, { ...barberToSave, id: newId }]);
        }
        setEditingBarber(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t.confirmDelete as string)) {
            setBarbers(prev => prev.filter(b => b.id !== id));
        }
    };
    
    if (editingBarber) {
        return <BarberForm barber={editingBarber} onSave={handleSave} onCancel={() => setEditingBarber(null)} t={t} />;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t.manageBarbers}</h2>
            <div className="space-y-3">
                {barbers.map(barber => (
                    <div key={barber.id} className="flex items-center justify-between p-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={barber.imageUrl || 'https://i.pravatar.cc/150'} alt={barber.name[language]} className="w-12 h-12 rounded-full"/>
                            <p className="font-bold">{barber.name[language]}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setEditingBarber(barber)} className="text-blue-500 hover:underline">{t.edit}</button>
                            <button onClick={() => handleDelete(barber.id)} className="text-red-500 hover:underline">{t.delete}</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setEditingBarber({id: 0, name: {en: '', fa: ''}, imageUrl: ''})} className="mt-6 w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400">
                {t.addBarber}
            </button>
        </div>
    );
};

const BarberForm: React.FC<{barber: Barber, onSave: (barber: Barber) => void, onCancel: () => void, t: Translations}> = ({barber, onSave, onCancel, t}) => {
    const [formState, setFormState] = useState(barber);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, dataset } = e.target;
        if (name === 'name') {
            setFormState(prev => ({...prev, name: {...prev.name, [dataset.lang as string]: value}}));
        } else {
            setFormState(prev => ({...prev, [name]: value}));
        }
    };
    
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">{barber.id ? t.editBarber : t.addBarber}</h3>
            <div className="space-y-4">
                <input name="name" data-lang="fa" value={formState.name.fa} onChange={handleChange} placeholder={t.barberName + " (فارسی)"} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
                <input name="name" data-lang="en" value={formState.name.en} onChange={handleChange} placeholder={t.barberName + " (English)"} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
                <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} placeholder={t.imageUrl as string} className="w-full p-2 bg-slate-200 dark:bg-slate-700 rounded"/>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={onCancel} className="w-full bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-400">{t.cancel}</button>
                <button onClick={() => onSave(formState)} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500">{t.save}</button>
            </div>
        </div>
    );
}


// Settings Editor Component
const SettingsEditor: React.FC<Pick<AdminPanelProps, 'shopSettings' | 'setShopSettings' | 't' | 'adminPassword' | 'setAdminPassword'>> = ({ shopSettings, setShopSettings, t, adminPassword, setAdminPassword }) => {
    const [localSettings, setLocalSettings] = useState(shopSettings);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: ''});
    const [passwordError, setPasswordError] = useState('');

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, dataset } = e.target;
        const field = name as keyof ShopSettings;
        setLocalSettings(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [dataset.lang as string]: value
            }
        }));
    };

    const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({...prev, [name]: value}));
    }

    const handlePasswordSave = () => {
        setPasswordError('');
        if (passwordForm.current !== adminPassword) {
            setPasswordError(t.passwordIncorrect as string);
            return;
        }
        if (passwordForm.new.length < 4) {
             setPasswordError('رمز جدید باید حداقل ۴ کاراکتر باشد.');
             return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordError(t.passwordMismatch as string);
            return;
        }
        setAdminPassword(passwordForm.new);
        setPasswordForm({ current: '', new: '', confirm: ''});
        alert(t.passwordChanged);
    }

    const handleSettingsSave = () => {
        setShopSettings(localSettings);
        alert(t.settingsSaved);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t.adminSettings}</h2>
                <div className="space-y-6 bg-slate-200/50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.shopName}</label>
                        <div className="space-y-3">
                            <input name="name" data-lang="fa" value={localSettings.name.fa} onChange={handleSettingsChange} placeholder={t.shopName + " (فارسی)"} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                            <input name="name" data-lang="en" value={localSettings.name.en} onChange={handleSettingsChange} placeholder={t.shopName + " (English)"} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.managerName}</label>
                        <div className="space-y-3">
                            <input name="manager" data-lang="fa" value={localSettings.manager.fa} onChange={handleSettingsChange} placeholder={t.managerName + " (فارسی)"} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                            <input name="manager" data-lang="en" value={localSettings.manager.en} onChange={handleSettingsChange} placeholder={t.managerName + " (English)"} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                        </div>
                    </div>
                </div>
                <button onClick={handleSettingsSave} className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300">
                    {t.saveChanges}
                </button>
            </div>
            
            <div>
                 <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t.changePassword}</h2>
                 <div className="space-y-4 bg-slate-200/50 dark:bg-slate-700/50 p-6 rounded-lg">
                    <input name="current" type="password" value={passwordForm.current} onChange={handlePasswordFormChange} placeholder={t.currentPassword as string} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                    <input name="new" type="password" value={passwordForm.new} onChange={handlePasswordFormChange} placeholder={t.newPassword as string} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                    <input name="confirm" type="password" value={passwordForm.confirm} onChange={handlePasswordFormChange} placeholder={t.confirmNewPassword as string} className="w-full p-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"/>
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>
                 <button onClick={handlePasswordSave} className="mt-6 w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300">
                    {t.changePassword}
                </button>
            </div>
        </div>
    );
};


export default AdminPanel;
