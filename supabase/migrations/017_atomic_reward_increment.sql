-- Migration 017: Atomic increment function for referral reward credits
-- Prevents race conditions when two referrals convert simultaneously.

CREATE OR REPLACE FUNCTION public.increment_reward_months(target_user_id UUID, amount INT DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET reward_months_earned = COALESCE(reward_months_earned, 0) + amount
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
