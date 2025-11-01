export interface Service {
  id: number;
  name: {
    en: string;
    fa: string;
  };
  price: number;
  duration: number; // in minutes
}

export interface UserInfo {
  name: string;
  phone: string;
  photo?: string; // Base64 encoded image
}

export interface Barber {
  id: number;
  name: {
    en: string;
    fa: string;
  };
  imageUrl?: string;
}

export interface DailyScheduleOverride {
  isWorking: boolean;
  slots: string[];
}

export interface BarberSchedule {
  defaultWorkingDays: number[]; // 0 for Sunday, 6 for Saturday
  defaultSlots: string[];
  overrides: Record<string, DailyScheduleOverride>; // key: 'YYYY-MM-DD'
}


export interface BookingDetails {
  bookingId?: number;
  barber: Barber | null;
  services: Service[];
  date: Date | null;
  time: string | null;
  userInfo: UserInfo;
}

export interface ShopSettings {
  name: {
    en: string;
    fa: string;
  };
  manager: {
    en: string;
    fa: string;
  };
}

export interface Translations {
  [key: string]: string | string[];
  barbershopName: string;
  barbershopSlogan: string;
  // Steps
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  // Language & Theme
  langEn: string;
  langFa: string;
  themeToggle: string;
  light: string;
  dark: string;
  // Step 1: Barber
  selectBarber: string;
  // Step 2: Services
  selectServices: string;
  totalPrice: string;
  totalDuration: string;
  minutes: string;
  toman: string;
  // Step 3: Date & Time
  selectDateTime: string;
  selectDate: string;
  selectTime: string;
  availableSlots: string;
  noSlotsAvailable: string;
  // Step 4: User Info
  enterDetails: string;
  fullName: string;
  phoneNumber: string;
  fullNamePlaceholder: string;
  phoneNumberPlaceholder: string;
  uploadPhoto: string;
  photoPreview: string;
  // Step 5: Summary
  bookingSummary: string;
  selectedBarber: string;
  selectedServices: string;
  dateTime: string;
  personalInfo: string;
  confirmBooking: string;
  // Step 6: Confirmation
  bookingConfirmed: string;
  thankYouMessage: string;
  confirmationDetails: string;
  newBooking: string;
  notificationSent: string;
  // Common
  next: string;
  back: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  submit: string;
  // Footer
  footerText: string;
  // Admin
  adminPanel: string;
  adminTabs: string[];
  manageSchedules: string;
  selectBarberToManage: string;
  workingDays: string;
  holidays: string;
  saveChanges: string;
  close: string;
  settingsSaved: string;
  dayNames: string[];
  editDaySchedule: string;
  dayOff: string;
  workingDay: string;
  timeSlotsForDay: string;
  addSlot: string;
  newSlotPlaceholder: string;
  // Admin Services
  manageServices: string;
  addService: string;
  editService: string;
  serviceName: string;
  price: string;
  duration: string;
  confirmDelete: string;
  // Admin Barbers
  manageBarbers: string;
  addBarber: string;
  editBarber: string;
  barberName: string;
  imageUrl: string;
  // Admin Settings
  adminSettings: string;
  shopName: string;
  managerName: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  passwordMismatch: string;
  passwordIncorrect: string;
  passwordChanged: string;
  // Admin Security
  passwordModalTitle: string;
  passwordError: string;
  enterAdminPassword?: string;
  incorrectPassword?: string;
  // Admin Bookings
  allBookings: string;
  noBookings: string;
  customer: string;
  contact: string;
  // Admin Notifications
  newBookingNotificationTitle: string;
  newBookingNotificationBody: string;
}
