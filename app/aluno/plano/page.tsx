'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudyPlan } from '@/services/studyPlanService';
import type { StudentGoal } from '@/services/studentGoalsService';

function PlanoContent() {
  const { user } = useAuth();
  const [plano, setPlano] = useState<StudyPlan[]>([]);
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlano = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Carregar goal para verificar se tem diagnóstico
        const { goal: studentGoal } = await getStudentGoal(user.id);
        setGoal(studentGoal || null);

        // Se não tem diagnóstico completo, não mostrar plano
        if (!studentGoal || studentGoal.diagnostico_status !== 'completed') {
          setPlano([]);
          setLoading(false);
          return;
        }

        // Carregar plano de estudo
        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);

        if (planError) {
          setError(planError.message);
          setPlano([]);
        } else {
          setPlano(studyPlan || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar plano:', err);
        setError('Erro ao carregar plano de estudos');
        setLoading(false);
      }
    };

    loadPlano();
  }, [user]);

  const nivelEmoji = {
    baixo: '🔴',
    medio: '🟡',
    alto: '🟢',
  };

  const prioridadeLabel = {
    alta: 'Alta Prioridade',
    media: 'Média Prioridade',
    baixa: 'Baixa Prioridade',
  };

  const prioridadeColor = {
    alta: 'from-red-50 to-red-100 border-red-300',
    media: 'from-yellow-50 to-yellow-100 border-yellow-300',
    baixa: 'from-green-50 to-green-100 border-green-300',
  };

  const nivelColor = {
    alto: 'from-green-600 to-green-500',
    medio: 'from-yellow-600 to-yellow-500',
    baixo: 'from-red-600 to-red-500',
  };

  return (
    <PageContainer>
      <Navigation />
      <Header title="Plano de Estudos" description="Seu mapa personalizado de aprendizado" />
      <Container className="py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-5 animate-float">
              <span className="text-3xl">📊</span>
            </div>
            <p className="font-bold text-[hsl(var(--foreground))]">Carregando seu plano...</p>
            <div className="mt-4 flex gap-1.5">
              {[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-gradient-primary animate-bounce-gentle" style={{ animationDelay: `${i * 150}ms` }} />)}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)]">
            <span className="text-3xl shrink-0">❌</span>
            <div>
              <h3 className="font-bold text-[hsl(var(--destructive))]">Erro ao carregar plano</h3>
              <p className="text-sm text-[hsl(var(--destructive))] mt-1">{error}</p>
              <Link href="/aluno/dashboard"><Button size="sm" variant="secondary" className="mt-3">← Dashboard</Button></Link>
            </div>
          </div>
        )}

        {/* Sem objetivo */}
        {!loading && !goal?.id && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-accent p-10 text-white text-center shadow-[0_8px_32px_-4px_hsl(199_95%_50%_/0.4)] animate-fade-up">
            <div className="text-5xl mb-4 animate-float">📋</div>
            <h2 className="text-2xl font-black mb-2">Plano Não Disponível</h2>
            <p className="text-white/80 mb-6 text-sm max-w-sm mx-auto">Você precisa completar o diagnóstico para gerar seu plano personalizado.</p>
            <Link href="/aluno/diagnostico"><Button size="lg" className="bg-white !text-[hsl(199_95%_35%)] hover:bg-white/90 mx-auto">Iniciar Diagnóstico →</Button></Link>
          </div>
        )}

        {/* Com plano */}
        {!loading && goal?.diagnostico_status === 'completed' && plano.length > 0 && (
          <>
            {/* Banner objetivo */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 text-white mb-8 shadow-[0_8px_32px_-4px_hsl(258_90%_60%_/0.4)] animate-fade-up">
              <div aria-hidden className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 translate-x-10 -translate-y-10" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-2xl animate-float">🎯</div>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Seu Objetivo</p>
                  <h2 className="text-xl font-black">{goal.objetivo === 'faculdade' ? '🎓 Faculdade' : goal.objetivo === 'mercado' ? '💼 Mercado' : '📚 Escola'}</h2>
                  {goal.forma_ingresso && <p className="text-white/80 text-sm mt-0.5">via <strong>{goal.forma_ingresso.toUpperCase()}</strong></p>}
                </div>
              </div>
            </div>

            {/* Lista disciplinas */}
            <div className="mb-3">
              <h3 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">Disciplinas por Prioridade</h3>
            </div>

            <div className="space-y-3 mb-8 animate-fade-up delay-75">
              {plano.map((materia, i) => {
                const nivelPct = materia.nivel === 'alto' ? 85 : materia.nivel === 'medio' ? 50 : 25;
                const prioColors: Record<string, string> = { alta: 'border-[hsl(0_84%_60%_/0.3)] bg-[hsl(0_84%_60%_/0.04)]', media: 'border-[hsl(32_95%_55%_/0.3)] bg-[hsl(32_95%_55%_/0.04)]', baixa: 'border-[hsl(160_84%_39%_/0.3)] bg-[hsl(160_84%_39%_/0.04)]' };
                const nivelDot: Record<string, string> = { baixo: 'bg-[hsl(0_84%_60%)]', medio: 'bg-[hsl(32_95%_55%)]', alto: 'bg-[hsl(160_84%_39%)]' };
                const prioLabel: Record<string, string> = { alta: '🔴 Alta Prioridade', media: '🟡 Média Prioridade', baixa: '🟢 Baixa Prioridade' };

                return (
                  <div key={materia.id} className={['rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-sm animate-fade-up', prioColors[materia.prioridade]].join(' ')} style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-[hsl(var(--foreground))] capitalize text-base">{materia.materia}</h4>
                          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">{prioLabel[materia.prioridade]}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                            <div className={['h-full rounded-full transition-all duration-700', nivelDot[materia.nivel]].join(' ')} style={{ width: `${nivelPct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[hsl(var(--foreground))] w-8 text-right">{nivelPct}%</span>
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">Nível detectado: <strong className="capitalize">{materia.nivel}</strong></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dica */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-soft border border-[hsl(var(--primary)_/0.2)] mb-8">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <h4 className="font-bold text-[hsl(var(--foreground))] mb-1">Como usar seu plano</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Comece pelos tópicos com <strong>alta prioridade</strong>. Combine com as trilhas de estudo para uma jornada estruturada!</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 animate-fade-up delay-200">
              <Link href="/aluno/trilhas"><Button size="lg" variant="secondary" fullWidth>Explorar Trilhas →</Button></Link>
              <Link href="/aluno/dashboard"><Button size="lg" variant="outline" fullWidth>← Dashboard</Button></Link>
            </div>
          </>
        )}

        {!loading && goal?.diagnostico_status === 'completed' && plano.length === 0 && (
          <div className="text-center py-16 animate-fade-up">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-lg mb-2">Plano Vazio</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 text-sm">Nenhum plano disponível no momento.</p>
            <Link href="/aluno/dashboard"><Button variant="outline">← Dashboard</Button></Link>
          </div>
        )}
      </Container>
    </PageContainer>
  );
}

export default function PlanoPage() {
  return (
    <ProtectedRoute>
      <PlanoContent />
    </ProtectedRoute>
  );
}
