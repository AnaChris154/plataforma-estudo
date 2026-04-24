import { supabase } from '@/lib/supabaseClient';
import { DiagnosticoNivel } from './diagnosticoService';

export interface StudyPlan {
  id: string;
  user_id: string;
  materia: string;
  nivel: 'baixo' | 'medio' | 'alto';
  prioridade: 'alta' | 'media' | 'baixa';
  origem: string;
  created_at: string;
  updated_at: string;
}

/**
 * Regra: Mapear nível do aluno para prioridade no plano
 *
 * Lógica:
 * - Nível BAIXO    → Prioridade ALTA   (precisa de muito reforço)
 * - Nível MÉDIO    → Prioridade MÉDIA  (precisa de aprimoramento)
 * - Nível ALTO     → Prioridade BAIXA  (já conhece bem)
 */
function definirPrioridade(nivel: 'baixo' | 'medio' | 'alto'): 'alta' | 'media' | 'baixa' {
  const map: { [key: string]: 'alta' | 'media' | 'baixa' } = {
    baixo: 'alta',
    medio: 'media',
    alto: 'baixa',
  };
  return map[nivel] || 'media';
}

/**
 * Gerar plano de estudo baseado no diagnóstico
 *
 * Processo:
 * 1. Limpar plano anterior (se existir)
 * 2. Aplicar regras de prioridade
 * 3. Salvar novo plano
 */
export async function gerarPlanoEstudo(
  userId: string,
  diagnostico: DiagnosticoNivel
): Promise<{ plano: StudyPlan[] | null; error: Error | null }> {
  try {
    if (!userId || !diagnostico) {
      return { plano: null, error: new Error('userId e diagnostico são obrigatórios') };
    }

    // 1. Limpar plano anterior
    await supabase.from('study_plans').delete().eq('user_id', userId);

    // 2. Preparar dados do novo plano
    const novoPlano = Object.entries(diagnostico).map(([materia, nivel]) => ({
      user_id: userId,
      materia,
      nivel,
      prioridade: definirPrioridade(nivel),
      origem: 'diagnostico',
    }));

    // 3. Inserir novo plano
    const { data, error } = await supabase
      .from('study_plans')
      .insert(novoPlano)
      .select();

    if (error) {
      console.error('Erro ao gerar plano:', error.message);
      return { plano: null, error: new Error(error.message) };
    }

    if (!data || data.length === 0) {
      return { plano: null, error: new Error('Erro ao gerar plano de estudos') };
    }

    const plano = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      materia: item.materia,
      nivel: item.nivel,
      prioridade: item.prioridade,
      origem: item.origem,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return { plano, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao gerar plano:', message);
    return { plano: null, error: new Error(message) };
  }
}

/**
 * Obter plano de estudo do aluno
 */
export async function getStudyPlan(userId: string): Promise<{ plano: StudyPlan[] | null; error: Error | null }> {
  try {
    if (!userId) {
      return { plano: null, error: new Error('userId é obrigatório') };
    }

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('prioridade', { ascending: false });

    if (error) {
      // Se não encontrar é OK (aluno ainda não fez diagnóstico)
      if (error.code === 'PGRST116') {
        return { plano: null, error: null };
      }
      console.error('Erro ao buscar plano:', error.message);
      return { plano: null, error: new Error(error.message) };
    }

    if (!data || data.length === 0) {
      return { plano: null, error: null };
    }

    const plano = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      materia: item.materia,
      nivel: item.nivel,
      prioridade: item.prioridade,
      origem: item.origem,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return { plano, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar plano:', message);
    return { plano: null, error: new Error(message) };
  }
}

/**
 * Remover seu próprio plano de estudo
 */
export async function removerPlanoEstudo(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return { success: false, error: new Error('userId é obrigatório') };
    }

    const { error } = await supabase.from('study_plans').delete().eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover plano:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao remover plano:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Obter resumo do plano agrupado por prioridade
 */
export async function getStudyPlanSummary(
  userId: string
): Promise<{
  resumo: { alta: string[]; media: string[]; baixa: string[] } | null;
  error: Error | null;
}> {
  try {
    const { plano, error } = await getStudyPlan(userId);

    if (error) {
      return { resumo: null, error };
    }

    if (!plano) {
      return { resumo: null, error: null };
    }

    const resumo = {
      alta: plano.filter((p) => p.prioridade === 'alta').map((p) => p.materia),
      media: plano.filter((p) => p.prioridade === 'media').map((p) => p.materia),
      baixa: plano.filter((p) => p.prioridade === 'baixa').map((p) => p.materia),
    };

    return { resumo, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao gerar resumo:', message);
    return { resumo: null, error: new Error(message) };
  }
}
