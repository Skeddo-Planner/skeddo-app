-- Migration 003: Add Stripe customer ID to profiles
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kjlsnlzcammvbdbqpiwp/sql/new
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;
