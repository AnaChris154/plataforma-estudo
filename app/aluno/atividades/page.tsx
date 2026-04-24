'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';

function AtividadesContent() {
  return (
    <PageContainer>
      <Navigation />
      <Header title="Atividades" description="Tarefas e exercícios para praticar" />

      <Container className="py-8">
        {/* Estado vazio com banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white text-center mb-8 shadow-[0_8px_32px_-4px_hsl(258_90%_60%_/0.4)] animate-fade-up">
          <div aria-hidden className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 translate-x-10 -translate-y-10" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
          <div className="relative">
            <div className="text-5xl mb-4 animate-float">📭</div>
            <h2 className="text-2xl font-black mb-2">Nenhuma Atividade Pendente</h2>
            <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
              Continue estudando para desbloquear novas tarefas e exercícios!
            </p>
            <Link href="/aluno/dashboard">
              <Button size="lg" className="bg-white !text-[hsl(258_90%_55%)] hover:bg-white/90 mx-auto">← Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Info cards */}
        <div className="mb-3">
          <h3 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">Como funcionam as atividades</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-fade-up delay-75">
          {[
            { icon: '✨', title: 'Desbloqueamento Progressivo', desc: 'As atividades são desbloqueadas conforme você progride', color: 'border-[hsl(258_90%_60%_/0.25)] bg-primary-soft' },
            { icon: '🎯', title: 'Alinhado com Seu Plano', desc: 'Cada atividade está alinhada com seu plano personalizado', color: 'border-[hsl(160_84%_39%_/0.25)] bg-[hsl(160_84%_95%)]' },
            { icon: '💪', title: 'Prática Regular', desc: 'Pratique para consolidar o conhecimento', color: 'border-[hsl(32_95%_55%_/0.25)] bg-[hsl(32_100%_95%)]' },
            { icon: '🏆', title: 'Ganhe Reconhecimento', desc: 'Complete atividades para ganhar pontos', color: 'border-[hsl(199_95%_50%_/0.25)] bg-accent-soft' },
          ].map((item) => (
            <div key={item.title} className={['rounded-2xl border-2 p-5 flex gap-4 transition-all duration-200 hover:shadow-sm', item.color].join(' ')}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <h4 className="font-bold text-[hsl(var(--foreground))] mb-0.5">{item.title}</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Próximos passos */}
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-soft border border-[hsl(var(--primary)_/0.2)] mb-6 animate-fade-up delay-100">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <h4 className="font-bold text-[hsl(var(--foreground))] mb-2">Próximos Passos</h4>
            <ol className="text-sm text-[hsl(var(--muted-foreground))] space-y-1.5 list-decimal list-inside">
              <li>Complete seu diagnóstico (se ainda não fez)</li>
              <li>Revise seu plano de estudos personalizado</li>
              <li>Estude as disciplinas indicadas no plano</li>
              <li>Volte aqui para praticar com as atividades</li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 animate-fade-up delay-150">
          <Link href="/aluno/plano"><Button size="lg" variant="secondary" fullWidth>Meu Plano →</Button></Link>
          <Link href="/aluno/dashboard"><Button size="lg" variant="outline" fullWidth>← Dashboard</Button></Link>
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
