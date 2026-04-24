'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Badge } from './Badge';

interface CardMenuProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'primary' | 'success' | 'accent' | 'warning';
  badge?: string;
}

const variantStyles = {
  primary: {
    iconBg: 'bg-[hsl(var(--primary))]',
    badgeVariant: 'primary' as const,
  },
  success: {
    iconBg: 'bg-[hsl(var(--success))]',
    badgeVariant: 'success' as const,
  },
  accent: {
    iconBg: 'bg-[hsl(var(--accent))]',
    badgeVariant: 'primary' as const,
  },
  warning: {
    iconBg: 'bg-[hsl(var(--warning))]',
    badgeVariant: 'warning' as const,
  },
};

export function CardMenu({
  href,
  icon,
  title,
  description,
  variant = 'primary',
  badge,
}: CardMenuProps) {
  const styles = variantStyles[variant];

  return (
    <Link href={href} className="block group">
      <motion.div
        initial={{ y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl border border-[hsl(var(--border))] p-4 shadow-sm hover:shadow-md hover:border-[hsl(var(--primary)_/_0.3)] transition-all duration-200"
      >
        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant={styles.badgeVariant}>{badge}</Badge>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div
            className={[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white',
              'transition-transform duration-200 group-hover:scale-105',
              styles.iconBg,
            ].join(' ')}
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-[hsl(var(--foreground))] leading-tight">
              {title}
            </h3>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))] truncate">
              {description}
            </p>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-all duration-200 group-hover:bg-[hsl(var(--primary-soft))] group-hover:text-[hsl(var(--primary))] group-hover:translate-x-0.5">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
