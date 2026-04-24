-- ============================================================
-- SISTEMA DE RECONHECIMENTO DE ALUNOS E PLANO DE ESTUDOS
-- ============================================================
-- Implementa: Goals → Diagnóstico → Nível → Plano de Estudo

-- 1) Tabela: STUDENT_GOALS (Objetivo do Aluno)
-- ============================================================
DROP TABLE IF EXISTS public.student_goals CASCADE;

CREATE TABLE public.student_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objetivo TEXT NOT NULL CHECK (objetivo IN ('faculdade', 'mercado')),
  curso_desejado TEXT,
  universidade TEXT,
  forma_ingresso TEXT CHECK (forma_ingresso IN ('enem', 'prouni', 'vestibular') OR forma_ingresso IS NULL),
  tempo_meta INTEGER, -- em meses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_student_goals_user_id ON public.student_goals(user_id);

-- ============================================================
-- 2) Tabela: QUESTIONS (Banco de Perguntas para Diagnóstico)
-- ============================================================
DROP TABLE IF EXISTS public.questions CASCADE;

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  materia TEXT NOT NULL CHECK (materia IN ('matematica', 'portugues', 'fisica', 'quimica', 'biologia', 'historia', 'geografia')),
  nivel TEXT NOT NULL CHECK (nivel IN ('facil', 'medio', 'dificil')),
  pergunta TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  resposta_correta TEXT NOT NULL CHECK (resposta_correta IN ('a', 'b', 'c', 'd')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questions_materia ON public.questions(materia);
CREATE INDEX idx_questions_nivel ON public.questions(nivel);

-- ============================================================
-- 3) Tabela: ANSWERS (Respostas do Aluno ao Diagnóstico)
-- ============================================================
DROP TABLE IF EXISTS public.answers CASCADE;

CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  resposta TEXT NOT NULL CHECK (resposta IN ('a', 'b', 'c', 'd')),
  correta BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_answers_user_id ON public.answers(user_id);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_user_question ON public.answers(user_id, question_id);

-- ============================================================
-- 4) Tabela: STUDY_PLANS (Plano de Estudo Gerado)
-- ============================================================
DROP TABLE IF EXISTS public.study_plans CASCADE;

CREATE TABLE public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia TEXT NOT NULL CHECK (materia IN ('matematica', 'portugues', 'fisica', 'quimica', 'biologia', 'historia', 'geografia')),
  nivel TEXT NOT NULL CHECK (nivel IN ('baixo', 'medio', 'alto')),
  prioridade TEXT NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
  origem TEXT DEFAULT 'diagnostico',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX idx_study_plans_materia ON public.study_plans(materia);
CREATE INDEX idx_study_plans_prioridade ON public.study_plans(prioridade);

-- ============================================================
-- RLS Policies
-- ============================================================

-- student_goals
ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler seus próprios goals"
  ON public.student_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus goals"
  ON public.student_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus goals"
  ON public.student_goals FOR UPDATE
  USING (auth.uid() = user_id);

-- questions (anyone can read)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler as perguntas"
  ON public.questions FOR SELECT
  USING (true);

-- answers
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler suas próprias respostas"
  ON public.answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas respostas"
  ON public.answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- study_plans
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler seu plano de estudo"
  ON public.study_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode criar/atualizar plano"
  ON public.study_plans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sistema pode atualizar plano"
  ON public.study_plans FOR UPDATE
  USING (true);

-- ============================================================
-- SEED DATA: Perguntas de Diagnóstico
-- ============================================================

