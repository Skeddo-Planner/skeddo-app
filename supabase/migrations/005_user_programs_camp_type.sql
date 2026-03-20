-- Add camp_type column to user_programs so we can track what type of camp
-- (Summer Camp, Spring Break, Day Camp, etc.) a user's saved program is.
ALTER TABLE user_programs ADD COLUMN IF NOT EXISTS camp_type TEXT DEFAULT '';
