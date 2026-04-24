'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { CardMenu } from '@/components/CardMenu';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';

function AlunoDashboardContent() {
  const router = useRouter();
  const { user, profile, school } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [checkingProgress, setCheckingProgress] = useState(true);

  // Verificar se o aluno completed onboarding
  useEffect(() => {
    const verificarProgresso = async () => {
      try {
        if (!user?.id) {
          console.log('ℹ️ Sem user.id, retornando');
          setCheckingProgress(false);
          return;
        }

        console.log('🔍 Buscando goal para user:', user.id);

        // Verificar se tem student_goal (onboarding)
        const { goal: studentGoal, error: goalError } = await getStudentGoal(user.id);

        if (goalError) {
          console.warn('⚠️ Erro ao buscar goal:', goalError.message);
          // Mesmo com erro, continuar com estado inicial (sem goal)
          setGoal(null);
          setCheckingProgress(false);
          return;
        }

        if (!studentGoal) {
          // Usuário não fez onboarding ainda
          console.log('ℹ️ Usuário sem goal, primeira vez ou ainda em setup');
          setGoal(null);
          setCheckingProgress(false);
          return;
        }

        console.log('✅ Goal encontrado:', studentGoal);
        setGoal(studentGoal);
        setCheckingProgress(false);
      } catch (err) {
        console.error('❌ Erro crítico ao verificar progresso:', err);
        setGoal(null);
        setCheckingProgress(false);
      }
    };

    verificarProgresso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const userName = profile?.display_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Aluno';

  // Enquanto verifica o progresso, mostrar loading
  if (checkingProgress) {
    return (
      <PageContainer>
        <Navigation />
        <div className="sm:pl-56 flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-glow mb-6 animate-float">
              <span className="text-4xl">⚡</span>
            </div>
            <p className="text-[hsl(var(--foreground))] font-bold text-lg">Preparando seu espaço...</p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">Isso leva apenas alguns segundos</p>
            <div className="mt-6 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gradient-primary animate-bounce-gentle" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation />
      <Header
        title={`Olá, ${userName}! 👋`}
        description={`Bem-vindo ao NEXA • ${school?.nome || 'Escola não vinculada'}`}
      />

      <Container className="py-8">
        {/* Banner de objetivo */}
        {goal && (
          <div className="mb-8 animate-fade-up">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 text-white shadow-[0_8px_32px_-4px_hsl(258_90%_60%_/0.4)]">
              <div aria-hidden className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 translate-x-10 -translate-y-10" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
              <div className="relative flex items-center gap-5">
                <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-3xl animate-float">
                  🎯
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium mb-0.5">Seu Objetivo</p>
                  <h2 className="text-2xl font-black">
                    {goal.objetivo === 'faculdade' ? '🎓 Faculdade' : goal.objetivo === 'mercado' ? '💼 Mercado' : '📚 Escola'}
                  </h2>
                  {goal.forma_ingresso && (
                    <p className="text-white/80 text-sm mt-1">via <strong>{goal.forma_ingresso.toUpperCase()}</strong></p>
                  )}
                </div>
                <div className="ml-auto hidden sm:block">
                  <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm font-semibold">
                    {goal.diagnostico_status === 'completed' ? '✅ Diagnóstico feito' : goal.diagnostico_status === 'skipped' ? '⏭️ Pulado' : '⏳ Pendente'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de navegação */}
        <div className="mb-3">
          <h3 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">Navegação Rápida</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 animate-fade-up delay-75">
          <CardMenu href="/aluno/plano"         icon={<span>📊</span>} title="Plano de Estudos"    description="Seu plano personalizado pelo diagnóstico"  color="primary"   badge="Novo" />
          <CardMenu href="/aluno/trilhas"        icon={<span>🗺️</span>} title="Trilhas de Estudo"  description="Caminhos estruturados de aprendizado"       color="accent" />
          <CardMenu href="/aluno/disciplinas"    icon={<span>📚</span>} title="Disciplinas"         description="Acompanhe seu progresso em cada matéria"    color="green" />
          <CardMenu href="/aluno/atividades"     icon={<span>✅</span>} title="Atividades"          description="Tarefas e exercícios para praticar"         color="yellow" />
          <CardMenu href="/aluno/configuracoes"  icon={<span>⚙️</span>} title="Configurações"       description="Gerencie sua conta e preferências"          color="pink" />
          <CardMenu href="/aluno/onboarding"    icon={<span>🔄</span>} title="Retomar Diagnóstico" description="Refaça ou complete seu diagnóstico"         color="indigo" />
        </div>

        {/* CTA: Diagnóstico não iniciado */}
        {(!goal || goal.diagnostico_status === 'not_started') && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white text-center shadow-[0_8px_32px_-4px_hsl(258_90%_60%_/0.5)] animate-fade-up delay-150 animate-pulse-glow">
            <div aria-hidden className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 translate-x-10 -translate-y-10" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
            <div className="relative">
              <div className="text-5xl mb-4 animate-float">🚀</div>
              <h3 className="text-2xl font-black mb-2">Comece Seu Diagnóstico</h3>
              <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm">
                Responda nosso questionário para entender seu nível em cada disciplina e gerar seu plano de estudos personalizado.
              </p>
              <Button onClick={() => router.push('/aluno/diagnostico')} size="lg" className="bg-white !text-[hsl(258_90%_55%)] hover:bg-white/90 shadow-sm mx-auto">
                Iniciar Diagnóstico →
              </Button>
            </div>
          </div>
        )}

        {/* CTA: Diagnóstico pulado */}
        {goal?.diagnostico_status === 'skipped' && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-warm p-8 text-white text-center shadow-[0_8px_32px_-4px_hsl(32_95%_55%_/0.5)] animate-fade-up delay-150">
            <div className="text-4xl mb-3 animate-bounce-gentle">⏳</div>
            <h3 className="text-xl font-black mb-2">Você pulou o diagnóstico</h3>
            <p className="text-white/80 mb-5 text-sm">Faça agora para obter melhores recomendações personalizadas</p>
            <Button onClick={() => router.push('/aluno/diagnostico')} size="lg" className="bg-white !text-[hsl(32_95%_45%)] hover:bg-white/90 shadow-sm mx-auto">
              Fazer Agora →
            </Button>
          </div>
        )}
      </Container>
    </PageContainer>
  );
}

export default function AlunoDashboard() {
  return (
    <ProtectedRoute>
      <AlunoDashboardContent />
    </ProtectedRoute>
  );
}
