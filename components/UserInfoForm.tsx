import React, { useState } from 'react';
import type { UserInfo, Translations } from '../types';

interface UserInfoFormProps {
  userInfo: UserInfo;
  onUserInfoChange: (userInfo: UserInfo) => void;
  onNext: () => void;
  onBack: () => void;
  t: Translations;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, onUserInfoChange, onNext, onBack, t }) => {
  const [localUserInfo, setLocalUserInfo] = useState<UserInfo>(userInfo);
  const [errors, setErrors] = useState({ name: false, phone: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalUserInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalUserInfo(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
     onUserInfoChange(localUserInfo);
  }

  const validateAndProceed = () => {
    const nameError = localUserInfo.name.trim().length < 3;
    const phoneError = !/^(09)\d{9}$/.test(localUserInfo.phone.trim());
    
    setErrors({ name: nameError, phone: phoneError });

    if (!nameError && !phoneError) {
      onUserInfoChange(localUserInfo);
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white mb-6">{t.enterDetails}</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t.fullName}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={localUserInfo.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.fullNamePlaceholder as string}
            className={`w-full p-3 bg-slate-200 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white focus:ring-amber-400 focus:border-amber-400 transition ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
          />
          {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">نام باید حداقل ۳ حرف باشد.</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t.phoneNumber}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={localUserInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.phoneNumberPlaceholder as string}
            className={`w-full p-3 bg-slate-200 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white focus:ring-amber-400 focus:border-amber-400 transition ${errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
          />
          {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">شماره تماس معتبر نیست (مثال: 09123456789).</p>}
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{t.uploadPhoto}</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {localUserInfo.photo && (
              <img src={localUserInfo.photo} alt={t.photoPreview as string} className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={onBack} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-300">
          {t.back}
        </button>
        <button onClick={validateAndProceed} className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300">
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default UserInfoForm;
