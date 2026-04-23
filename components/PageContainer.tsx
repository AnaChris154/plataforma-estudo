import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-bg pb-20 sm:pb-0 ${className}`}
    >
      {children}
    </div>
  );
}
