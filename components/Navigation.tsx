'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  CheckSquare,
  Settings,
  Zap,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
} from 'lucide-react';
import { Avatar } from './Avatar';

const alunoLinks = [
  { href: '/aluno/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/aluno/plano', label: 'Plano', Icon: Zap },
  { href: '/aluno/trilhas', label: 'Trilhas', Icon: Map },
  { href: '/aluno/disciplinas', label: 'Disciplinas', Icon: BookOpen },
  { href: '/aluno/atividades', label: 'Atividades', Icon: CheckSquare },
  { href: '/aluno/configuracoes', label: 'Config.', Icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, profile } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const isAluno = pathname.startsWith('/aluno');

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    if (!error) router.push('/');
    setSigningOut(false);
  };

  const isActive = (path: string) => pathname === path;

  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <>
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-[hsl(var(--primary))]">
                NEXA
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Not Authenticated */}
              {!isAuthenticated && (
                <div className="hidden sm:flex items-center gap-1">
                  {!pathname.includes('/login') && (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Link>
                  )}
                  {!pathname.includes('/signup') && (
                    <Link
                      href="/signup"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))] hover:bg-[hsl(217_100%_93%)] transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Cadastrar
                    </Link>
                  )}
                </div>
              )}

              {/* Authenticated */}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--muted))]">
                    <Avatar name={userName} size="sm" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))] max-w-[120px] truncate">
                      {userName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive-soft))] transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {signingOut ? 'Saindo...' : 'Sair'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar (mobile) */}
      {isAluno && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-lg border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
            {alunoLinks.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-[60px]"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: active ? 1.1 : 1,
                      backgroundColor: active
                        ? 'hsl(var(--primary-soft))'
                        : 'transparent',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl"
                  >
                    <Icon
                      className={[
                        'w-5 h-5 transition-colors',
                        active
                          ? 'text-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))]',
                      ].join(' ')}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </motion.div>
                  <span
                    className={[
                      'text-[10px] font-medium transition-colors',
                      active
                        ? 'text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))]',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Sidebar (desktop) */}
      {isAluno && (
        <aside className="hidden sm:flex fixed left-0 top-14 bottom-0 z-40 w-56 flex-col border-r border-[hsl(var(--border))] bg-white pt-6 pb-4 px-3">
          <div className="flex-1 flex flex-col gap-1">
            {alunoLinks.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
                  ].join(' ')}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {label}
                  {active && (
                    <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User info at bottom */}
          <div className="mt-auto pt-4 border-t border-[hsl(var(--border))]">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name={userName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                  {userName}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Aluno
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
