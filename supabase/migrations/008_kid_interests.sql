-- Migration 008: Add activity interests to kids table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.kids
  ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';
