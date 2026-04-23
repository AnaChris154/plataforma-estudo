'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { signUp } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'aluno' | 'professor'>('aluno');
  const [schoolCode, setSchoolCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    router.push(userType === 'professor' ? '/professor/dashboard' : '/aluno/dashboard');
    return null;
  }

  // Validações
  const validateForm = (): string | null => {
    if (!fullName.trim()) {
      return 'Nome completo é obrigatório';
    }

    if (fullName.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      return 'Email é obrigatório';
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }

    if (!phone.trim()) {
      return 'Telefone é obrigatório';
    }

    // Validação básica de telefone (apenas números, pelo menos 10 dígitos)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Telefone inválido (mínimo 10 dígitos)';
    }

    if (!password) {
      return 'Senha é obrigatória';
    }

    if (password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      return 'Confirmação de senha é obrigatória';
    }

    if (password !== confirmPassword) {
      return 'As senhas não correspondem';
    }

    if (!schoolCode.trim()) {
      return 'Código da escola é obrigatório';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    // Fazer signup
    const { user, error: signupError } = await signUp(
      email,
      password,
      userType,
      schoolCode,
      fullName,
      phone
    );

    if (signupError) {
      setError(signupError.message || 'Erro ao criar conta');
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(true);
      // Redirecionar para login após sucesso
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center p-12 overflow-hidden bg-gradient-hero">
        <div aria-hidden className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="relative text-white text-center z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur mb-8 animate-float">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4">Comece sua jornada</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto">
            Crie sua conta e tenha acesso a um plano de estudos completamente personalizado.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {['Diagnóstico de nível', 'Trilhas personalizadas', 'Plano inteligente', 'Acompanhamento de progresso'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary shadow-glow mb-3 animate-float">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-black gradient-text-primary">NEXA</h1>
          </div>

          {/* Heading */}
          <div className="mb-6 animate-fade-up">
            <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Criar conta</h2>
            <p className="mt-1 text-[hsl(var(--muted-foreground))]">
              Já tem conta?{' '}
              <Link href="/login" className="font-semibold text-[hsl(var(--primary))] hover:underline">Entrar</Link>
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-2xl bg-[hsl(160_84%_95%)] border border-[hsl(160_84%_39%_/0.3)] animate-pop">
              <span className="text-xl shrink-0">✅</span>
              <div>
                <p className="font-semibold text-[hsl(160_84%_32%)]">Conta criada!</p>
                <p className="text-sm text-[hsl(160_84%_38%)]">Redirecionando para login...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)] animate-pop">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="font-semibold text-[hsl(var(--destructive))]">Erro</p>
                <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up delay-75">
            {/* Tipo de usuário */}
            <div>
              <label className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-2">
                Você é...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['aluno', 'professor'] as const).map((type) => (
                  <label
                    key={type}
                    className={[
                      'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                      userType === type
                        ? type === 'aluno'
                          ? 'border-[hsl(258_90%_60%)] bg-primary-soft'
                          : 'border-[hsl(199_95%_50%)] bg-accent-soft'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)_/0.4)]',
                    ].join(' ')}
                  >
                    <input type="radio" name="userType" value={type} checked={userType === type} onChange={(e) => setUserType(e.target.value as 'aluno' | 'professor')} className="hidden" disabled={loading} />
                    <span className="text-2xl">{type === 'aluno' ? '👨‍🎓' : '👨‍🏫'}</span>
                    <span className={['text-sm font-semibold capitalize', userType === type ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'].join(' ')}>
                      {type === 'aluno' ? 'Aluno' : 'Professor'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Input label="Nome Completo" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" required disabled={loading} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required disabled={loading} />
            <Input label="Telefone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" required disabled={loading} helperText="Mínimo 10 dígitos" />
            <Input label="Código da Escola" type="text" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value.toUpperCase())} placeholder="Ex: NEXA-001" required disabled={loading} helperText="Fornecido pela sua escola" />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 chars" required disabled={loading} />
              <Input label="Confirmar Senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita" required disabled={loading} />
            </div>

            <Button type="submit" fullWidth size="lg" variant="primary" disabled={loading} className="mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Criando conta...
                </span>
              ) : 'Criar conta →'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))] animate-fade-up delay-150">
            Ao criar uma conta, você concorda com os{' '}
            <span className="underline cursor-pointer hover:text-[hsl(var(--primary))] transition-colors">termos de serviço</span>
          </p>
        </div>
      </div>
    </main>
  );
}
