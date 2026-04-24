'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { signIn } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ✅ Usar useEffect para redirecionar (não durante render)
  useEffect(() => {
    if (isAuthenticated && profile) {
      const redirectUrl =
        profile.tipo === 'professor' ? '/professor/dashboard' : '/aluno/dashboard';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message || 'Erro ao fazer login');
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(true);
      // ✅ AuthContext vai carregar o perfil automaticamente via onAuthStateChange
      // Redirect será feito pelo useEffect acima
    }
  };

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      {/* Left panel — decorativo, apenas desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-gradient-hero">
        {/* Decoração */}
        <div aria-hidden className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div aria-hidden className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

        <div className="relative text-white text-center z-10 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur mb-8 animate-float">
            <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4">Bem-vindo de volta!</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Continue sua jornada de aprendizado. Seu progresso está esperando.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: '🎯', label: 'Diagnóstico', sub: 'Personalizado' },
              { icon: '🗺️', label: 'Trilhas', sub: 'Guiadas' },
              { icon: '📊', label: 'Análise', sub: 'Em tempo real' },
            ].map((f) => (
              <div key={f.label} className="p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20">
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-sm font-bold">{f.label}</div>
                <div className="text-xs text-white/70">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-primary shadow-glow mb-4 animate-float">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-3xl font-black gradient-text-primary">NEXA</h1>
          </div>

          {/* Heading */}
          <div className="mb-8 animate-fade-up">
            <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Entrar na conta</h2>
            <p className="mt-1 text-[hsl(var(--muted-foreground))]">
              Não tem conta?{' '}
              <Link href="/signup" className="font-semibold text-[hsl(var(--primary))] hover:underline">
                Criar agora
              </Link>
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-[hsl(160_84%_95%)] border border-[hsl(160_84%_39%_/0.3)] animate-pop">
              <span className="text-xl shrink-0">✅</span>
              <div>
                <p className="font-semibold text-[hsl(160_84%_32%)]">Login realizado!</p>
                <p className="text-sm text-[hsl(160_84%_38%)]">Redirecionando você agora...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)] animate-pop">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="font-semibold text-[hsl(var(--destructive))]">Erro ao fazer login</p>
                <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up delay-75">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              variant="primary"
              disabled={loading}
              className="mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar →'
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center animate-fade-up delay-150">
            <Link href="/" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors font-medium">
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

