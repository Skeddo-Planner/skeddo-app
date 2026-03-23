-- Add location, start_date, end_date columns to shared_activities
-- for displaying camp location and date range on feed cards
ALTER TABLE public.shared_activities ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.shared_activities ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE public.shared_activities ADD COLUMN IF NOT EXISTS end_date TEXT;
