'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import type { StudyPlan } from '@/services/studyPlanService';

function DisciplinasContent() {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDisciplinas = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);

        if (planError) {
          setError(planError.message);
          setDisciplinas([]);
        } else {
          setDisciplinas(studyPlan || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar disciplinas:', err);
        setError('Erro ao carregar disciplinas');
        setLoading(false);
      }
    };

    loadDisciplinas();
  }, [user]);

  const nivelEmoji = {
    baixo: '🔴',
    medio: '🟡',
    alto: '🟢',
  };

  const nivelLabel = {
    baixo: 'Nível Baixo',
    medio: 'Nível Médio',
    alto: 'Nível Alto',
  };

  const nivelColor = {
    alto: 'from-green-600 to-green-500',
    medio: 'from-yellow-600 to-yellow-500',
    baixo: 'from-red-600 to-red-500',
  };

  const countByLevel = {
    baixo: disciplinas.filter((d) => d.nivel === 'baixo').length,
    medio: disciplinas.filter((d) => d.nivel === 'medio').length,
    alto: disciplinas.filter((d) => d.nivel === 'alto').length,
  };

  return (
    <PageContainer>
      <Navigation />
      <Header title="Disciplinas" description="Acompanhe seu progresso em cada matéria" />
      <Container className="py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-5 animate-float"><span className="text-3xl">📚</span></div>
            <p className="font-bold text-[hsl(var(--foreground))]">Carregando disciplinas...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)]">
            <span className="text-3xl shrink-0">❌</span>
            <div>
              <h3 className="font-bold text-[hsl(var(--destructive))]">Erro ao carregar disciplinas</h3>
              <p className="text-sm mt-1 text-[hsl(var(--destructive))]">{error}</p>
              <Link href="/aluno/dashboard"><Button size="sm" variant="secondary" className="mt-3">← Dashboard</Button></Link>
            </div>
          </div>
        )}

        {!loading && disciplinas.length === 0 && !error && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-10 text-white text-center animate-fade-up">
            <div className="text-5xl mb-4 animate-float">📚</div>
            <h2 className="text-2xl font-black mb-2">Nenhuma Disciplina</h2>
            <p className="text-white/80 mb-6 text-sm">Complete o diagnóstico para visualizar suas disciplinas.</p>
            <Link href="/aluno/diagnostico"><Button size="lg" className="bg-white !text-[hsl(258_90%_55%)] hover:bg-white/90 mx-auto">Iniciar Diagnóstico →</Button></Link>
          </div>
        )}

        {!loading && disciplinas.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up">
              {[
                { count: countByLevel.baixo, color: 'bg-[hsl(0_84%_60%_/0.08)] border-[hsl(0_84%_60%_/0.3)]', textColor: 'text-[hsl(0_84%_50%)]', label: '🔴 Baixo' },
                { count: countByLevel.medio, color: 'bg-[hsl(32_95%_55%_/0.08)] border-[hsl(32_95%_55%_/0.3)]', textColor: 'text-[hsl(32_95%_45%)]', label: '🟡 Médio' },
                { count: countByLevel.alto, color: 'bg-[hsl(160_84%_39%_/0.08)] border-[hsl(160_84%_39%_/0.3)]', textColor: 'text-[hsl(160_84%_32%)]', label: '🟢 Alto' },
              ].map((s) => (
                <div key={s.label} className={['rounded-2xl border-2 p-4 text-center', s.color].join(' ')}>
                  <p className={['text-3xl font-black', s.textColor].join(' ')}>{s.count}</p>
                  <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Lista */}
            <div className="mb-3">
              <h3 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">Detalhes por Disciplina</h3>
            </div>

            <div className="space-y-3 mb-8 animate-fade-up delay-75">
              {disciplinas.map((disciplina, i) => {
                const pct = disciplina.nivel === 'alto' ? 85 : disciplina.nivel === 'medio' ? 50 : 25;
                const barColor = { alto: 'bg-[hsl(160_84%_39%)]', medio: 'bg-[hsl(32_95%_55%)]', baixo: 'bg-[hsl(0_84%_60%)]' }[disciplina.nivel];

                return (
                  <div key={disciplina.id} className="bg-white rounded-2xl border border-[hsl(var(--border))] p-5 shadow-sm hover:shadow-card transition-all duration-200 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-[hsl(var(--foreground))] capitalize">{disciplina.materia}</h4>
                      <span className="text-sm font-bold text-[hsl(var(--muted-foreground))]">{nivelLabel[disciplina.nivel]}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-2.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <div className={['h-full rounded-full transition-all duration-700', barColor].join(' ')} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[hsl(var(--foreground))] w-8 text-right">{pct}%</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                        📋 {disciplina.origem}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] capitalize">
                        🎯 {disciplina.prioridade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dica */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-soft border border-[hsl(var(--primary)_/0.2)] mb-6">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <h4 className="font-bold text-[hsl(var(--foreground))] mb-2">Dicas para melhorar</h4>
                <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                  <li>✅ Foque primeiro nas disciplinas de nível 🔴 baixo</li>
                  <li>✅ Use as trilhas de estudo para estruturar seu aprendizado</li>
                  <li>✅ Pratique regularmente com as atividades disponíveis</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 animate-fade-up delay-200">
              <Link href="/aluno/plano"><Button size="lg" variant="secondary" fullWidth>Meu Plano →</Button></Link>
              <Link href="/aluno/dashboard"><Button size="lg" variant="outline" fullWidth>← Dashboard</Button></Link>
            </div>
          </>
        )}
      </Container>
    </PageContainer>
  );
}

export default function DisciplinasPage() {
  return (
    <ProtectedRoute>
      <DisciplinasContent />
    </ProtectedRoute>
  );
}
