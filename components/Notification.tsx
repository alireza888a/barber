import React, { useEffect, useState } from 'react';

interface NotificationProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ title, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const language = document.documentElement.lang as 'fa' | 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };
  
  const animationClass = isExiting
    ? (language === 'fa' ? 'animate-toast-out-rtl' : 'animate-toast-out-ltr')
    : (language === 'fa' ? 'animate-toast-in-rtl' : 'animate-toast-in-ltr');
    
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: language === 'fa' ? '20px' : 'auto',
        left: language === 'en' ? '20px' : 'auto',
        zIndex: 1000,
      }}
      className="w-full max-w-sm"
    >
       <style>
        {`
          @keyframes toast-in-ltr {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toast-out-ltr {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100%); opacity: 0; }
          }
          @keyframes toast-in-rtl {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toast-out-rtl {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .animate-toast-in-ltr { animation: toast-in-ltr 0.3s ease-out forwards; }
          .animate-toast-out-ltr { animation: toast-out-ltr 0.3s ease-in forwards; }
          .animate-toast-in-rtl { animation: toast-in-rtl 0.3s ease-out forwards; }
          .animate-toast-out-rtl { animation: toast-out-rtl 0.3s ease-in forwards; }
        `}
      </style>
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 p-4 ${animationClass}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
             <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={language === 'fa' ? "mr-3 w-0 flex-1" : "ml-3 w-0 flex-1"}>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
          </div>
          <div className={`flex-shrink-0 ${language === 'fa' ? 'mr-4' : 'ml-4'} flex`}>
            <button onClick={handleClose} className="inline-flex rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
