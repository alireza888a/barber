import React from 'react';
import type { Translations } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  t: Translations;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, t }) => {
  const steps = [t.step1, t.step2, t.step3, t.step4, t.step5];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  isActive ? 'bg-amber-400 text-slate-900 scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span className={`mt-2 text-xs text-center ${isActive ? 'text-amber-500 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'}`}>{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;