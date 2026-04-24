'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Map,
  BookOpen,
  CheckSquare,
  Settings,
  RefreshCw,
  Target,
  GraduationCap,
  Briefcase,
  BookMarked,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Container } from '@/components/Container';
import { CardMenu } from '@/components/CardMenu';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { ProgressBar } from '@/components/ProgressBar';
import { SkeletonDashboard } from '@/components/Skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';

const menuItems = [
  {
    href: '/aluno/plano',
    icon: <LayoutGrid className="w-5 h-5" />,
    title: 'Plano de Estudos',
    description: 'Seu plano personalizado',
    variant: 'primary' as const,
    badge: 'Novo',
  },
  {
    href: '/aluno/trilhas',
    icon: <Map className="w-5 h-5" />,
    title: 'Trilhas de Estudo',
    description: 'Caminhos de aprendizado',
    variant: 'accent' as const,
  },
  {
    href: '/aluno/disciplinas',
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Disciplinas',
    description: 'Progresso em cada materia',
    variant: 'success' as const,
  },
  {
    href: '/aluno/atividades',
    icon: <CheckSquare className="w-5 h-5" />,
    title: 'Atividades',
    description: 'Tarefas e exercicios',
    variant: 'warning' as const,
  },
  {
    href: '/aluno/configuracoes',
    icon: <Settings className="w-5 h-5" />,
    title: 'Configuracoes',
    description: 'Gerencie sua conta',
    variant: 'primary' as const,
  },
  {
    href: '/aluno/onboarding',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Refazer Diagnostico',
    description: 'Atualize suas metas',
    variant: 'accent' as const,
  },
];

const goalIcons = {
  faculdade: GraduationCap,
  mercado: Briefcase,
  escola: BookMarked,
};

const goalLabels = {
  faculdade: 'Faculdade',
  mercado: 'Mercado de Trabalho',
  escola: 'Melhorar na Escola',
};

function AlunoDashboardContent() {
  const router = useRouter();
  const { user, profile, school } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [checkingProgress, setCheckingProgress] = useState(true);

  useEffect(() => {
    const verificarProgresso = async () => {
      try {
        if (!user?.id) {
          setCheckingProgress(false);
          return;
        }

        const { goal: studentGoal, error: goalError } = await getStudentGoal(user.id);

        if (goalError) {
          setGoal(null);
          setCheckingProgress(false);
          return;
        }

        setGoal(studentGoal);
        setCheckingProgress(false);
      } catch {
        setGoal(null);
        setCheckingProgress(false);
      }
    };

    verificarProgresso();
  }, [user?.id]);

  const userName = profile?.display_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Aluno';
  const GoalIcon = goal ? goalIcons[goal.objetivo] : Target;

  if (checkingProgress) {
    return (
      <PageContainer>
        <Navigation />
        <div className="sm:pl-56 pt-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <SkeletonDashboard />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navigation />

      <div className="sm:pl-56 pt-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-2">
              <Avatar name={userName} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Ola, {userName}
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                  {school?.nome || 'Bem-vindo ao NEXA'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Goal Banner */}
          {goal && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6"
            >
              <Card variant="elevated" padding="lg" className="bg-[hsl(var(--primary))] border-0">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-xl bg-white/20 text-white">
                    <GoalIcon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm font-medium mb-0.5">
                      Seu Objetivo
                    </p>
                    <h2 className="text-xl font-bold text-white">
                      {goalLabels[goal.objetivo]}
                    </h2>
                    {goal.forma_ingresso && (
                      <p className="text-white/80 text-sm mt-1">
                        via {goal.forma_ingresso.toUpperCase()}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <Badge
                      variant={goal.diagnostico_status === 'completed' ? 'success' : 'default'}
                      size="md"
                      className="bg-white/20 text-white border-0"
                    >
                      {goal.diagnostico_status === 'completed'
                        ? 'Diagnostico concluido'
                        : goal.diagnostico_status === 'skipped'
                        ? 'Pulado'
                        : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { icon: Zap, label: 'Sequencia', value: '5 dias', color: 'text-[hsl(var(--warning))]' },
              { icon: TrendingUp, label: 'Progresso', value: '32%', color: 'text-[hsl(var(--success))]' },
              { icon: CheckSquare, label: 'Concluidas', value: '12', color: 'text-[hsl(var(--primary))]' },
              { icon: Clock, label: 'Tempo', value: '4h 30m', color: 'text-[hsl(var(--accent))]' },
            ].map((stat, i) => (
              <Card key={stat.label} padding="sm">
                <div className="flex items-center gap-3">
                  <div className={['w-9 h-9 rounded-lg flex items-center justify-center bg-[hsl(var(--muted))]', stat.color].join(' ')}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Navigation Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Navegacao Rapida
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                >
                  <CardMenu {...item} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA: Start Diagnostic */}
          {(!goal || goal.diagnostico_status === 'not_started') && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card variant="elevated" padding="lg" className="text-center bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(217_91%_45%)] border-0">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Comece Seu Diagnostico
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
                  Responda nosso questionario para entender seu nivel em cada disciplina e gerar seu plano de estudos personalizado.
                </p>
                <Button
                  onClick={() => router.push('/aluno/diagnostico')}
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--primary))] hover:bg-white/90"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Iniciar Diagnostico
                </Button>
              </Card>
            </motion.div>
          )}

          {/* CTA: Skipped Diagnostic */}
          {goal?.diagnostico_status === 'skipped' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card variant="elevated" padding="lg" className="bg-[hsl(var(--warning-soft))] border-[hsl(var(--warning))]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--warning))] flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
                      Voce pulou o diagnostico
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">
                      Faca agora para obter melhores recomendacoes personalizadas
                    </p>
                    <Button
                      onClick={() => router.push('/aluno/diagnostico')}
                      size="md"
                      variant="primary"
                      className="bg-[hsl(var(--warning))] hover:bg-[hsl(38_92%_45%)]"
                      iconRight={<ArrowRight className="w-4 h-4" />}
                    >
                      Fazer Agora
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
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
