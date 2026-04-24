import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface CardMenuProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'accent' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'teal' | 'orange';
  badge?: string;
}

const colorMap: Record<string, { bg: string; light: string; text: string; border: string }> = {
  primary:  { bg: 'bg-gradient-primary', light: 'bg-[hsl(258_100%_96%)]', text: 'text-[hsl(258_90%_60%)]', border: 'hover:border-[hsl(258_90%_60%_/0.4)]' },
  purple:   { bg: 'bg-gradient-primary', light: 'bg-[hsl(258_100%_96%)]', text: 'text-[hsl(258_90%_60%)]', border: 'hover:border-[hsl(258_90%_60%_/0.4)]' },
  indigo:   { bg: 'bg-gradient-primary', light: 'bg-[hsl(258_100%_96%)]', text: 'text-[hsl(258_90%_60%)]', border: 'hover:border-[hsl(258_90%_60%_/0.4)]' },
  blue:     { bg: 'bg-gradient-accent',  light: 'bg-[hsl(199_100%_95%)]', text: 'text-[hsl(199_95%_40%)]', border: 'hover:border-[hsl(199_95%_50%_/0.4)]' },
  accent:   { bg: 'bg-gradient-accent',  light: 'bg-[hsl(199_100%_95%)]', text: 'text-[hsl(199_95%_40%)]', border: 'hover:border-[hsl(199_95%_50%_/0.4)]' },
  teal:     { bg: 'bg-gradient-accent',  light: 'bg-[hsl(199_100%_95%)]', text: 'text-[hsl(199_95%_40%)]', border: 'hover:border-[hsl(199_95%_50%_/0.4)]' },
  green:    { bg: 'bg-gradient-success', light: 'bg-[hsl(160_84%_95%)]',  text: 'text-[hsl(160_84%_32%)]', border: 'hover:border-[hsl(160_84%_39%_/0.4)]' },
  yellow:   { bg: 'bg-gradient-warm',    light: 'bg-[hsl(32_100%_95%)]',  text: 'text-[hsl(32_95%_40%)]',  border: 'hover:border-[hsl(32_95%_55%_/0.4)]' },
  orange:   { bg: 'bg-gradient-warm',    light: 'bg-[hsl(32_100%_95%)]',  text: 'text-[hsl(32_95%_40%)]',  border: 'hover:border-[hsl(32_95%_55%_/0.4)]' },
  pink:     { bg: 'bg-[linear-gradient(135deg,hsl(320_80%_60%),hsl(350_80%_65%))]', light: 'bg-[hsl(320_80%_96%)]', text: 'text-[hsl(320_80%_50%)]', border: 'hover:border-[hsl(320_80%_60%_/0.4)]' },
};

export function CardMenu({ href, icon, title, description, color = 'primary', badge }: CardMenuProps) {
  const c = colorMap[color] ?? colorMap.primary;

  return (
    <Link href={href} className="group block">
      <div
        className={[
          'relative rounded-2xl bg-white border border-[hsl(var(--border))] p-5',
          'shadow-card transition-all duration-300 ease-out-expo',
          'hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.98]',
          c.border,
        ].join(' ')}
      >
        {badge && (
          <span className={[
            'absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
            c.light, c.text,
          ].join(' ')}>
            {badge}
          </span>
        )}

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className={[
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white text-2xl',
              'shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
              c.bg,
            ].join(' ')}
          >
            {icon}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-[hsl(var(--foreground))] leading-tight">
              {title}
            </h3>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))] truncate leading-snug">
              {description}
            </p>
          </div>

          {/* Arrow */}
          <div
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              'transition-all duration-300 group-hover:translate-x-1',
              c.light, c.text,
            ].join(' ')}
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}



