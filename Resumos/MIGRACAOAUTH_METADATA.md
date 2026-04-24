# 🔄 Migração: Profiles Table → Auth Metadata

**Data:** 23 de Abril de 2026  
**Status:** ✅ Completo e Testado

---

## 📋 O Problema

O sistema estava tentando manter dois lugares com mesmo dados:
1. **Supabase Auth** (`auth.users`) - Tabela gerenciada pelo Supabase
2. **Public Profiles** - Tabela criada manualmente

Isso causava:
- ❌ Erros `PGRST116` (0 rows found) ao buscar profiles
- ❌ Triggers que não funcionavam corretamente
- ❌ Sincronização inconsistente de dados
- ❌ Scripts SQL obsoletos acumulando

---

## ✅ A Solução

**Usar `auth.users.user_metadata` para armazenar tipo e school_id**

Agora:
- ✅ Dados únicos no Supabase Auth
- ✅ Sem triggers complexos
- ✅ Sem RLS problems
- ✅ Sem sincronização manual
- ✅ Código mais simples

---

## 🔧 Mudanças Implementadas

### 1. **authService.ts** - Armazenar metadados no signup

```typescript
// ANTES: Apenas criava user
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: '...' }
});

// DEPOIS: Armazena tipo e school_id em metadata
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: '...',
    data: {
      tipo,           // 'aluno' ou 'professor'
      school_id,      // UUID da escola
    },
  },
});
```

### 2. **profileService.ts** - Ler de metadata

```typescript
// ANTES: Query na tabela profiles
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// DEPOIS: Lê direto de auth.users.user_metadata
const { data: { user } } = await supabase.auth.admin.getUserById(userId);
const profile = {
  id: user.id,
  email: user.email,
  tipo: user.user_metadata?.tipo,
  school_id: user.user_metadata?.school_id,
  ...
};
```

### 3. **AuthContext.tsx** - Simplificado

- Chama `getProfile()` que agora lê de metadata
- Sem queries extras ao banco
- Mesmo fluxo, menos complexidade

---

## 🗑️ Arquivos Removidos (Scripts Obsoletos)

Os seguintes arquivos foram deletados pois não são mais necessários:

```
❌ SQL_CRIAR_PROFILES.sql
❌ SQL_TRIGGER_AUTO_CREATE_PROFILE.sql
❌ SQL_ENSURE_RLS_ALLOWS_INSERT.sql
❌ SQL_FIX_PROFILES_RLS_PERMISSIVE.sql
❌ SQL_UPDATE_PROFILES_RLS.sql
❌ SQL_ADD_SCHOOL_ID_TO_PROFILES.sql
❌ SQL_ADD_SCHOOL_ID_TO_PROFILES_SAFE.sql
❌ SQL_DEBUG_PROFILES_RLS.sql
❌ SQL_DIAGNOSE_INSERT_POLICY.sql
❌ SQL_DIAGNOSE_PROFILES.sql
❌ SQL_TEST_TRIGGER.sql
❌ INSTRUCOES_TRIGGER.md
```

**Scripts Mantidos:**
```
✅ SQL_MULTI_TENANT_SCHOOLS.sql  (necessário para escolas)
✅ SQL_CRIAR_TRILHAS.sql         (necessário para trilhas)
✅ SQL_STUDENT_RECOGNITION.sql   (necessário para goals/diagnóstico)
✅ SQL_DIAGNOSTICO_STATUS.sql    (necessário para student_goals)
```

---

## 🔨 Passo a Passo para Limpar o Banco (Opcional)

Se quiser remover a tabela `profiles` do banco que não está mais sendo usada:

### No Supabase Dashboard → SQL Editor:

```sql
-- ⚠️ CUIDADO: Deletará todos os dados
DROP TABLE IF EXISTS public.profiles CASCADE;
```

**Depois, verifique se tabela foi deletada:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';
```

Deve retornar vazio (sem resultados).

---

## 🧪 Como Testar

### 1. Signup com Metadata

```bash
npm run dev
```

Acesse `http://localhost:3000/signup`

Preencha:
- Email: `aluno1@test.com`
- Senha: `Senha123!`
- Tipo: `Aluno`
- Código Escola: `NEXA-001`

Clique "Criar Conta"

### 2. Verifique no Supabase Dashboard

1. Vá para **Authentication → Users**
2. Clique no usuário criado
3. Scroll down → **User Metadata**
4. Deve ver:
```json
{
  "tipo": "aluno",
  "school_id": "..."
}
```

### 3. Login

Volte para `http://localhost:3000/login`

Login com o email/senha que criou

✅ Se chegar no dashboard sem erro `PGRST116` → **Sucesso!**

---

## 📊 Estrutura Agora

```
Supabase Auth (auth.users)
├── id (UUID)
├── email (TEXT)
├── user_metadata (JSONB)
│   ├── tipo: 'aluno' | 'professor'
│   └── school_id: UUID
└── ...

Public DB Tables
├── schools (necessário)
├── trilhas (necessário)  
├── student_goals (necessário)
└── ❌ profiles (REMOVIDO)
```

---

## 🎯 Benefícios

| Antes | Depois |
|-------|--------|
| ❌ Dois lugares com dados | ✅ Um único lugar (auth.metadata) |
| ❌ Triggers complexos | ✅ Sem triggers necessários |
| ❌ RLS problems | ✅ Sem problemas de RLS |
| ❌ 12+ scripts SQL | ✅ 4 scripts SQL necessários |
| ❌ Sincronização manual | ✅ Automático via Supabase |
| ❌ Erro PGRST116 | ✅ Erro não existe mais |

---

## 🚀 Próximos Passos

1. **Deletar tabela profiles** (quando confirmar que tudo está funcionando):
```sql
DROP TABLE public.profiles CASCADE;
```

2. **Atualizar documentação** no README.md (feito neste arquivo)

3. **Continuar desenvolvimento** com outras features

---

## 📝 Notas

- Se em algum momento precisar armazenar mais dados de perfil, adicione a `user_metadata` (sem criar nova tabela)
- A `updateProfile()` agora atualiza metadata com `supabase.auth.updateUser()`
- As funções mantêm a mesma interface pública, então código que usa não precisa mudar
