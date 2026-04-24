'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  ClipboardCheck,
  Target,
  GraduationCap,
  Briefcase,
  BookOpen,
  Clock,
  RotateCcw,
  ArrowRight,
  LayoutDashboard,
  Lightbulb,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Skeleton } from '@/components/Skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal, resetarDiagnostico } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';

const statusConfig = {
  not_started: {
    icon: Clock,
    label: 'Nao Iniciado',
    desc: 'Voce ainda nao iniciou o diagnostico',
    variant: 'warning' as const,
  },
  skipped: {
    icon: ClipboardCheck,
    label: 'Pulado',
    desc: 'Voce pulou o diagnostico inicial',
    variant: 'warning' as const,
  },
  completed: {
    icon: ClipboardCheck,
    label: 'Concluido',
    desc: 'Seu diagnostico foi realizado com sucesso',
    variant: 'success' as const,
  },
};

const goalIcons = {
  faculdade: GraduationCap,
  mercado: Briefcase,
  escola: BookOpen,
};

const tips = [
  'Revise seu objetivo periodicamente',
  'Refaca o diagnostico quando sentir que progrediu',
  'Acompanhe suas disciplinas regularmente',
  'Use as trilhas de estudo como guia estruturado',
];

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

    const { error: resetError } = await resetarDiagnostico(user.id);

    if (resetError) {
      setError(`Erro ao resetar diagnostico: ${resetError.message}`);
      setResetting(false);
      return;
    }

    router.push('/aluno/diagnostico');
  };

  const diagnosticoStatus = goal?.diagnostico_status || 'not_started';
  const status = statusConfig[diagnosticoStatus as keyof typeof statusConfig] || statusConfig.not_started;
  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Configuracoes"
        description="Suas preferencias e informacoes de perfil"
      />

      <Container className="py-8">
        {loading ? (
          <div className="space-y-4 max-w-2xl">
            <Skeleton height={120} />
            <Skeleton height={100} />
            <Skeleton height={150} />
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {/* Profile Banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="bg-[hsl(var(--primary))] border-0"
              >
                <div className="flex items-center gap-5">
                  <Avatar name={userName} size="xl" className="bg-white/20 text-white" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-white truncate">
                      {userName}
                    </h2>
                    <p className="text-white/80 text-sm truncate">
                      {user?.email}
                    </p>
                    {profile?.phone && (
                      <p className="text-white/70 text-xs mt-0.5">
                        {profile.phone}
                      </p>
                    )}
                    <Badge
                      variant="default"
                      className="mt-2 bg-white/20 text-white border-0"
                    >
                      {profile?.tipo === 'aluno' ? 'Aluno' : 'Professor'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Diagnostic Status */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Diagnostico de Conhecimento
              </h3>

              <Card
                className={
                  status.variant === 'success'
                    ? 'bg-[hsl(var(--success-soft))] border-[hsl(var(--success)_/_0.2)]'
                    : 'bg-[hsl(var(--warning-soft))] border-[hsl(var(--warning)_/_0.2)]'
                }
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={[
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      status.variant === 'success'
                        ? 'bg-[hsl(var(--success))]'
                        : 'bg-[hsl(var(--warning))]',
                    ].join(' ')}
                  >
                    <status.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className={[
                        'font-semibold',
                        status.variant === 'success'
                          ? 'text-[hsl(var(--success))]'
                          : 'text-[hsl(38_92%_40%)]',
                      ].join(' ')}
                    >
                      {status.label}
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                      {status.desc}
                    </p>
                  </div>
                </div>

                {error && (
                  <Card className="bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))] mb-4">
                    <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                  </Card>
                )}

                {diagnosticoStatus === 'not_started' && (
                  <Link href="/aluno/diagnostico">
                    <Button
                      fullWidth
                      size="lg"
                      iconRight={<ArrowRight className="w-4 h-4" />}
                    >
                      Iniciar Diagnostico
                    </Button>
                  </Link>
                )}

                {diagnosticoStatus === 'skipped' && (
                  <Link href="/aluno/diagnostico">
                    <Button
                      fullWidth
                      size="lg"
                      iconRight={<ArrowRight className="w-4 h-4" />}
                    >
                      Fazer Diagnostico Agora
                    </Button>
                  </Link>
                )}

                {diagnosticoStatus === 'completed' && (
                  <Button
                    fullWidth
                    size="lg"
                    variant="outline"
                    onClick={handleResetDiagnostico}
                    isLoading={resetting}
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    {resetting ? 'Refazendo...' : 'Refazer Diagnostico'}
                  </Button>
                )}
              </Card>
            </motion.div>

            {/* Goal Info */}
            {goal && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Seu Objetivo
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="bg-[hsl(var(--primary-soft))] border-[hsl(var(--primary)_/_0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                        {goal.objetivo === 'faculdade' ? (
                          <GraduationCap className="w-5 h-5 text-white" />
                        ) : goal.objetivo === 'mercado' ? (
                          <Briefcase className="w-5 h-5 text-white" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-[hsl(var(--primary))] font-medium">
                          Objetivo
                        </p>
                        <p className="font-semibold text-[hsl(var(--foreground))] capitalize text-sm">
                          {goal.objetivo === 'faculdade'
                            ? 'Faculdade'
                            : goal.objetivo === 'mercado'
                            ? 'Mercado'
                            : 'Escola'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {goal.forma_ingresso && (
                    <Card className="bg-[hsl(var(--accent-soft))] border-[hsl(var(--accent)_/_0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--accent))] font-medium">
                            Caminho
                          </p>
                          <p className="font-semibold text-[hsl(var(--foreground))] text-sm capitalize">
                            {goal.forma_ingresso.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {goal.curso_desejado && (
                    <Card className="bg-[hsl(var(--success-soft))] border-[hsl(var(--success)_/_0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--success))] flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--success))] font-medium">
                            Curso Desejado
                          </p>
                          <p className="font-semibold text-[hsl(var(--foreground))] text-sm">
                            {goal.curso_desejado}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {goal.tempo_meta && (
                    <Card className="bg-[hsl(var(--warning-soft))] border-[hsl(var(--warning)_/_0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--warning))] flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(38_92%_40%)] font-medium">
                            Tempo Meta
                          </p>
                          <p className="font-semibold text-[hsl(var(--foreground))] text-sm">
                            {goal.tempo_meta} meses
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[hsl(var(--accent-soft))] border-[hsl(var(--accent)_/_0.2)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--foreground))] mb-2">
                      Dicas para Melhorar
                    </p>
                    <ul className="space-y-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                      {tips.map((tip) => (
                        <li key={tip} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <Link href="/aluno/plano">
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Meu Plano
                </Button>
              </Link>
              <Link href="/aluno/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  icon={<LayoutDashboard className="w-4 h-4" />}
                >
                  Dashboard
                </Button>
              </Link>
            </motion.div>
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
