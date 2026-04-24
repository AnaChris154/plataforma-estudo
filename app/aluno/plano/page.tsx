'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  AlertCircle,
  Target,
  GraduationCap,
  Briefcase,
  BookMarked,
  Lightbulb,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton, SkeletonCard } from '@/components/Skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudyPlan } from '@/services/studyPlanService';
import type { StudentGoal } from '@/services/studentGoalsService';

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

const prioridadeConfig = {
  alta: {
    label: 'Alta Prioridade',
    bg: 'bg-[hsl(var(--destructive-soft))]',
    border: 'border-[hsl(var(--destructive)_/_0.2)]',
    badge: 'danger' as const,
  },
  media: {
    label: 'Media Prioridade',
    bg: 'bg-[hsl(var(--warning-soft))]',
    border: 'border-[hsl(var(--warning)_/_0.2)]',
    badge: 'warning' as const,
  },
  baixa: {
    label: 'Baixa Prioridade',
    bg: 'bg-[hsl(var(--success-soft))]',
    border: 'border-[hsl(var(--success)_/_0.2)]',
    badge: 'success' as const,
  },
};

const nivelConfig = {
  baixo: { value: 25, variant: 'primary' as const },
  medio: { value: 50, variant: 'warning' as const },
  alto: { value: 85, variant: 'success' as const },
};

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
        const { goal: studentGoal } = await getStudentGoal(user.id);
        setGoal(studentGoal || null);

        if (!studentGoal || studentGoal.diagnostico_status !== 'completed') {
          setPlano([]);
          setLoading(false);
          return;
        }

        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);

        if (planError) {
          setError(planError.message);
          setPlano([]);
        } else {
          setPlano(studyPlan || []);
        }
        setLoading(false);
      } catch {
        setError('Erro ao carregar plano de estudos');
        setLoading(false);
      }
    };

    loadPlano();
  }, [user]);

  const GoalIcon = goal ? goalIcons[goal.objetivo] : Target;

  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Plano de Estudos"
        description="Seu mapa personalizado de aprendizado"
      />
      <Container className="py-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton height={100} />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && (
          <Card className="bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--destructive))] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--destructive))]">
                  Erro ao carregar plano
                </h3>
                <p className="text-sm text-[hsl(var(--destructive))] mt-1">{error}</p>
                <Link href="/aluno/dashboard">
                  <Button size="sm" variant="secondary" className="mt-3">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* No goal */}
        {!loading && !goal?.id && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              variant="elevated"
              padding="lg"
              className="text-center bg-[hsl(var(--accent))] border-0"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Plano Nao Disponivel
              </h2>
              <p className="text-white/80 mb-6 text-sm max-w-sm mx-auto">
                Voce precisa completar o diagnostico para gerar seu plano personalizado.
              </p>
              <Link href="/aluno/diagnostico">
                <Button
                  variant="secondary"
                  className="bg-white text-[hsl(var(--accent))]"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Iniciar Diagnostico
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {/* With plan */}
        {!loading && goal?.diagnostico_status === 'completed' && plano.length > 0 && (
          <>
            {/* Goal Banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card
                variant="elevated"
                padding="lg"
                className="bg-[hsl(var(--primary))] border-0"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-xl bg-white/20 text-white">
                    <GoalIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                      Seu Objetivo
                    </p>
                    <h2 className="text-xl font-bold text-white">
                      {goalLabels[goal.objetivo]}
                    </h2>
                    {goal.forma_ingresso && (
                      <p className="text-white/80 text-sm mt-0.5">
                        via {goal.forma_ingresso.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Disciplinas por Prioridade
            </h3>

            <div className="space-y-3 mb-8">
              {plano.map((materia, i) => {
                const prioConfig = prioridadeConfig[materia.prioridade];
                const nivConfig = nivelConfig[materia.nivel];

                return (
                  <motion.div
                    key={materia.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card
                      hoverable
                      className={[prioConfig.bg, prioConfig.border].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[hsl(var(--foreground))] capitalize">
                          {materia.materia}
                        </h4>
                        <Badge variant={prioConfig.badge}>
                          {prioConfig.label}
                        </Badge>
                      </div>
                      <ProgressBar
                        value={nivConfig.value}
                        variant={nivConfig.variant}
                        size="md"
                        className="mb-2"
                      />
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Nivel detectado: <span className="font-medium capitalize">{materia.nivel}</span>
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-[hsl(var(--primary-soft))] border-[hsl(var(--primary)_/_0.2)] mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Como usar seu plano
                    </h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Comece pelos topicos com alta prioridade. Combine com as trilhas de estudo para uma jornada estruturada!
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/trilhas">
                <Button size="lg" variant="secondary" fullWidth>
                  Explorar Trilhas
                </Button>
              </Link>
              <Link href="/aluno/dashboard">
                <Button size="lg" variant="outline" fullWidth>
                  Dashboard
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Empty plan */}
        {!loading && goal?.diagnostico_status === 'completed' && plano.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center">
              <Inbox className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Plano Vazio</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 text-sm">
              Nenhum plano disponivel no momento.
            </p>
            <Link href="/aluno/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </motion.div>
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
