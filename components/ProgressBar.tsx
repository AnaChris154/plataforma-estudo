'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'accent';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const variantClasses = {
    primary: 'bg-[hsl(var(--primary))]',
    success: 'bg-[hsl(var(--success))]',
    warning: 'bg-[hsl(var(--warning))]',
    accent: 'bg-[hsl(var(--accent))]',
  }[variant];

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">
            Progresso
          </span>
          <span className="text-sm font-semibold text-[hsl(var(--primary))]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={[
          'w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden',
          sizeClasses,
        ].join(' ')}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={[
            'h-full rounded-full',
            variantClasses,
          ].join(' ')}
        />
      </div>
    </div>
  );
}
