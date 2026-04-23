interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="border-b border-[hsl(var(--border))] bg-white/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sm:pl-64 py-6 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] leading-tight animate-fade-up">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm md:text-base text-[hsl(var(--muted-foreground))] animate-fade-up delay-75">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="shrink-0 animate-fade-up delay-100">{action}</div>
          )}
        </div>
      </div>
    </div>
  );
}