-- MATEMÁTICA (3 fácil + 2 médio + 2 difícil = 7 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('matematica', 'facil', 'Quanto é 2 + 3?', '4', '5', '6', '7', 'b'),
('matematica', 'facil', 'Qual é o dobro de 7?', '12', '14', '16', '18', 'b'),
('matematica', 'facil', 'Quanto é 10 - 4?', '5', '6', '7', '8', 'b'),
('matematica', 'medio', 'Qual é a solução para x + 5 = 12?', '6', '7', '8', '9', 'b'),
('matematica', 'medio', 'Se um triângulo tem lados 3, 4 e 5, ele é um triângulo?', 'Obtusângulo', 'Retângulo', 'Acutângulo', 'Isósceles', 'b'),
('matematica', 'dificil', 'Qual é a derivada de x² + 3x?', '2x + 2', '2x + 3', 'x + 3', 'x²', 'b'),
('matematica', 'dificil', 'Resolvendo a equação 2x² - 8 = 0, qual é uma solução?', '1', '2', '3', '4', 'b');

-- PORTUGUÊS (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('portugues', 'facil', 'Qual é o plural de "livro"?', 'livros', 'livro', 'livrança', 'livravam', 'a'),
('portugues', 'facil', 'Complete: "Eu ____ aqui ontem."', 'estou', 'estou sendo', 'estava', 'estarei', 'c'),
('portugues', 'medio', 'Identifique a figura de linguagem em "Suas lágrimas eram rios."', 'Metáfora', 'Aliteração', 'Antítese', 'Ironia', 'a'),
('portugues', 'medio', 'Qual é a classe gramatical de "rápido" na frase "O menino corria rápido"?', 'Adjetivo', 'Advérbio', 'Verbo', 'Substantivo', 'b'),
('portugues', 'dificil', 'Analise: "Conquanto trabalhasse muito, não conseguia sucesso." Qual é a relação entre as orações?', 'Conclusão', 'Concessão', 'Causalidade', 'Adição', 'b'),
('portugues', 'dificil', 'Em "A menina, quem o viu, sabia quem ela era.", há quantas orações?', '2', '3', '4', '5', 'c');

-- FÍSICA (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('fisica', 'facil', 'Qual é a velocidade da luz no vácuo aproximadamente?', '150.000 km/s', '300.000 km/s', '450.000 km/s', '600.000 km/s', 'b'),
('fisica', 'facil', 'Qual força atua em um objeto em queda livre (negligenciando resistência do ar)?', 'Fricção', 'Peso', 'Tensão', 'Elasticidade', 'b'),
('fisica', 'medio', 'Se um auto viaja a 20 m/s durante 5 segundos, qual é a distância percorrida?', '80 m', '100 m', '120 m', '140 m', 'b'),
('fisica', 'medio', 'Um corpo tem massa de 10 kg. Qual é seu peso na Terra (g ≈ 10 m/s²)?', '50 N', '100 N', '150 N', '200 N', 'b'),
('fisica', 'dificil', 'Qual é a primeira lei de Newton?', 'F = ma', 'Lei da inércia', 'Ação e reação', 'Conservação da energia', 'b'),
('fisica', 'dificil', 'Um objeto oscila em MHS com amplitude 2 m. Qual é a energia potencial máxima? (m = 1 kg, ω = 2 rad/s)', '4 J', '8 J', '16 J', '32 J', 'c');

-- QUÍMICA (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('quimica', 'facil', 'Quantos elementos tem a molécula de água (H₂O)?', '1', '2', '3', '4', 'c'),
('quimica', 'facil', 'O que é um ácido?', 'Substância com pH > 7', 'Substância com pH < 7', 'Substância com pH = 7', 'Qualquer composto de carbono', 'b'),
('quimica', 'medio', 'Qual é o número atômico do Oxigênio?', '6', '7', '8', '9', 'c'),
('quimica', 'medio', 'Em uma ligação iônica, O que acontece?', 'Compartilhamento de elétrons', 'Transferência de elétrons', 'Sobreposição de orbitais', 'Indução de dipolo', 'b'),
('quimica', 'dificil', 'Qual é a fórmula da Lei das Proporções Definidas?', 'm1/m2 = constante', 'PV = nRT', 'q = mcΔT', 'pH + pOH = 14', 'a'),
('quimica', 'dificil', 'Quantos elétrons de valência tem um átomo de carbono?', '2', '4', '6', '8', 'b');

-- BIOLOGIA (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('biologia', 'facil', 'Qual é a unidade básica da vida?', 'Átomo', 'Molécula', 'Célula', 'Órgão', 'c'),
('biologia', 'facil', 'Quantos cromossomos tem um ser humano?', '23', '46', '92', '184', 'b'),
('biologia', 'medio', 'Qual é a função principal da mitocôndria?', 'Síntese de proteínas', 'Produção de energia (ATP)', 'Armazenamento de informações', 'Defesa celular', 'b'),
('biologia', 'medio', 'Em fotossíntese, qual é o produto?', 'CO₂ e agua', 'Glicose e oxigênio', 'Proteína e água', 'Gordura e gás carbônico', 'b'),
('biologia', 'dificil', 'Qual é a fase do ciclo celular onde ocorre a replicação do DNA?', 'G1', 'S', 'G2', 'M', 'b'),
('biologia', 'dificil', 'Em genética, qual é a razão fenotípica esperada em cruzamento Aa x Aa?', '1:1', '1:2:1', '3:1', '9:3:3:1', 'c');

-- HISTÓRIA (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('historia', 'facil', 'Em que ano terminou a Segunda Guerra Mundial?', '1943', '1945', '1947', '1950', 'b'),
('historia', 'facil', 'Quem foi o primeiro presidente do Brasil República?', 'Deodoro da Fonseca', 'Hermes da Fonseca', 'Prudente de Morais', 'Campos Sales', 'a'),
('historia', 'medio', 'Qual era a principal ideologia do regime de Getúlio Vargas (1937-1945)?', 'Comunismo', 'Fascismo', 'Anarquismo', 'Socialismo democrático', 'b'),
('historia', 'medio', 'Qual foi a consequência do Tratado de Tordesilhas (1494)?', 'Fim do Império Romano', 'Divisão das terras coloniais entre Portugal e Espanha', 'Fundação da união ibérica', 'Descoberta da América Central', 'b'),
('historia', 'dificil', 'Qual era o objetivo da Revolução Francesa (1789)?', 'Restabelecer o absolutismo', 'Estabelecer princípios de igualdade e liberdade', 'Expandir territórios coloniais', 'Fortalecer a Igreja Católica', 'b'),
('historia', 'dificil', 'Em qual período predominou o sistema feudal na Europa?', 'Antiguidade', 'Idade Média', 'Renascimento', 'Iluminismo', 'b');

-- GEOGRAFIA (2 fácil + 2 médio + 2 difícil = 6 perguntas)
INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('geografia', 'facil', 'Qual é a capital do Brasil?', 'São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador', 'b'),
('geografia', 'facil', 'Qual é o maior oceano do mundo?', 'Oceano Atlântico', 'Oceano Índico', 'Oceano Pacífico', 'Oceano Ártico', 'c'),
('geografia', 'medio', 'Qual país tem o maior PIB do mundo?', 'China', 'Alemanha', 'Estados Unidos', 'Japão', 'c'),
('geografia', 'medio', 'Qual é a principal linha imaginária que divide o planeta em dois hemisférios?', 'Meridiano de Greenwich', 'Linha do Equador', 'Trópico de Capricórnio', 'Círculo Polar Ártico', 'b'),
('geografia', 'dificil', 'Qual desses rios é considerado o mais longo da América do Sul?', 'Rio Paraná', 'Rio Amazonas', 'Rio São Francisco', 'Rio Orinoco', 'b'),
('geografia', 'dificil', 'Qual é a densidade demográfica da Índia aproximadamente (hab/km²)?', '124', '248', '372', '496', 'c');

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

-- SELECT COUNT(*) FROM questions; -- Deve retornar 42 perguntas
-- SELECT DISTINCT materia FROM questions; -- Deve retornar 7 matérias
-- SELECT COUNT(*) as total_por_nivel, nivel FROM questions GROUP BY nivel;
