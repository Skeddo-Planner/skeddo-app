-- Migration 012: Add user-submitted program support to directory_programs
-- When users manually add programs, they're inserted here so all users can discover them.

ALTER TABLE public.directory_programs
  ADD COLUMN IF NOT EXISTS user_submitted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS submitted_by_name TEXT,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
