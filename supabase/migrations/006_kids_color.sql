-- Add color column to kids table for user-customizable kid colors
ALTER TABLE kids ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '';
