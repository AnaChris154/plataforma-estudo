'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal, resetarDiagnostico } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';
import { ClipboardCheck, Target, RotateCcw, ArrowRight, LayoutDashboard, Zap, BookOpen, Clock, GraduationCap, Briefcase, User } from 'lucide-react';

function ConfiguracoesContent() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoal = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { goal: studentGoal } = await getStudentGoal(user.id);
      setGoal(studentGoal || null);
      setLoading(false);
    };

    loadGoal();
  }, [user]);

  const handleResetDiagnostico = async () => {
    if (!user?.id) return;

    setResetting(true);
    setError(null);

    const { success, error: resetError } = await resetarDiagnostico(user.id);

    if (resetError) {
      setError(`Erro ao resetar diagnóstico: ${resetError.message}`);
      setResetting(false);
      return;
    }

    // Redirecionar para diagnóstico
    router.push('/aluno/diagnostico');
  };

  const diagnosticoStatus = goal?.diagnostico_status || 'not_started';

  const statusConfig = {
    not_started: {
      icon: <Clock className="w-6 h-6" />,
      label: 'Não Iniciado',
      desc: 'Você ainda não iniciou o diagnóstico',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    skipped: {
      icon: <ClipboardCheck className="w-6 h-6" />,
      label: 'Pulado',
      desc: 'Você pulou o diagnóstico inicial',
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200',
    },
    completed: {
      icon: <ClipboardCheck className="w-6 h-6" />,
      label: 'Concluído',
      desc: 'Seu diagnóstico foi realizado com sucesso',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
  };

  const status = statusConfig[diagnosticoStatus as keyof typeof statusConfig] || statusConfig.not_started;

  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Configurações"
        description="Suas preferências e informações de perfil"
      />

      <Container className="py-8 md:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center animate-bounce-gentle shadow-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
            </div>
            <p className="text-muted text-sm">Carregando configurações...</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl">

            {/* Profile Banner */}
            <div className="rounded-2xl bg-gradient-hero p-6 shadow-glow text-white relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold truncate">
                    {profile?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                  </h2>
                  <p className="text-white/80 text-sm truncate">{user?.email}</p>
                  {profile?.phone && (
                    <p className="text-white/70 text-xs mt-0.5">{profile.phone}</p>
                  )}
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold">
                    {profile?.tipo === 'aluno' ? 'Aluno' : 'Professor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Status */}
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Diagnóstico de Conhecimento
              </p>

              <div className={`rounded-2xl border-2 p-5 ${status.bg}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0 ${status.color}`}>
                    {status.icon}
                  </div>
                  <div>
                    <p className={`font-bold ${status.color}`}>{status.label}</p>
                    <p className="text-sm text-muted mt-0.5">{status.desc}</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {diagnosticoStatus === 'not_started' && (
                  <Link href="/aluno/diagnostico">
                    <Button fullWidth size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                      Iniciar Diagnóstico
                    </Button>
                  </Link>
                )}

                {diagnosticoStatus === 'skipped' && (
                  <Link href="/aluno/diagnostico">
                    <Button fullWidth size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                      Fazer Diagnóstico Agora
                    </Button>
                  </Link>
                )}

                {diagnosticoStatus === 'completed' && (
                  <Button
                    fullWidth
                    size="lg"
                    variant="outline"
                    onClick={handleResetDiagnostico}
                    disabled={resetting}
                    icon={<RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />}
                  >
                    {resetting ? 'Refazendo...' : 'Refazer Diagnóstico'}
                  </Button>
                )}
              </div>
            </div>

            {/* Goal Info */}
            {goal && (
              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Seu Objetivo
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-violet-100 bg-violet-50 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      {goal.objetivo === 'faculdade' ? (
                        <GraduationCap className="w-5 h-5 text-violet-600" />
                      ) : goal.objetivo === 'mercado' ? (
                        <Briefcase className="w-5 h-5 text-violet-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-violet-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-violet-600 font-semibold">Objetivo</p>
                      <p className="font-bold text-gray-900 capitalize text-sm">
                        {goal.objetivo === 'faculdade' ? 'Faculdade' : goal.objetivo === 'mercado' ? 'Mercado' : 'Escola'}
                      </p>
                    </div>
                  </div>

                  {goal.forma_ingresso && (
                    <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xs text-sky-600 font-semibold">Caminho</p>
                        <p className="font-bold text-gray-900 text-sm capitalize">{goal.forma_ingresso.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  )}

                  {goal.curso_desejado && (
                    <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-600 font-semibold">Curso Desejado</p>
                        <p className="font-bold text-gray-900 text-sm">{goal.curso_desejado}</p>
                      </div>
                    </div>
                  )}

                  {goal.universidade && (
                    <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600 font-semibold">Universidade</p>
                        <p className="font-bold text-gray-900 text-sm">{goal.universidade}</p>
                      </div>
                    </div>
                  )}

                  {goal.tempo_meta && (
                    <div className="rounded-2xl border-2 border-amber-100 bg-amber-50 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-semibold">Tempo Meta</p>
                        <p className="font-bold text-gray-900 text-sm">{goal.tempo_meta} meses</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-sky-600" />
                <p className="font-bold text-sky-800">Dicas para Melhorar</p>
              </div>
              <ul className="space-y-1.5 text-sm text-sky-700">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" /> Revise seu objetivo periodicamente</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" /> Refaça o diagnóstico quando sentir que progrediu</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" /> Acompanhe suas disciplinas regularmente</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" /> Use as trilhas de estudo como guia estruturado</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/plano">
                <Button size="lg" variant="outline" fullWidth icon={<ArrowRight className="w-4 h-4" />}>
                  Meu Plano
                </Button>
              </Link>
              <Link href="/aluno/dashboard">
                <Button size="lg" variant="secondary" fullWidth icon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
            </div>

          </div>
        )}
      </Container>
    </PageContainer>
  );
}

export default function ConfiguracoesPage() {
  return (
    <ProtectedRoute>
      <ConfiguracoesContent />
    </ProtectedRoute>
  );
}
