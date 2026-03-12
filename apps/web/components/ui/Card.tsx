import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={`px-6 py-5 border-b border-[var(--card-border)] ${className || ''}`}>{children}</div>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={`p-6 ${className || ''}`}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={`text-xl font-bold text-[var(--foreground)] ${className || ''}`}>{children}</h3>;
}
