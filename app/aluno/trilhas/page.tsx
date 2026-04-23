'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
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
      } catch (err) {
        console.error('Erro ao carregar trilhas:', err);
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
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-success shadow-glow mb-5 animate-float"><span className="text-3xl">🗺️</span></div>
            <p className="font-bold text-[hsl(var(--foreground))]">Carregando trilhas...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)]">
            <span className="text-3xl shrink-0">❌</span>
            <div>
              <h3 className="font-bold text-[hsl(var(--destructive))]">Erro ao carregar trilhas</h3>
              <p className="text-sm mt-1 text-[hsl(var(--destructive))]">{error}</p>
              <Link href="/aluno/dashboard"><Button size="sm" variant="secondary" className="mt-3">← Dashboard</Button></Link>
            </div>
          </div>
        )}

        {!loading && trilhas.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-up">
            <div className="text-5xl mb-4 animate-float">🗺️</div>
            <h2 className="text-2xl font-black mb-2">Nenhuma Trilha Disponível</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 text-sm max-w-sm mx-auto">Volte em breve para novas trilhas de aprendizado.</p>
            <Link href="/aluno/dashboard"><Button variant="outline">← Dashboard</Button></Link>
          </div>
        )}

        {!loading && trilhas.length > 0 && (
          <>
            {/* Info banner */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[hsl(160_84%_95%)] border border-[hsl(160_84%_39%_/0.25)] mb-7 animate-fade-up">
              <span className="text-2xl shrink-0">📍</span>
              <div>
                <h3 className="font-bold text-[hsl(var(--foreground))] mb-0.5">O que são trilhas?</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Caminhos de aprendizado estruturados e progressivos do iniciante até a maestria em um assunto específico.</p>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">Trilhas Disponíveis</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-fade-up delay-75">
              {trilhas.map((trilha, i) => (
                <div key={trilha.id} className="bg-white rounded-2xl border-2 border-[hsl(var(--border))] p-6 flex flex-col shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-[hsl(160_84%_39%_/0.4)] transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-success text-white text-2xl shadow-sm mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-3">🎯</div>
                  <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">{trilha.titulo}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 flex-1">{trilha.descricao || 'Trilha completa e estruturada de aprendizado'}</p>
                  <Button fullWidth size="md" className="bg-gradient-success !text-white shadow-[0_4px_12px_-2px_hsl(160_84%_39%_/0.4)] hover:brightness-110">Explorar →</Button>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-soft border border-[hsl(var(--primary)_/0.2)] mb-6">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <h4 className="font-bold text-[hsl(var(--foreground))] mb-1">Combine com seu plano</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Use trilhas junto com seu plano personalizado para maximizar o aprendizado!</p>
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

export default function TrilhasPage() {
  return (
    <ProtectedRoute>
      <TrilhasContent />
    </ProtectedRoute>
  );
}
