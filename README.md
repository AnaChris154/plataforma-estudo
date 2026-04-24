<<<<<<<<< Temporary merge branch 1
# 📚 Plataforma de Estudos para Escolas Públicas

Aplicação web desenvolvida para apoiar o aprendizado de alunos da rede pública, oferecendo trilhas de estudo, exercícios e acompanhamento de desempenho em um ambiente acessível e intuitivo.

---

## 🚀 Objetivo

Criar uma plataforma simples, acessível e eficiente que permita:

* Alunos estudarem de forma estruturada
* Professores acompanharem o progresso
* Escolas terem visibilidade do desempenho geral

---

## 🧠 Funcionalidades (MVP)

### 👨‍🎓 Aluno

* Login/autenticação
* Acesso a trilhas de estudo
* Resolução de exercícios
* Visualização de progresso

### 🏫 Escola / Professor

* Dashboard com lista de alunos
* Acompanhamento de desempenho
* Visualização de progresso por aluno

---

## 🏗️ Tecnologias

* Frontend + Backend: Next.js
* Banco de dados: PostgreSQL
* Autenticação e backend auxiliar: Supabase
* Deploy: Vercel
* Versionamento: Git + GitHub

---

## 📁 Estrutura do Projeto

```bash
/app            # Rotas e páginas da aplicação
/components     # Componentes reutilizáveis (UI)
/services       # Regras de negócio e chamadas de API
/lib            # Configurações (auth, db, etc.)
/styles         # Estilos globais
/public         # Arquivos estáticos
```

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/plataforma-estudos.git
```

### 2. Acesse a pasta

```bash
cd plataforma-estudos
```

### 3. Instale as dependências
=========
# NEXA - Plataforma de Estudos

MVP de uma plataforma de estudos para escolas públicas, desenvolvida com foco em simplicidade, organização e mobile-first.

## 🎯 Objetivo

Criar uma plataforma educacional moderna e acessível para escolas públicas, permitindo que alunos acompanhem seu progresso e professores gerenciem suas turmas de forma simples e intuitiva.

## 📁 Estrutura do Projeto

```
nexa/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout global
│   ├── page.tsx           # Página inicial
│   ├── login/             # Rota de login
│   ├── aluno/
│   │   └── dashboard/     # Dashboard do aluno
│   └── professor/
│       └── dashboard/     # Dashboard do professor
├── components/            # Componentes reutilizáveis
│   ├── Navigation.tsx     # Navegação principal
│   └── Header.tsx         # Componente de cabeçalho
├── lib/                   # Utilitários e constantes
│   └── constants.ts       # Constantes da app
├── services/              # Serviços e lógica de negócio (futuro)
├── styles/                # Estilos globais
│   └── globals.css        # CSS global com Tailwind
└── package.json           # Dependências do projeto
```

## 🛠️ Tecnologias

- **Next.js 15+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **ESLint** - Análise de código
- **Prettier** - Formatação de código

## 🚀 Como Começar

### Instalação
>>>>>>>>> Temporary merge branch 2

```bash
npm install
```

<<<<<<<<< Temporary merge branch 1
### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
SUPABASE_URL=
SUPABASE_KEY=
```

### 5. Execute o projeto
=========
### Desenvolvimento
>>>>>>>>> Temporary merge branch 2

```bash
npm run dev
```

<<<<<<<<< Temporary merge branch 1
A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🌿 Fluxo de Git

Branches principais:

* `main` → produção
* `dev` → desenvolvimento

Padrão de branches:

```
feature/nome-da-feature
```

Exemplo:

```
feature/login
feature/exercicios
```

---

## 🧾 Padrão de Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: melhoria de código
```

---

## 👥 Organização da Equipe

Sugestão inicial:

* Dev 1 → Autenticação + banco de dados
* Dev 2 → Interface do aluno
* Dev 3 → Dashboard da escola

---

## 📌 Roadmap (MVP)

* [ ] Autenticação
* [ ] Cadastro de alunos
* [ ] Trilhas de estudo
* [ ] Exercícios
* [ ] Sistema de progresso
* [ ] Dashboard escolar

---

## ⚠️ Boas práticas

* Não commitar diretamente na `main`
* Sempre atualizar a branch `dev` antes de começar
* Criar PRs pequenos e frequentes
* Não subir arquivos `.env`

---

## 💡 Visão futura

* Transformar em aplicativo mobile
* Implementar funcionamento offline (PWA)
* Sistema de recomendações personalizadas
* Gamificação do aprendizado

---

## 📄 Licença

Este projeto está em fase de desenvolvimento e ainda não possui uma licença definida.
=========
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build para Produção

```bash
npm run build
npm start
```

### Linting e Formatação

```bash
# Verificar erros de lint
npm run lint

# Formatar código com Prettier
npx prettier --write .
```

## 📱 Características

- ✅ Interface limpa e intuitiva
- ✅ Otimizada para dispositivos móveis (mobile-first)
- ✅ Organização de conteúdo por disciplina
- ✅ Dashboard para alunos e professores
- ✅ Navegação consistente entre páginas
- ✅ Componentes reutilizáveis

## 🎨 Design System

### Cores
- Primária: Blue (#2563EB)
- Secundária: Gray (#6B7280)
- Sucesso: Green (#16A34A)
- Aviso: Purple (#A855F7)

### Tipografia
- Título Principal: Geist (34px, bold)
- Subtítulos: 20px, bold
- Corpo: 14px, regular

## 📝 Pasta `components`

Componentes React reutilizáveis que podem ser importados em qualquer página:
- `Navigation` - Barra de navegação principal
- `Header` - Componente de cabeçalho com título e descrição
- *(Futuros componentes serão adicionados)*

## 📚 Pasta `lib`

Utilitários, constantes e helpers:
- `constants.ts` - Constantes da aplicação (rotas, tipos de usuário)
- *(Futuros: helpers, tipos TypeScript)*

## 🔧 Pasta `services`

Lógica de negócio e chamadas à API:
- *(A ser preenchida com autenticação, chamadas a backend)*

## 🎯 Próximos Passos

- [ ] Integrar com backend para autenticação
- [ ] Implementar sistema de reais disciplinas e atividades
- [ ] Adicionar gráficos de progresso
- [ ] Implementar notificações
- [ ] Adicionar sistema de comentários e feedback
- [ ] Otimizar performance e SEO

## 📄 Licença

Este projeto é desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ para educação pública**
>>>>>>>>> Temporary merge branch 2
