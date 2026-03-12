import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Assuming we have or will create this tiny utility

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed h-[52px] rounded-2xl px-6";
  
  const variants = {
    primary: "bg-fitcore-green text-black hover:bg-fitcore-greenHover shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]",
    secondary: "bg-fitcore-navyLight text-white hover:bg-gray-700/80 border border-gray-700/50",
    outline: "bg-transparent text-fitcore-green border border-fitcore-green hover:bg-fitcore-green/10",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-fitcore-navyLight",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
