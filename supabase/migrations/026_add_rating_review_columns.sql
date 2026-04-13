-- Add rating and review columns to user_programs (if not present)
-- These columns allow parents to rate and review programs they've enrolled in.

ALTER TABLE user_programs ADD COLUMN IF NOT EXISTS rating smallint;
ALTER TABLE user_programs ADD COLUMN IF NOT EXISTS review text DEFAULT '';
