'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Inbox,
  Sparkles,
  Target,
  Dumbbell,
  Trophy,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';

const infoCards = [
  {
    icon: Sparkles,
    title: 'Desbloqueamento Progressivo',
    desc: 'As atividades sao desbloqueadas conforme voce progride',
    color: 'bg-[hsl(var(--primary))]',
    bgColor: 'bg-[hsl(var(--primary-soft))]',
    borderColor: 'border-[hsl(var(--primary)_/_0.2)]',
  },
  {
    icon: Target,
    title: 'Alinhado com Seu Plano',
    desc: 'Cada atividade esta alinhada com seu plano personalizado',
    color: 'bg-[hsl(var(--success))]',
    bgColor: 'bg-[hsl(var(--success-soft))]',
    borderColor: 'border-[hsl(var(--success)_/_0.2)]',
  },
  {
    icon: Dumbbell,
    title: 'Pratica Regular',
    desc: 'Pratique para consolidar o conhecimento',
    color: 'bg-[hsl(var(--warning))]',
    bgColor: 'bg-[hsl(var(--warning-soft))]',
    borderColor: 'border-[hsl(var(--warning)_/_0.2)]',
  },
  {
    icon: Trophy,
    title: 'Ganhe Reconhecimento',
    desc: 'Complete atividades para ganhar pontos',
    color: 'bg-[hsl(var(--accent))]',
    bgColor: 'bg-[hsl(var(--accent-soft))]',
    borderColor: 'border-[hsl(var(--accent)_/_0.2)]',
  },
];

const nextSteps = [
  'Complete seu diagnostico (se ainda nao fez)',
  'Revise seu plano de estudos personalizado',
  'Estude as disciplinas indicadas no plano',
  'Volte aqui para praticar com as atividades',
];

function AtividadesContent() {
  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Atividades"
        description="Tarefas e exercicios para praticar"
      />

      <Container className="py-8">
        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card
            variant="elevated"
            padding="lg"
            className="text-center bg-[hsl(var(--primary))] border-0"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Nenhuma Atividade Pendente
            </h2>
            <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
              Continue estudando para desbloquear novas tarefas e exercicios!
            </p>
            <Link href="/aluno/dashboard">
              <Button
                variant="secondary"
                className="bg-white text-[hsl(var(--primary))]"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Voltar ao Dashboard
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
          Como funcionam as atividades
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {infoCards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            >
              <Card
                className={[item.bgColor, item.borderColor].join(' ')}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={[
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      item.color,
                    ].join(' ')}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Next Steps */}
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
                  Proximos Passos
                </h4>
                <ol className="text-sm text-[hsl(var(--muted-foreground))] space-y-1.5 list-decimal list-inside">
                  {nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
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
      </Container>
    </PageContainer>
  );
}

export default function AtividadesPage() {
  return (
    <ProtectedRoute>
      <AtividadesContent />
    </ProtectedRoute>
  );
}
