'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { useState } from 'react';
import {
  LayoutDashboard, Map, BookOpen, CheckSquare, Settings, Zap,
  LogOut, LogIn, UserPlus, Home, GraduationCap, ChevronRight,
} from 'lucide-react';

const alunoLinks = [
  { href: '/aluno/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { href: '/aluno/plano',        label: 'Plano',         Icon: Zap },
  { href: '/aluno/trilhas',      label: 'Trilhas',       Icon: Map },
  { href: '/aluno/disciplinas',  label: 'Disciplinas',   Icon: BookOpen },
  { href: '/aluno/atividades',   label: 'Atividades',    Icon: CheckSquare },
  { href: '/aluno/configuracoes',label: 'Config.',       Icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, profile } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const isAluno = pathname.startsWith('/aluno');
  const isProfessor = pathname.startsWith('/professor');

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    if (!error) router.push('/');
    setSigningOut(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* ── Top Bar ── */}
      <nav className="glass sticky top-0 z-50 border-b border-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-[0_4px_12px_-2px_hsl(258_90%_60%_/0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight gradient-text-primary">
                NEXA
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Desktop nav for non-authenticated */}
              {!isAuthenticated && (
                <div className="hidden sm:flex items-center gap-1">
                  {!pathname.includes('/login') && (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-200"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Entrar
                    </Link>
                  )}
                  {!pathname.includes('/signup') && (
                    <Link
                      href="/signup"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-[hsl(var(--primary))] bg-primary-soft hover:bg-[hsl(258_100%_92%)] transition-all duration-200"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Cadastrar
                    </Link>
                  )}
                </div>
              )}

              {/* Authenticated user */}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[hsl(var(--muted))]">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {(profile?.display_name || user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-[hsl(var(--foreground))] max-w-[120px] truncate">
                      {profile?.display_name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-[hsl(var(--destructive))] hover:bg-[hsl(0_84%_60%_/0.08)] transition-all duration-200 disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{signingOut ? 'Saindo...' : 'Sair'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Bottom Tab Bar (mobile) — only for aluno ── */}
      {isAluno && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass border-t border-white/60">
          <div className="flex items-center justify-around px-2 py-2">
            {alunoLinks.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200',
                    active
                      ? 'text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted-foreground))]',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200',
                      active ? 'bg-primary-soft scale-110' : '',
                    ].join(' ')}
                  >
                    <Icon className={['w-4 h-4', active ? 'stroke-[2.5]' : ''].join(' ')} />
                  </div>
                  <span className={['text-[10px] font-medium', active ? 'font-bold' : ''].join(' ')}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── Side Tabs (desktop) — aluno ── */}
      {isAluno && (
        <div className="hidden sm:flex fixed left-0 top-14 bottom-0 z-40 w-56 flex-col border-r border-[hsl(var(--border))] bg-white/80 backdrop-blur-sm pt-6 pb-4 gap-1 px-3">
          {alunoLinks.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary-soft text-[hsl(var(--primary))] font-semibold shadow-sm'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
                ].join(' ')}
              >
                <Icon className={['w-4 h-4 shrink-0', active ? 'stroke-[2.5]' : ''].join(' ')} />
                {label}
                {active && <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-50" />}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
