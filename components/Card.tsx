'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className = '',
    ...props
  },
  ref
) {
  const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
    default: 'bg-white border border-[hsl(var(--border))] shadow-sm',
    elevated: 'bg-white border border-[hsl(var(--border))] shadow-md',
    outline: 'bg-transparent border-2 border-[hsl(var(--border))]',
  };

  const paddingClass = paddingClasses[padding];
  const variantClass = variantClasses[variant];

  return (
    <motion.div
      ref={ref}
      initial={hoverable ? { y: 0 } : undefined}
      whileHover={hoverable ? { y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12)' } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={[
        'rounded-2xl',
        paddingClass,
        variantClass,
        hoverable ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.div>
  );
});
