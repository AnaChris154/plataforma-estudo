'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="border-b border-[hsl(var(--border))] bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:pl-64 py-6 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm md:text-base text-[hsl(var(--muted-foreground))]">
                {description}
              </p>
            )}
          </motion.div>
          {action && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="shrink-0"
            >
              {action}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
