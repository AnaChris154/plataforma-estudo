'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthUser, getCurrentUser, onAuthStateChange } from '@/services/authService';
import { UserProfile, getProfile } from '@/services/profileService';
import { School, getSchoolById } from '@/services/schoolService';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  school: School | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário atual ao montar
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Se tem usuário, carregar seu perfil e escola
        if (currentUser) {
          // ✅ getProfile() agora lê de metadata, não precisa query ao banco
          const { profile: userProfile, error: profileError } = await getProfile();

          if (profileError) {
            console.warn('⚠️ Erro ao carregar perfil:', profileError.message);
            setProfile(null);
          } else if (userProfile) {
            setProfile(userProfile);

            // Se tem school_id, carregar dados da escola
            if (userProfile?.school_id) {
              const { school: userSchool } = await getSchoolById(userProfile.school_id);
              setSchool(userSchool);
            } else {
              setSchool(null);
            }
          }
        } else {
          setProfile(null);
          setSchool(null);
        }
      } catch (err) {
        console.error('❌ Erro crítico no checkUser:', err);
        setProfile(null);
        setSchool(null);
      } finally {
        // ✅ SEMPRE desabilitar loading, mesmo com erro
        setLoading(false);
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const subscription = onAuthStateChange(async (authUser) => {
      try {
        setUser(authUser);

        // Se tem usuário, carregar seu perfil e escola
        if (authUser) {
          // ✅ getProfile() agora lê de metadata
          const { profile: userProfile, error: profileError } = await getProfile();

          if (profileError) {
            console.warn('⚠️ Erro ao carregar perfil:', profileError.message);
            setProfile(null);
          } else if (userProfile) {
            setProfile(userProfile);

            // Se tem school_id, carregar dados da escola
            if (userProfile?.school_id) {
              const { school: userSchool } = await getSchoolById(userProfile.school_id);
              setSchool(userSchool);
            } else {
              setSchool(null);
            }
          }
        } else {
          setProfile(null);
          setSchool(null);
        }
      } catch (err) {
        console.error('❌ Erro no onAuthStateChange:', err);
        setProfile(null);
        setSchool(null);
      } finally {
        // ✅ SEMPRE desabilitar loading, mesmo com erro
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        school,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
