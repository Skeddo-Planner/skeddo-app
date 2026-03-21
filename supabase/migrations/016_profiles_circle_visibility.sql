-- Allow circle members to see each other's display names
-- Replaces the original "own profile only" SELECT policy

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

CREATE POLICY "Users can read own and circle member profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR id IN (
      SELECT cm2.user_id FROM public.circle_memberships cm2
      WHERE cm2.circle_id IN (
        SELECT cm1.circle_id FROM public.circle_memberships cm1
        WHERE cm1.user_id = auth.uid()
      )
    )
    OR id IN (
      SELECT user_id FROM public.circle_memberships
      WHERE circle_id IN (
        SELECT id FROM public.circles WHERE created_by = auth.uid()
      )
    )
  );
