'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { createStudentGoal, getStudentGoal, updateStudentGoal } from '@/services/studentGoalsService';

type Objetivo = 'faculdade' | 'mercado' | 'escola';
type FormaIngresso =
  | 'enem'
  | 'prouni'
  | 'vestibular'
  | 'certificados'
  | 'cursos_profissionalizantes';

function OnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [formaIngresso, setFormaIngresso] = useState<FormaIngresso | null>(null);
  const [cursoDesejado, setCursoDesejado] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [tempoMeta, setTempoMeta] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se aluno já tem objetivo (para evitar duplicatas)
  useEffect(() => {
    const verificarObjetivo = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { goal, error: goalError } = await getStudentGoal(user.id);

      if (goal) {
        // Aluno já tem objetivo, redirecionar para diagnóstico
        router.push('/aluno/diagnostico');
      }

      setLoading(false);
    };

    verificarObjetivo();
  }, [user, router]);

  const handleObjetivoSelect = (selected: Objetivo) => {
    setObjetivo(selected);
    setError(null);

    // Se escola, skip para salvar
    if (selected === 'escola') {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleFormaIngressoSelect = (forma: FormaIngresso) => {
    setFormaIngresso(forma);
    setError(null);
    setCurrentStep(3);
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setError(null);

      if (currentStep === 3 && objetivo === 'escola') {
        setCurrentStep(1);
        setObjetivo(null);
      } else if (currentStep === 3 && objetivo !== 'escola') {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(1);
        setObjetivo(null);
        setFormaIngresso(null);
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id || !objetivo) {
      setError('Dados incompletos');
      return;
    }

    // Validações
    if (objetivo === 'faculdade' || objetivo === 'mercado') {
      if (!formaIngresso) {
        setError('Selecione uma opção de caminho');
        return;
      }
    }

    setSaving(true);
    setError(null);

    const { goal, error: goalError } = await createStudentGoal(
      user.id,
      objetivo,
      cursoDesejado || undefined,
      universidade || undefined,
      formaIngresso || undefined,
      tempoMeta ? parseInt(tempoMeta) : undefined
    );

    if (goalError) {
      setError(`Erro ao salvar: ${goalError.message}`);
      setSaving(false);
      return;
    }

    // Sucesso! Redirecionar para diagnóstico
    setSaving(false);
    router.push('/aluno/diagnostico');
  };

  if (loading) {
    return (
      <PageContainer>
        <Navigation />
        <div className="sm:pl-56 flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-5 animate-float">
              <span className="text-3xl">🎓</span>
            </div>
            <p className="font-bold text-[hsl(var(--foreground))]">Carregando...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation />
      <Header title="Bem-vindo ao NEXA! 🎓" description="Vamos conhecer seus objetivos e preparar seu plano de estudos personalizado" />

      <Container className="py-8 max-w-2xl">
        {/* Stepper */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">Passo {currentStep} de 3</span>
            <span className="text-sm font-bold text-[hsl(var(--primary))]">{currentStep === 1 ? '33' : currentStep === 2 ? '66' : '99'}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '99%' }} />
          </div>
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Qual é seu objetivo?</h3>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">Escolha o propósito principal dos seus estudos</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'faculdade', icon: '🎓', label: 'Entrar na Faculdade', desc: 'Preparação para o ensino superior' },
                { value: 'mercado', icon: '💼', label: 'Entrar no Mercado', desc: 'Preparação para carreira profissional' },
                { value: 'escola', icon: '📚', label: 'Melhorar na Escola', desc: 'Melhorar desempenho e notas' },
              ].map((op) => (
                <button
                  key={op.value}
                  onClick={() => handleObjetivoSelect(op.value as Objetivo)}
                  className={[
                    'w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left',
                    'flex items-center justify-between gap-4',
                    'hover:shadow-sm',
                    objetivo === op.value
                      ? 'border-[hsl(var(--primary))] bg-primary-soft shadow-[0_2px_12px_-2px_hsl(258_90%_60%_/0.2)]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)_/0.4)] bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{op.icon}</span>
                    <div>
                      <h4 className="font-bold text-[hsl(var(--foreground))]">{op.label}</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{op.desc}</p>
                    </div>
                  </div>
                  <div className={['w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all', objetivo === op.value ? 'border-[hsl(var(--primary))] bg-gradient-primary' : 'border-[hsl(var(--border))]'].join(' ')}>
                    {objetivo === op.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            {error && <div className="mt-4 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.2)] text-sm text-[hsl(var(--destructive))]">⚠️ {error}</div>}
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && objetivo && objetivo !== 'escola' && (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
                {objetivo === 'faculdade' ? 'Como pretende ingressar na faculdade?' : 'Como pretende se inserir no mercado?'}
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">Isso vai guiar seu plano de estudos</p>
            </div>

            <div className="space-y-3">
              {(objetivo === 'faculdade'
                ? [
                    { value: 'enem',        icon: '📝', label: 'ENEM',                      desc: 'Exame Nacional do Ensino Médio' },
                    { value: 'prouni',      icon: '🏛', label: 'ProUni',                    desc: 'Programa Universidade para Todos' },
                    { value: 'vestibular',  icon: '🎯', label: 'Vestibular',                desc: 'Prova de entrada de universidades' },
                  ]
                : [
                    { value: 'certificados',               icon: '🏆', label: 'Certificados',              desc: 'Obter certificações profissionais' },
                    { value: 'cursos_profissionalizantes', icon: '🔧', label: 'Cursos Profissionalizantes', desc: 'Formação técnica e profissional' },
                  ]
              ).map((op) => (
                <button
                  key={op.value}
                  onClick={() => handleFormaIngressoSelect(op.value as FormaIngresso)}
                  className={['w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-sm', formaIngresso === op.value ? 'border-[hsl(var(--primary))] bg-primary-soft' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)_/0.4)] bg-white'].join(' ')}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{op.icon}</span>
                    <div>
                      <h4 className="font-bold text-[hsl(var(--foreground))]">{op.label}</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{op.desc}</p>
                    </div>
                  </div>
                  <div className={['w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center', formaIngresso === op.value ? 'border-[hsl(var(--primary))] bg-gradient-primary' : 'border-[hsl(var(--border))]'].join(' ')}>
                    {formaIngresso === op.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            {error && <div className="mt-4 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.2)] text-sm text-[hsl(var(--destructive))]">⚠️ {error}</div>}

            <div className="flex justify-start mt-6">
              <Button onClick={handleGoBack} variant="ghost">← Voltar</Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Detalhes adicionais</h3>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">Personalize ainda mais seu plano de estudos</p>
            </div>

            <div className="space-y-4">
              <Input label="Curso ou Área de Interesse" type="text" value={cursoDesejado} onChange={(e) => setCursoDesejado(e.target.value)} placeholder="Ex: Engenharia de Software, Direito..." />
              {objetivo === 'faculdade' && (
                <Input label="Universidade (opcional)" type="text" value={universidade} onChange={(e) => setUniversidade(e.target.value)} placeholder="Ex: USP, UNICAMP, UFRJ..." />
              )}
              <Input label="Tempo para seu objetivo (meses)" type="number" value={tempoMeta} onChange={(e) => setTempoMeta(e.target.value)} placeholder="Ex: 6, 12, 24..." helperText="Tempo estimado até atingir seu objetivo" />
            </div>

            {error && <div className="mt-4 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.2)] text-sm text-[hsl(var(--destructive))]">⚠️ {error}</div>}

            <div className="flex items-center justify-between mt-6 gap-3">
              <Button onClick={handleGoBack} variant="ghost">← Voltar</Button>
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Salvando...</span>
                  : 'Continuar para Diagnóstico →'}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </PageContainer>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
