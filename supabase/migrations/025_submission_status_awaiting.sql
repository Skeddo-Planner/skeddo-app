-- Migration 025: Add 'awaiting_verification' status to program_submissions
-- Needed for the automated submission pipeline: pending → awaiting_verification → approved/rejected

ALTER TABLE public.program_submissions
  DROP CONSTRAINT IF EXISTS program_submissions_status_check;

ALTER TABLE public.program_submissions
  ADD CONSTRAINT program_submissions_status_check
  CHECK (status IN ('pending', 'awaiting_verification', 'approved', 'rejected'));
