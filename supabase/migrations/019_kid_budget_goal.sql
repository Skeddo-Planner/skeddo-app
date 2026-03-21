-- Migration 019: Per-kid budget goals
ALTER TABLE public.kids
  ADD COLUMN IF NOT EXISTS budget_goal NUMERIC DEFAULT NULL;
