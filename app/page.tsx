'use client'

import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Sparkles, Zap, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-5 py-12" style={{ background: 'var(--gradient-bg)' }}>
      {/* Blobs decorativos animados */}
      <div aria-hidden className="pointer-events-none absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30 animate-spin-slow" style={{ background: 'radial-gradient(circle, hsl(258 90% 70%), transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 animate-spin-slow" style={{ background: 'radial-gradient(circle, hsl(199 95% 60%), transparent 70%)', animationDirection: 'reverse' }} />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(258 90% 60%), transparent 60%)' }} />

      <div className="relative w-full max-w-lg z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(258_90%_60%_/0.3)] bg-white/80 backdrop-blur px-4 py-2 text-sm font-medium text-[hsl(var(--primary))] shadow-sm">
            <Sparkles className="h-4 w-4 animate-bounce-gentle" />
            Plataforma Educacional Inteligente
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up delay-75">
          {/* Logo animado */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-glow mb-6 animate-float">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 gradient-text-hero">
            NEXA
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] leading-relaxed max-w-sm mx-auto">
            Estude com inteligência. Aprenda mais rápido.<br />
            <span className="font-semibold text-[hsl(var(--foreground))]">Como você quer entrar?</span>
          </p>
        </div>

        {/* Cards de acesso */}
        <div className="space-y-4 animate-fade-up delay-150">
          <RoleCard
            href="/aluno/dashboard"
            icon={<BookOpen className="h-7 w-7" />}
            title="Sou Aluno"
            description="Continue sua trilha de estudos personalizada"
            tag="Sua jornada te espera"
            variant="primary"
          />
          <RoleCard
            href="/professor/dashboard"
            icon={<GraduationCap className="h-7 w-7" />}
            title="Sou Professor"
            description="Gerencie turmas e acompanhe seus alunos"
            tag="Painel de gestão"
            variant="accent"
          />
        </div>

        {/* Features mini */}
        <div className="mt-10 grid grid-cols-3 gap-3 animate-fade-up delay-200">
          {[
            { icon: '🎯', label: 'Diagnóstico' },
            { icon: '🗺️', label: 'Trilhas' },
            { icon: '📊', label: 'Plano AI' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/70 backdrop-blur border border-white/80 shadow-sm">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[hsl(var(--muted-foreground))] animate-fade-up delay-300">
          Ao continuar, você concorda com nossos{' '}
          <span className="underline cursor-pointer hover:text-[hsl(var(--primary))] transition-colors">termos de uso</span>
        </p>
      </div>
    </main>
  );
}

interface RoleCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  variant: 'primary' | 'accent';
}

function RoleCard({ href, icon, title, description, tag, variant }: RoleCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link href={href} className="group block">
      <div className={[
        'relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 ease-out-expo',
        'hover:-translate-y-1 active:scale-[0.98]',
        isPrimary
          ? 'border-[hsl(258_90%_60%_/0.25)] bg-white/90 hover:border-[hsl(258_90%_60%_/0.6)] hover:shadow-[0_12px_32px_-8px_hsl(258_90%_60%_/0.35)]'
          : 'border-[hsl(199_95%_50%_/0.25)] bg-white/90 hover:border-[hsl(199_95%_50%_/0.6)] hover:shadow-[0_12px_32px_-8px_hsl(199_95%_50%_/0.35)]',
        'shadow-card backdrop-blur-sm',
      ].join(' ')}>
        {/* Tag */}
        <div className={[
          'absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300 group-hover:scale-105',
          isPrimary ? 'bg-[hsl(258_100%_96%)] text-[hsl(258_90%_55%)]' : 'bg-[hsl(199_100%_95%)] text-[hsl(199_95%_35%)]',
        ].join(' ')}>
          {tag}
        </div>

        <div className="flex items-center gap-4 pr-20">
          {/* Icon */}
          <div className={[
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white',
            'shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6',
            isPrimary ? 'bg-gradient-primary shadow-[0_4px_16px_-2px_hsl(258_90%_60%_/0.5)]' : 'bg-gradient-accent shadow-[0_4px_16px_-2px_hsl(199_95%_50%_/0.5)]',
          ].join(' ')}>
            {icon}
          </div>

          {/* Text */}
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">{title}</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className={[
          'absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5',
          isPrimary ? 'bg-[hsl(258_100%_96%)] text-[hsl(258_90%_55%)]' : 'bg-[hsl(199_100%_95%)] text-[hsl(199_95%_35%)]',
        ].join(' ')}>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
