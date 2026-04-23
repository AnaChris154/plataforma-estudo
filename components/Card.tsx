import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'gradient-primary' | 'gradient-accent' | 'gradient-success' | 'gradient-warm';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hoverable = false,
  variant = 'default',
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  const variantClass = {
    default: 'bg-white border border-[hsl(var(--border))] shadow-card',
    glass: 'glass shadow-card border border-white/60',
    'gradient-primary': 'bg-gradient-primary text-white border-0 shadow-[0_8px_32px_-4px_hsl(258_90%_60%_/0.4)]',
    'gradient-accent': 'bg-gradient-accent text-white border-0 shadow-[0_8px_32px_-4px_hsl(199_95%_50%_/0.4)]',
    'gradient-success': 'bg-gradient-success text-white border-0 shadow-[0_8px_32px_-4px_hsl(160_84%_39%_/0.4)]',
    'gradient-warm': 'bg-gradient-warm text-white border-0 shadow-[0_8px_32px_-4px_hsl(32_95%_55%_/0.4)]',
  }[variant];

  const hoverStyles = hoverable
    ? 'cursor-pointer transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.98]'
    : '';

  return (
    <div
      onClick={onClick}
      className={[
        'rounded-2xl',
        paddingClass,
        variantClass,
        hoverStyles,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

