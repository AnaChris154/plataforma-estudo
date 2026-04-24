'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton, SkeletonCard } from '@/components/Skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import type { StudyPlan } from '@/services/studyPlanService';

const nivelConfig = {
  baixo: { label: 'Baixo', value: 25, variant: 'warning' as const, color: 'text-[hsl(var(--destructive))]' },
  medio: { label: 'Medio', value: 50, variant: 'warning' as const, color: 'text-[hsl(var(--warning))]' },
  alto: { label: 'Alto', value: 85, variant: 'success' as const, color: 'text-[hsl(var(--success))]' },
};

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
      } catch {
        setError('Erro ao carregar disciplinas');
        setLoading(false);
      }
    };

    loadDisciplinas();
  }, [user]);

  const countByLevel = {
    baixo: disciplinas.filter((d) => d.nivel === 'baixo').length,
    medio: disciplinas.filter((d) => d.nivel === 'medio').length,
    alto: disciplinas.filter((d) => d.nivel === 'alto').length,
  };

  return (
    <PageContainer>
      <Navigation />
      <Header title="Disciplinas" description="Acompanhe seu progresso em cada materia" />
      <Container className="py-8">
        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Skeleton height={80} />
              <Skeleton height={80} />
              <Skeleton height={80} />
            </div>
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
                  Erro ao carregar disciplinas
                </h3>
                <p className="text-sm mt-1 text-[hsl(var(--destructive))]">{error}</p>
                <Link href="/aluno/dashboard">
                  <Button size="sm" variant="secondary" className="mt-3">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {!loading && disciplinas.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              variant="elevated"
              padding="lg"
              className="text-center bg-[hsl(var(--primary))] border-0"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Nenhuma Disciplina
              </h2>
              <p className="text-white/80 mb-6 text-sm max-w-sm mx-auto">
                Complete o diagnostico para visualizar suas disciplinas.
              </p>
              <Link href="/aluno/diagnostico">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--primary))]"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Iniciar Diagnostico
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {!loading && disciplinas.length > 0 && (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                { count: countByLevel.baixo, label: 'Baixo', bg: 'bg-[hsl(var(--destructive-soft))]', border: 'border-[hsl(var(--destructive)_/_0.3)]', text: 'text-[hsl(var(--destructive))]' },
                { count: countByLevel.medio, label: 'Medio', bg: 'bg-[hsl(var(--warning-soft))]', border: 'border-[hsl(var(--warning)_/_0.3)]', text: 'text-[hsl(38_92%_40%)]' },
                { count: countByLevel.alto, label: 'Alto', bg: 'bg-[hsl(var(--success-soft))]', border: 'border-[hsl(var(--success)_/_0.3)]', text: 'text-[hsl(var(--success))]' },
              ].map((s) => (
                <Card
                  key={s.label}
                  padding="sm"
                  className={[s.bg, s.border, 'text-center'].join(' ')}
                >
                  <p className={['text-2xl font-bold', s.text].join(' ')}>
                    {s.count}
                  </p>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1">
                    {s.label}
                  </p>
                </Card>
              ))}
            </motion.div>

            <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Detalhes por Disciplina
            </h3>

            <div className="space-y-3 mb-8">
              {disciplinas.map((disciplina, i) => {
                const config = nivelConfig[disciplina.nivel];
                return (
                  <motion.div
                    key={disciplina.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card hoverable>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[hsl(var(--foreground))] capitalize">
                          {disciplina.materia}
                        </h4>
                        <span className={['text-sm font-medium', config.color].join(' ')}>
                          Nivel {config.label}
                        </span>
                      </div>
                      <ProgressBar
                        value={config.value}
                        variant={disciplina.nivel === 'alto' ? 'success' : disciplina.nivel === 'medio' ? 'warning' : 'primary'}
                        size="md"
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Badge variant="default">{disciplina.origem}</Badge>
                        <Badge variant="default" className="capitalize">
                          {disciplina.prioridade}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[hsl(var(--primary-soft))] border-[hsl(var(--primary)_/_0.2)] mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                      Dicas para melhorar
                    </h4>
                    <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                      <li>Foque primeiro nas disciplinas de nivel baixo</li>
                      <li>Use as trilhas de estudo para estruturar seu aprendizado</li>
                      <li>Pratique regularmente com as atividades disponiveis</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/plano">
                <Button size="lg" variant="secondary" fullWidth>
                  Meu Plano
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
