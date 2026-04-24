-- ============================================================
-- ADICIONAR CONTROLE DE STATUS DO DIAGNÓSTICO
-- ============================================================

-- Adicionar coluna diagnostico_status à tabela student_goals
-- Estados: not_started | skipped | completed

ALTER TABLE public.student_goals
ADD COLUMN diagnostico_status TEXT DEFAULT 'not_started'
CHECK (diagnostico_status IN ('not_started', 'skipped', 'completed'));

-- Criar índice para otimizar buscas por status
CREATE INDEX idx_student_goals_diagnostico_status 
ON public.student_goals(diagnostico_status);

-- Comentário explicativo
COMMENT ON COLUMN public.student_goals.diagnostico_status IS 
'Status do diagnóstico do aluno: not_started (não iniciado), skipped (pulado), completed (concluído)';
