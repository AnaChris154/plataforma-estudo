'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, Info, ArrowRight, Lightbulb } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Skeleton, SkeletonCard } from '@/components/Skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { getTrilhas } from '@/services/trilhasService';
import type { Trilha } from '@/services/trilhasService';

function TrilhasContent() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrilhas = async () => {
      try {
        const { data: trilhasData, error: trilhasError } = await getTrilhas();

        if (trilhasError) {
          setError(trilhasError.message);
          setTrilhas([]);
        } else {
          setTrilhas(trilhasData || []);
        }
        setLoading(false);
      } catch {
        setError('Erro ao carregar trilhas');
        setLoading(false);
      }
    };

    loadTrilhas();
  }, []);

  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Trilhas de Estudo"
        description="Caminhos de aprendizado estruturados para seus objetivos"
      />
      <Container className="py-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton width="100%" height={80} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        )}

        {error && (
          <Card className="bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--destructive))] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--destructive))]">
                  Erro ao carregar trilhas
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

        {!loading && trilhas.length === 0 && !error && (
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
                <Map className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Nenhuma Trilha Disponivel
              </h2>
              <p className="text-white/80 mb-6 text-sm max-w-sm mx-auto">
                Volte em breve para novas trilhas de aprendizado.
              </p>
              <Link href="/aluno/dashboard">
                <Button variant="secondary" className="bg-white text-[hsl(var(--accent))]">
                  Voltar ao Dashboard
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {!loading && trilhas.length > 0 && (
          <>
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-[hsl(var(--success-soft))] border-[hsl(var(--success))] mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--success))] flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-0.5">
                      O que sao trilhas?
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Caminhos de aprendizado estruturados e progressivos do iniciante ate a maestria em um assunto especifico.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
              Trilhas Disponiveis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {trilhas.map((trilha, i) => (
                <motion.div
                  key={trilha.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card hoverable padding="lg" className="h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center mb-4">
                      <Map className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                      {trilha.titulo}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 flex-1">
                      {trilha.descricao || 'Trilha completa e estruturada de aprendizado'}
                    </p>
                    <Button
                      fullWidth
                      variant="primary"
                      className="bg-[hsl(var(--accent))] hover:bg-[hsl(168_76%_36%)]"
                      iconRight={<ArrowRight className="w-4 h-4" />}
                    >
                      Explorar
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tip */}
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
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Combine com seu plano
                    </h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Use trilhas junto com seu plano personalizado para maximizar o aprendizado!
                    </p>
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

export default function TrilhasPage() {
  return (
    <ProtectedRoute>
      <TrilhasContent />
    </ProtectedRoute>
  );
}
