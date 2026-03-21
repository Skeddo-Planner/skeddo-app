-- Migration 016: Add reward tracking to profiles for referral credits
-- When billing goes live, check these fields to apply free months.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reward_months_earned INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referred_by TEXT;  -- referral code used when signing up
