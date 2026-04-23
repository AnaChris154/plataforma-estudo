import { supabase } from '@/lib/supabaseClient';

export interface StudentGoal {
  id: string;
  user_id: string;
  objetivo: 'faculdade' | 'mercado' | 'escola';
  curso_desejado: string | null;
  universidade: string | null;
  forma_ingresso: 'enem' | 'prouni' | 'vestibular' | 'certificados' | 'cursos_profissionalizantes' | null;
  tempo_meta: number | null;
  diagnostico_status: 'not_started' | 'skipped' | 'completed';
  created_at: string;
  updated_at: string;
}

/**
 * Criar objetivo do aluno
 */
export async function createStudentGoal(
  userId: string,
  objetivo: 'faculdade' | 'mercado' | 'escola',
  cursoDesejado?: string,
  universidade?: string,
  formaIngresso?: 'enem' | 'prouni' | 'vestibular' | 'certificados' | 'cursos_profissionalizantes',
  tempoMeta?: number
): Promise<{ goal: StudentGoal | null; error: Error | null }> {
  try {
    if (!userId || !objetivo) {
      return { goal: null, error: new Error('userId e objetivo são obrigatórios') };
    }

    if (objetivo !== 'faculdade' && objetivo !== 'mercado' && objetivo !== 'escola') {
      return { goal: null, error: new Error('Objetivo inválido') };
    }

    const { data, error } = await supabase
      .from('student_goals')
      .insert([
        {
          user_id: userId,
          objetivo,
          curso_desejado: cursoDesejado || null,
          universidade: universidade || null,
          forma_ingresso: formaIngresso || null,
          tempo_meta: tempoMeta || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar objetivo:', error.message);
      return { goal: null, error: new Error(error.message) };
    }

    return {
      goal: {
        id: data.id,
        user_id: data.user_id,
        objetivo: data.objetivo,
        curso_desejado: data.curso_desejado,
        universidade: data.universidade,
        forma_ingresso: data.forma_ingresso,
        tempo_meta: data.tempo_meta,
        diagnostico_status: data.diagnostico_status || 'not_started',
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao criar objetivo:', message);
    return { goal: null, error: new Error(message) };
  }
}

/**
 * Obter objetivo do aluno
 */
export async function getStudentGoal(
  userId: string
): Promise<{ goal: StudentGoal | null; error: Error | null }> {
  try {
    if (!userId) {
      return { goal: null, error: new Error('userId é obrigatório') };
    }

    const { data, error } = await supabase
      .from('student_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { goal: null, error: null };
      }
      console.error('Erro ao buscar objetivo:', error.message);
      return { goal: null, error: new Error(error.message) };
    }

    if (!data) {
      return { goal: null, error: null };
    }

    return {
      goal: {
        id: data.id,
        user_id: data.user_id,
        objetivo: data.objetivo,
        curso_desejado: data.curso_desejado,
        universidade: data.universidade,
        forma_ingresso: data.forma_ingresso,
        tempo_meta: data.tempo_meta,
        diagnostico_status: data.diagnostico_status || 'not_started',
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar objetivo:', message);
    return { goal: null, error: new Error(message) };
  }
}

/**
 * Atualizar objetivo do aluno
 */
export async function updateStudentGoal(
  userId: string,
  updates: Partial<Omit<StudentGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ goal: StudentGoal | null; error: Error | null }> {
  try {
    if (!userId) {
      return { goal: null, error: new Error('userId é obrigatório') };
    }

    const { data, error } = await supabase
      .from('student_goals')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar objetivo:', error.message);
      return { goal: null, error: new Error(error.message) };
    }

    if (!data) {
      return { goal: null, error: null };
    }

    return {
      goal: {
        id: data.id,
        user_id: data.user_id,
        objetivo: data.objetivo,
        curso_desejado: data.curso_desejado,
        universidade: data.universidade,
        forma_ingresso: data.forma_ingresso,
        tempo_meta: data.tempo_meta,
        diagnostico_status: data.diagnostico_status || 'not_started',
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao atualizar objetivo:', message);
    return { goal: null, error: new Error(message) };
  }
}

/**
 * Atualizar status do diagnóstico
 */
export async function atualizarStatusDiagnostico(
  userId: string,
  status: 'not_started' | 'skipped' | 'completed'
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId || !status) {
      return { success: false, error: new Error('userId e status são obrigatórios') };
    }

    if (!['not_started', 'skipped', 'completed'].includes(status)) {
      return { success: false, error: new Error('Status inválido') };
    }

    const { error } = await supabase
      .from('student_goals')
      .update({ diagnostico_status: status })
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao atualizar status do diagnóstico:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao atualizar status:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Resetar diagnóstico (deletar respostas, resetar status)
 */
export async function resetarDiagnostico(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return { success: false, error: new Error('userId é obrigatório') };
    }

    // 1. Deletar todas as respostas do usuário
    const { error: answersError } = await supabase
      .from('answers')
      .delete()
      .eq('user_id', userId);

    if (answersError) {
      console.error('Erro ao deletar respostas:', answersError.message);
      return { success: false, error: new Error(answersError.message) };
    }

    // 2. Deletar plano de estudos
    const { error: plansError } = await supabase
      .from('study_plans')
      .delete()
      .eq('user_id', userId);

    if (plansError) {
      console.error('Erro ao deletar plano:', plansError.message);
      return { success: false, error: new Error(plansError.message) };
    }

    // 3. Resetar status para not_started
    const { error: statusError } = await supabase
      .from('student_goals')
      .update({ diagnostico_status: 'not_started' })
      .eq('user_id', userId);

    if (statusError) {
      console.error('Erro ao resetar status:', statusError.message);
      return { success: false, error: new Error(statusError.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao resetar diagnóstico:', message);
    return { success: false, error: new Error(message) };
  }
}

