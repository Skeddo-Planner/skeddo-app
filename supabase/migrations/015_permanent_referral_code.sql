-- Migration 015: Add permanent referral code to profiles
-- Each user gets one unique referral code, not a new one each time.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
