import { supabase } from '@/lib/supabaseClient';

export interface DiagnosticoNivel {
  [materia: string]: 'baixo' | 'medio' | 'alto';
}

export interface DiagnosticoDetalhado {
  materia: string;
  total_perguntas: number;
  perguntas_corretas: number;
  taxa_acerto: number;
  nivel: 'baixo' | 'medio' | 'alto';
}

/**
 * Salvar resposta do aluno
 */
export async function saveAnswer(
  userId: string,
  questionId: string,
  resposta: 'a' | 'b' | 'c' | 'd',
  correta: boolean
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId || !questionId || !resposta) {
      return { success: false, error: new Error('userId, questionId e resposta são obrigatórios') };
    }

    const { error } = await supabase.from('answers').insert([
      {
        user_id: userId,
        question_id: questionId,
        resposta,
        correta,
      },
    ]);

    if (error) {
      console.error('Erro ao salvar resposta:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao salvar resposta:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Calcular nível por matéria baseado no diagnóstico
 *
 * Regra:
 * - < 40% → "baixo"
 * - 40% a 70% → "medio"
 * - > 70% → "alto"
 */
export async function calcularNivelPorMateria(
  userId: string
): Promise<{ diagnostico: DiagnosticoNivel | null; detalhes: DiagnosticoDetalhado[] | null; error: Error | null }> {
  try {
    if (!userId) {
      return { diagnostico: null, detalhes: null, error: new Error('userId é obrigatório') };
    }

    // 1. Buscar todas as respostas do aluno com matéria das questões
    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select(
        `
        id,
        correta,
        question_id,
        questions!inner(materia)
      `
      )
      .eq('user_id', userId);

    if (answersError) {
      console.error('Erro ao buscar respostas:', answersError.message);
      return { diagnostico: null, detalhes: null, error: new Error(answersError.message) };
    }

    if (!answersData || answersData.length === 0) {
      return {
        diagnostico: null,
        detalhes: null,
        error: new Error('Nenhuma resposta encontrada para calcular diagnóstico'),
      };
    }

    // 2. Agrupar por matéria
    const materiaStats: { [key: string]: { total: number; corretas: number } } = {};

    answersData.forEach((answer: any) => {
      const materia = answer.questions.materia;

      if (!materiaStats[materia]) {
        materiaStats[materia] = { total: 0, corretas: 0 };
      }

      materiaStats[materia].total += 1;
      if (answer.correta) {
        materiaStats[materia].corretas += 1;
      }
    });

    // 3. Calcular taxa e classificação
    const diagnostico: DiagnosticoNivel = {};
    const detalhes: DiagnosticoDetalhado[] = [];

    for (const materia in materiaStats) {
      const { total, corretas } = materiaStats[materia];
      const taxa = (corretas / total) * 100;

      let nivel: 'baixo' | 'medio' | 'alto';
      if (taxa < 40) {
        nivel = 'baixo';
      } else if (taxa <= 70) {
        nivel = 'medio';
      } else {
        nivel = 'alto';
      }

      diagnostico[materia] = nivel;

      detalhes.push({
        materia,
        total_perguntas: total,
        perguntas_corretas: corretas,
        taxa_acerto: Math.round(taxa * 100) / 100,
        nivel,
      });
    }

    return { diagnostico, detalhes, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao calcular nível:', message);
    return { diagnostico: null, detalhes: null, error: new Error(message) };
  }
}

/**
 * Obter todas as questões disponíveis para diagnóstico
 */
export async function getQuestoes(materia?: string, nivel?: string): Promise<{ questoes: any[] | null; error: Error | null }> {
  try {
    let query = supabase.from('questions').select('*');

    if (materia) {
      query = query.eq('materia', materia);
    }

    if (nivel) {
      query = query.eq('nivel', nivel);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar questões:', error.message);
      return { questoes: null, error: new Error(error.message) };
    }

    return { questoes: data || [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar questões:', message);
    return { questoes: null, error: new Error(message) };
  }
}

/**
 * Limpar respostas anteriores de um usuário (se for refazer diagnóstico)
 */
export async function limparRespostasPrevias(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return { success: false, error: new Error('userId é obrigatório') };
    }

    const { error } = await supabase.from('answers').delete().eq('user_id', userId);

    if (error) {
      console.error('Erro ao limpar respostas:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao limpar respostas:', message);
    return { success: false, error: new Error(message) };
  }
}
