'use client';

import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }[size];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <div
        className={[
          'rounded-full overflow-hidden bg-[hsl(var(--muted))] flex-shrink-0',
          sizeClasses,
          className,
        ].join(' ')}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (name) {
    return (
      <div
        className={[
          'rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-semibold flex-shrink-0',
          sizeClasses,
          className,
        ].join(' ')}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={[
        'rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] flex items-center justify-center flex-shrink-0',
        sizeClasses,
        className,
      ].join(' ')}
    >
      <User className={iconSizes} />
    </div>
  );
}
