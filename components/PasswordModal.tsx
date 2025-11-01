import React, { useState, useEffect } from 'react';
import type { Translations } from '../types';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => boolean; // Returns true on success, false on failure
  t: Translations;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, t }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setPassword('');
      setError(false);
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onSubmit(password);
    if (!success) {
      setError(true);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-4">{t.passwordModalTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className={`w-full p-3 bg-slate-200 dark:bg-slate-700 border rounded-lg text-slate-900 dark:text-white focus:ring-amber-400 focus:border-amber-400 transition text-center ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            />
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{t.passwordError}</p>}
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 transition-colors duration-300">
                {t.cancel}
            </button>
            <button type="submit" className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors duration-300">
                {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
