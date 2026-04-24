'use client';

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    icon,
    iconRight,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
    md: 'h-11 px-4 text-sm gap-2 rounded-xl',
    lg: 'h-12 px-6 text-base gap-2 rounded-xl',
  }[size];

  const variantClasses = {
    primary: [
      'bg-[hsl(var(--primary))] text-white',
      'hover:bg-[hsl(var(--primary-hover))]',
      'shadow-sm hover:shadow-md',
      'active:scale-[0.98]',
    ].join(' '),
    secondary: [
      'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]',
      'hover:bg-[hsl(217_100%_93%)]',
      'active:scale-[0.98]',
    ].join(' '),
    outline: [
      'border-2 border-[hsl(var(--border))] bg-transparent',
      'text-[hsl(var(--foreground))]',
      'hover:bg-[hsl(var(--muted))] hover:border-[hsl(var(--muted-foreground))]',
      'active:scale-[0.98]',
    ].join(' '),
    ghost: [
      'bg-transparent text-[hsl(var(--muted-foreground))]',
      'hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
      'active:scale-[0.98]',
    ].join(' '),
    danger: [
      'bg-[hsl(var(--destructive))] text-white',
      'hover:bg-[hsl(0_72%_45%)]',
      'shadow-sm hover:shadow-md',
      'active:scale-[0.98]',
    ].join(' '),
    success: [
      'bg-[hsl(var(--success))] text-white',
      'hover:bg-[hsl(152_69%_35%)]',
      'shadow-sm hover:shadow-md',
      'active:scale-[0.98]',
    ].join(' '),
  }[variant];

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        sizeClasses,
        variantClasses,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !isLoading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
});
