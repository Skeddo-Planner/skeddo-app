-- Migration 002: Add profile fields for app data
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kjlsnlzcammvbdbqpiwp/sql/new
-- ============================================================

-- Add missing profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS postal_code     text,
  ADD COLUMN IF NOT EXISTS budget_goal     numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plan            text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS notify_registration   boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_new_programs   boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_weekly_summary boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS favorites       text[] DEFAULT '{}';
