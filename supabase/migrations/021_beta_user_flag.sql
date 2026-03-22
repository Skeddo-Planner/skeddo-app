-- Flag beta users for lifetime Plus access
-- All users who signed up during beta get Skeddo Plus for free, forever.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_beta_user BOOLEAN DEFAULT false;

-- Mark all EXISTING users as beta users (they signed up during beta)
UPDATE public.profiles SET is_beta_user = true;

-- New users created after this migration will default to false.
-- The app sets is_beta_user = true during signup while IS_BETA is active.
