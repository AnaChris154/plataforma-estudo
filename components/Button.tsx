import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  size = 'md',
  icon,
  iconRight,
}: ButtonProps) {
  const sizeClass = {
    sm:  'px-4 py-2 text-sm rounded-xl min-h-[36px] gap-1.5',
    md:  'px-5 py-2.5 text-sm rounded-xl min-h-[42px] gap-2',
    lg:  'px-7 py-3.5 text-base rounded-2xl min-h-[52px] gap-2',
    xl:  'px-9 py-4 text-lg rounded-2xl min-h-[60px] gap-3',
  }[size];

  const variantClass = {
    primary: [
      'text-white font-semibold',
      'bg-gradient-primary',
      'shadow-[0_4px_16px_-2px_hsl(258_90%_60%_/_0.45)]',
      'hover:shadow-[0_8px_24px_-4px_hsl(258_90%_60%_/_0.55)]',
      'hover:brightness-110',
      'active:brightness-95 active:scale-[0.97]',
    ].join(' '),
    secondary: [
      'bg-primary-soft text-primary font-semibold',
      'hover:bg-[hsl(258_100%_92%)]',
      'active:scale-[0.97]',
    ].join(' '),
    outline: [
      'bg-transparent font-semibold',
      'border-2 border-[hsl(var(--primary))]',
      'text-[hsl(var(--primary))]',
      'hover:bg-primary-soft',
      'active:scale-[0.97]',
    ].join(' '),
    ghost: [
      'bg-transparent font-medium',
      'text-[hsl(var(--muted-foreground))]',
      'hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
      'active:scale-[0.97]',
    ].join(' '),
    danger: [
      'font-semibold text-white',
      'bg-[hsl(var(--destructive))]',
      'shadow-[0_4px_16px_-2px_hsl(0_84%_60%_/_0.35)]',
      'hover:shadow-[0_8px_24px_-4px_hsl(0_84%_60%_/_0.45)] hover:brightness-110',
      'active:scale-[0.97]',
    ].join(' '),
    success: [
      'font-semibold text-white',
      'bg-gradient-success',
      'shadow-[0_4px_16px_-2px_hsl(160_84%_39%_/_0.4)]',
      'hover:brightness-110',
      'active:scale-[0.97]',
    ].join(' '),
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 ease-spring',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:-translate-y-0.5',
        sizeClass,
        variantClass,
        className,
      ].join(' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

