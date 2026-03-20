-- Migration 009: Add early bird pricing fields to directory_programs
-- Run this in the Supabase SQL Editor

ALTER TABLE public.directory_programs
  ADD COLUMN IF NOT EXISTS early_bird_cost     numeric,
  ADD COLUMN IF NOT EXISTS early_bird_deadline  date;
