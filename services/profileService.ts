import { supabase } from '@/lib/supabaseClient';

/**
 * Tipo para usuário do auth (com metadados)
 */
export type AuthUserData = {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: Record<string, unknown>;
};

/**
 * Interface do Perfil de Usuário
 * ✅ Agora obtido do auth.users.user_metadata (sem necessidade de tabela profiles)
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  phone: string | null;
  tipo: 'aluno' | 'professor';
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Construir perfil a partir de dados de auth.users
 * ✅ Função auxiliar para reutilizar lógica
 */
function buildProfileFromAuthUser(userToCheck: AuthUserData | null): UserProfile | null {
  if (!userToCheck) {
    return null;
  }

  const metadata = userToCheck.user_metadata || {};

  return {
    id: userToCheck.id,
    email: userToCheck.email || '',
    display_name: (metadata.display_name as string) || userToCheck.email?.split('@')[0] || 'Usuário',
    phone: (metadata.phone as string | null) || null,
    tipo: (metadata.tipo as 'aluno' | 'professor') || 'aluno',
    school_id: (metadata.school_id as string | null) || null,
    created_at: userToCheck.created_at || new Date().toISOString(),
    updated_at: userToCheck.updated_at || new Date().toISOString(),
  };
}

/**
 * Obter perfil do usuário autenticado a partir dos metadados
 * ✅ Lê direto de auth.users.user_metadata (sem query ao banco)
 * @returns Promise com { profile, error }
 */
export async function getProfile(): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    // ✅ Obter usuário autenticado atual
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.warn('⚠️ Erro ao obter usuário:', error.message);
      return { profile: null, error: null }; // Não é erro crítico, apenas sem autenticação
    }

    const profile = buildProfileFromAuthUser(user as AuthUserData | null);

    return { profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('❌ Erro ao buscar perfil:', message);
    return { profile: null, error: new Error(message) };
  }
}

/**
 * Atualizar metadados do perfil do usuário autenticado
 * @param updates Dados a atualizar em user_metadata (partial)
 * @returns Promise com { profile, error }
 */
export async function updateProfile(
  updates: Partial<Pick<UserProfile, 'tipo' | 'school_id' | 'display_name' | 'phone'>>
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    // Validar tipo se estiver sendo atualizado
    if (updates.tipo && updates.tipo !== 'aluno' && updates.tipo !== 'professor') {
      return {
        profile: null,
        error: new Error('tipo deve ser "aluno" ou "professor"'),
      };
    }

    // ✅ Atualizar metadados do usuário autenticado
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      console.error('❌ Erro ao atualizar perfil:', error.message);
      return { profile: null, error: new Error(error.message) };
    }

    const profile = buildProfileFromAuthUser(data.user as AuthUserData | null);

    if (!profile) {
      return { profile: null, error: new Error('Erro ao atualizar perfil') };
    }

    return { profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('❌ Erro ao atualizar perfil:', message);
    return { profile: null, error: new Error(message) };
  }
}
