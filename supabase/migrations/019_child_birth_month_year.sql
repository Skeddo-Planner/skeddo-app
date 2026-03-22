-- Add birth_month and birth_year to kids table for dynamic age calculation
-- Replaces static 'age' field (kept for backward compatibility)

ALTER TABLE public.kids
  ADD COLUMN IF NOT EXISTS birth_month INTEGER CHECK (birth_month >= 1 AND birth_month <= 12),
  ADD COLUMN IF NOT EXISTS birth_year  INTEGER CHECK (birth_year >= 2000 AND birth_year <= 2030);
