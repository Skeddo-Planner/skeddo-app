-- Migration 007: Push notification infrastructure
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kjlsnlzcammvbdbqpiwp/sql/new
-- ============================================================

-- 1. Push subscriptions table (one row per device per user)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  endpoint    text        NOT NULL,
  p256dh      text        NOT NULL,
  auth        text        NOT NULL,
  user_agent  text,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

-- RLS for push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Notification log (prevents duplicate sends, audit trail)
CREATE TABLE IF NOT EXISTS public.notification_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type          text        NOT NULL,
  reference_id  text,
  sent_at       timestamptz DEFAULT now()
);

-- No RLS on notification_log — only accessed by service role (server-side)
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- 3. Add new notification preference columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notify_upcoming_programs  boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_circle_activity    boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_favourite_updates  boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_waitlist_alerts    boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_budget_milestones  boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_circle_requests    boolean DEFAULT true;
