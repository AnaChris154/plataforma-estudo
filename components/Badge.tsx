'use client';

import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }[size];

  const variantClasses = {
    default: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
    primary: 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]',
    success: 'bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]',
    warning: 'bg-[hsl(var(--warning-soft))] text-[hsl(38_92%_35%)]',
    danger: 'bg-[hsl(var(--destructive-soft))] text-[hsl(var(--destructive))]',
    outline: 'bg-transparent border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]',
  }[variant];

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        sizeClasses,
        variantClasses,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
