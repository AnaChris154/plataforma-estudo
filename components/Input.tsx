import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {iconLeft && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
            {iconLeft}
          </div>
        )}

        <input
          id={inputId}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-[hsl(var(--foreground))]',
            'placeholder:text-[hsl(var(--muted-foreground))]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--primary))]',
            error
              ? 'border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive)_/0.3)]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)_/0.4)]',
            iconLeft ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            props.disabled ? 'opacity-60 cursor-not-allowed bg-[hsl(var(--muted))]' : '',
            className,
          ].join(' ')}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
            {iconRight}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-[hsl(var(--destructive))] flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{helperText}</p>
      )}
    </div>
  );
}

