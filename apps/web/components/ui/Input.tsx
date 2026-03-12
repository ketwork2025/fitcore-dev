import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-gray-500 dark:text-gray-300 ml-1">{label}</label>}
        <input
          ref={ref}
          className={`h-[52px] w-full rounded-2xl bg-white dark:bg-[#0F0F1A] border border-gray-200 dark:border-gray-700/80 px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-fitcore-green focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className || ''}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
